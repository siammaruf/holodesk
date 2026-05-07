import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('players')
  @UseGuards(JwtAuthGuard)
  getPlayersInRoom(@Query('realmId') realmId: string, @Query('roomIndex') roomIndex: string) {
    const session = this.sessionsService.getSession(realmId);
    if (!session) {
      return { players: [] };
    }
    const players = session.getPlayersInRoom(parseInt(roomIndex, 10));
    return { players };
  }

  @Get('player-counts')
  @UseGuards(JwtAuthGuard)
  getPlayerCounts(@Query('realmIds') realmIds: string) {
    const ids = realmIds.split(',');
    const playerCounts = ids.map((id) => this.sessionsService.getPlayerCount(id));
    return { playerCounts };
  }
}
