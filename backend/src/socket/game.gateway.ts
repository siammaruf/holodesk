import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { SessionsService } from '../sessions/sessions.service';
import { RealmsService } from '../realms/realms.service';
import { ProfilesService } from '../profiles/profiles.service';
import { UsersService } from '../users/users.service';

const JoinRealm = z.object({
  realmId: z.string(),
  shareId: z.string(),
});

const MovePlayer = z.object({
  x: z.number(),
  y: z.number(),
});

const Teleport = z.object({
  x: z.number(),
  y: z.number(),
  roomIndex: z.number(),
});

const ChangedSkin = z.string();
const NewMessage = z.string();

function removeExtraSpaces(text: string) {
  let value = text.replace(/\s\s+/g, ' ');
  if (value.startsWith(' ')) {
    value = value.substring(1);
  }
  value = value.trim();
  return value;
}

function formatEmailToName(email: string) {
  return email.split('@')[0];
}

@WebSocketGateway({
  cors: {
    origin: (process.env.FRONTEND_URL || 'http://localhost:3000'),
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private joiningInProgress = new Set<string>();
  private users = new Map<string, any>();

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly realmsService: RealmsService,
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const cookies: Record<string, string> = {};
      if (cookieHeader) {
        cookieHeader.split(';').forEach((pair) => {
          const [key, ...rest] = pair.trim().split('=');
          cookies[key] = rest.join('=');
        });
      }

      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers['authorization']?.toString().split(' ')[1] ||
        cookies['access_token'];

      const uid = socket.handshake.query.uid as string;

      if (!token || !uid) {
        socket.disconnect(true);
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'default-secret',
      });

      if (payload.sub !== uid) {
        socket.disconnect(true);
        return;
      }

      const user = await this.usersService.findById(uid);
      if (!user) {
        socket.disconnect(true);
        return;
      }

      this.users.set(uid, user);
    } catch {
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: Socket) {
    const uid = this.getUidFromSocket(socket);
    if (!uid) return;

    const session = this.sessionsService.getPlayerSession(uid);
    if (!session) {
      this.users.delete(uid);
      return;
    }

    // Notify WebRTC peers in the same proximity group before logout
    const player = session.getPlayer(uid);
    if (player && player.proximityId) {
      const room = session.getPlayerRoom(uid);
      const peers = session.getPlayersInRoom(room).filter(
        (p) => p.proximityId === player.proximityId && p.uid !== uid,
      );
      for (const peer of peers) {
        this.server.to(peer.socketId).emit('webrtc:peer-left', { uid });
      }
    }

    const socketIds = this.sessionsService.getSocketIdsInRoom(
      session.id,
      session.getPlayerRoom(uid),
    );
    const success = this.sessionsService.logOutBySocketId(socket.id);
    if (success) {
      this.emitToSocketIds(socketIds, 'playerLeftRoom', uid);
      this.users.delete(uid);
    }
  }

  @SubscribeMessage('joinRealm')
  async handleJoinRealm(socket: Socket, realmData: z.infer<typeof JoinRealm>) {
    const uid = this.getUidFromSocket(socket);
    if (!uid) return;

    const rejectJoin = (reason: string) => {
      socket.emit('failedToJoinRoom', reason);
      this.joiningInProgress.delete(uid);
    };

    if (!JoinRealm.safeParse(realmData).success) {
      return rejectJoin('Invalid request data.');
    }

    if (this.joiningInProgress.has(uid)) {
      return rejectJoin('Already joining a space.');
    }
    this.joiningInProgress.add(uid);

    const session = this.sessionsService.getSession(realmData.realmId);
    if (session) {
      const playerCount = session.getPlayerCount();
      if (playerCount >= 30) {
        return rejectJoin("Space is full. It's 30 players max.");
      }
    }

    const realm = await this.realmsService.findById(realmData.realmId);
    if (!realm) {
      return rejectJoin('Space not found.');
    }

    const profile = await this.profilesService.findByUserId(uid);
    if (!profile) {
      return rejectJoin('Failed to get profile.');
    }

    const join = async () => {
      if (!this.sessionsService.getSession(realmData.realmId)) {
        this.sessionsService.createSession(realmData.realmId, realm.map_data);
      }

      const currentSession = this.sessionsService.getPlayerSession(uid);
      if (currentSession) {
        this.kickPlayer(uid, 'You have logged in from another location.');
      }

      const user = this.users.get(uid);
      const username = formatEmailToName(user.email);
      this.sessionsService.addPlayerToSession(
        socket.id,
        realmData.realmId,
        uid,
        username,
        profile.skin,
      );
      const newSession = this.sessionsService.getPlayerSession(uid);
      const player = newSession.getPlayer(uid);

      socket.join(realmData.realmId);
      socket.emit('joinedRealm');
      this.emit(socket, 'playerJoinedRoom', player);
      this.joiningInProgress.delete(uid);
    };

    if (realm.owner_id === uid) {
      return join();
    }

    if (realm.only_owner) {
      return rejectJoin('This realm is private right now. Come back later!');
    }

    if (realm.share_id === realmData.shareId) {
      return join();
    } else {
      return rejectJoin('The share link has been changed.');
    }
  }

  @SubscribeMessage('movePlayer')
  handleMovePlayer(socket: Socket, data: z.infer<typeof MovePlayer>) {
    const uid = this.getUidFromSocket(socket);
    if (!uid) return;
    if (!MovePlayer.safeParse(data).success) return;

    const session = this.sessionsService.getPlayerSession(uid);
    if (!session) return;

    const player = session.getPlayer(uid);
    const changedPlayers = session.movePlayer(player.uid, data.x, data.y);

    this.emit(socket, 'playerMoved', {
      uid: player.uid,
      x: player.x,
      y: player.y,
    });

    for (const changedUid of changedPlayers) {
      const changedPlayerData = session.getPlayer(changedUid);
      this.emitToSocketIds([changedPlayerData.socketId], 'proximityUpdate', {
        proximityId: changedPlayerData.proximityId,
      });
    }
  }

  @SubscribeMessage('teleport')
  handleTeleport(socket: Socket, data: z.infer<typeof Teleport>) {
    const uid = this.getUidFromSocket(socket);
    if (!uid) return;
    if (!Teleport.safeParse(data).success) return;

    const session = this.sessionsService.getPlayerSession(uid);
    if (!session) return;

    const player = session.getPlayer(uid);
    if (player.room !== data.roomIndex) {
      this.emit(socket, 'playerLeftRoom', uid);
      const changedPlayers = session.changeRoom(uid, data.roomIndex, data.x, data.y);
      this.emit(socket, 'playerJoinedRoom', player);

      for (const changedUid of changedPlayers) {
        const changedPlayerData = session.getPlayer(changedUid);
        this.emitToSocketIds([changedPlayerData.socketId], 'proximityUpdate', {
          proximityId: changedPlayerData.proximityId,
        });
      }
    } else {
      const changedPlayers = session.movePlayer(player.uid, data.x, data.y);
      this.emit(socket, 'playerTeleported', { uid, x: player.x, y: player.y });

      for (const changedUid of changedPlayers) {
        const changedPlayerData = session.getPlayer(changedUid);
        this.emitToSocketIds([changedPlayerData.socketId], 'proximityUpdate', {
          proximityId: changedPlayerData.proximityId,
        });
      }
    }
  }

  @SubscribeMessage('changedSkin')
  handleChangedSkin(socket: Socket, data: z.infer<typeof ChangedSkin>) {
    const uid = this.getUidFromSocket(socket);
    if (!uid) return;
    if (!ChangedSkin.safeParse(data).success) return;

    const session = this.sessionsService.getPlayerSession(uid);
    if (!session) return;

    const player = session.getPlayer(uid);
    player.skin = data;
    this.emit(socket, 'playerChangedSkin', { uid, skin: player.skin });
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(socket: Socket, data: z.infer<typeof NewMessage>) {
    const uid = this.getUidFromSocket(socket);
    if (!uid) return;
    if (!NewMessage.safeParse(data).success) return;
    if (data.length > 300 || data.trim() === '') return;

    const message = removeExtraSpaces(data);
    const session = this.sessionsService.getPlayerSession(uid);
    if (!session) return;

    this.emit(socket, 'receiveMessage', { uid, message });
  }

  // ─── WebRTC Signaling ───

  @SubscribeMessage('webrtc:join-group')
  handleJoinWebRTCGroup(socket: Socket, data: { proximityId: string }) {
    const uid = this.getUidFromSocket(socket);
    if (!uid) return;

    const session = this.sessionsService.getPlayerSession(uid);
    if (!session) return;

    const player = session.getPlayer(uid);
    const room = session.getPlayerRoom(uid);

    // Find all other players in the same proximity group and same room
    const peers = session
      .getPlayersInRoom(room)
      .filter((p) => p.proximityId === data.proximityId && p.uid !== uid);

    // Notify existing peers that a new peer joined
    for (const peer of peers) {
      this.server.to(peer.socketId).emit('webrtc:peer-joined', {
        uid,
        socketId: socket.id,
        username: player.username,
      });
    }

    // Send existing peers to the new player
    socket.emit(
      'webrtc:existing-peers',
      {
        peers: peers.map((p) => ({
          uid: p.uid,
          socketId: p.socketId,
          username: p.username,
        })),
      },
    );
  }

  @SubscribeMessage('webrtc:leave-group')
  handleLeaveWebRTCGroup(socket: Socket, data: { proximityId: string }) {
    const uid = this.getUidFromSocket(socket);
    if (!uid) return;

    const session = this.sessionsService.getPlayerSession(uid);
    if (!session) return;

    const room = session.getPlayerRoom(uid);
    const peers = session
      .getPlayersInRoom(room)
      .filter((p) => p.proximityId === data.proximityId && p.uid !== uid);

    for (const peer of peers) {
      this.server.to(peer.socketId).emit('webrtc:peer-left', { uid });
    }
  }

  @SubscribeMessage('webrtc:offer')
  handleOffer(
    socket: Socket,
    data: { to: string; offer: RTCSessionDescriptionInit },
  ) {
    this.server.to(data.to).emit('webrtc:offer', {
      from: socket.id,
      offer: data.offer,
    });
  }

  @SubscribeMessage('webrtc:answer')
  handleAnswer(
    socket: Socket,
    data: { to: string; answer: RTCSessionDescriptionInit },
  ) {
    this.server.to(data.to).emit('webrtc:answer', {
      from: socket.id,
      answer: data.answer,
    });
  }

  @SubscribeMessage('webrtc:ice-candidate')
  handleIceCandidate(
    socket: Socket,
    data: { to: string; candidate: RTCIceCandidateInit },
  ) {
    this.server.to(data.to).emit('webrtc:ice-candidate', {
      from: socket.id,
      candidate: data.candidate,
    });
  }

  @SubscribeMessage('webrtc:screen-share')
  handleScreenShare(
    socket: Socket,
    data: { proximityId: string; isScreenSharing: boolean },
  ) {
    const uid = this.getUidFromSocket(socket);
    if (!uid) return;

    const session = this.sessionsService.getPlayerSession(uid);
    if (!session) return;

    const room = session.getPlayerRoom(uid);
    const peers = session
      .getPlayersInRoom(room)
      .filter((p) => p.proximityId === data.proximityId && p.uid !== uid);

    for (const peer of peers) {
      this.server.to(peer.socketId).emit('webrtc:screen-share', {
        uid,
        isScreenSharing: data.isScreenSharing,
      });
    }
  }

  private emit(socket: Socket, eventName: string, data: any) {
    const uid = this.getUidFromSocket(socket);
    if (!uid) return;

    const session = this.sessionsService.getPlayerSession(uid);
    if (!session) return;

    const room = session.getPlayerRoom(uid);
    const players = session.getPlayersInRoom(room);

    for (const player of players) {
      if (player.socketId === socket.id) continue;
      this.server.to(player.socketId).emit(eventName, data);
    }
  }

  private emitToSocketIds(socketIds: string[], eventName: string, data: any) {
    for (const socketId of socketIds) {
      this.server.to(socketId).emit(eventName, data);
    }
  }

  private kickPlayer(uid: string, reason: string) {
    const session = this.sessionsService.getPlayerSession(uid);
    if (!session) return;

    const room = session.getPlayerRoom(uid);
    const players = session.getPlayersInRoom(room);

    for (const player of players) {
      if (player.uid === uid) {
        this.server.to(player.socketId).emit('kicked', reason);
      } else {
        this.server.to(player.socketId).emit('playerLeftRoom', uid);
      }
    }

    const player = session.getPlayer(uid);
    const socket = this.server.sockets.sockets.get(player.socketId);
    if (socket) {
      socket.leave(session.id);
    }
    this.sessionsService.logOutPlayer(uid);
  }

  private getUidFromSocket(socket: Socket): string | undefined {
    return socket.handshake.query.uid as string;
  }
}
