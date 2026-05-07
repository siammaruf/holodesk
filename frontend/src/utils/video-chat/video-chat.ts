import signal from '../signal'
import { server } from '../backend/server'

interface PeerConnection {
    pc: RTCPeerConnection
    uid: string
    socketId: string
    username: string
    remoteStream: MediaStream
    isScreenSharing: boolean
}

export class VideoChat {
    private localStream: MediaStream | null = null
    private peers: Map<string, PeerConnection> = new Map()
    private currentChannel: string = ''
    private currentUid: string = ''
    private currentUsername: string = ''
    private currentRealmId: string = ''
    private isScreenSharing: boolean = false
    private screenShareTrack: MediaStreamTrack | null = null
    private channelTimeout: ReturnType<typeof setTimeout> | null = null

    private readonly iceServers: RTCIceServer[] = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ]

    constructor() {
        this.setupSocketListeners()
    }

    private setupSocketListeners() {
        server.socket.on('webrtc:existing-peers', this.onExistingPeers)
        server.socket.on('webrtc:peer-joined', this.onPeerJoined)
        server.socket.on('webrtc:peer-left', this.onPeerLeft)
        server.socket.on('webrtc:offer', this.onOffer)
        server.socket.on('webrtc:answer', this.onAnswer)
        server.socket.on('webrtc:ice-candidate', this.onIceCandidate)
        server.socket.on('webrtc:screen-share', this.onRemoteScreenShare)
    }

    private createPeerConnection(uid: string, socketId: string): RTCPeerConnection {
        const pc = new RTCPeerConnection({ iceServers: this.iceServers })

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                server.socket.emit('webrtc:ice-candidate', {
                    to: socketId,
                    candidate: event.candidate,
                })
            }
        }

        pc.ontrack = (event) => {
            const peer = this.peers.get(uid)
            if (!peer) return

            event.track.onmute = () => this.emitUserInfoUpdated(uid)
            event.track.onunmute = () => this.emitUserInfoUpdated(uid)

            peer.remoteStream.addTrack(event.track)
            this.emitUserInfoUpdated(uid)
        }

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
                this.removePeer(uid)
            }
        }

        // Add local audio/video tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => {
                pc.addTrack(track, this.localStream!)
            })
        }

        // If screen share is already active, replace/add the video sender
        if (this.screenShareTrack) {
            const sender = pc.getSenders().find((s) => s.track?.kind === 'video')
            if (sender) {
                sender.replaceTrack(this.screenShareTrack)
            } else {
                pc.addTrack(this.screenShareTrack, new MediaStream([this.screenShareTrack]))
            }
        }

        return pc
    }

    private emitUserInfoUpdated(uid: string) {
        const peer = this.peers.get(uid)
        if (!peer) return

        const hasAudio = peer.remoteStream.getAudioTracks().some(
            (t) => t.readyState === 'live' && t.enabled
        )
        const hasVideo = peer.remoteStream.getVideoTracks().some(
            (t) => t.readyState === 'live' && t.enabled
        )

        signal.emit('user-info-updated', {
            uid: peer.uid + peer.username,
            hasAudio,
            hasVideo,
            isScreenSharing: peer.isScreenSharing,
            stream: peer.remoteStream,
        })
    }

    private async initiateConnection(uid: string, socketId: string, username: string) {
        if (this.peers.has(uid)) return

        const pc = this.createPeerConnection(uid, socketId)
        this.peers.set(uid, {
            pc,
            uid,
            socketId,
            username,
            remoteStream: new MediaStream(),
            isScreenSharing: false,
        })

        try {
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            server.socket.emit('webrtc:offer', {
                to: socketId,
                offer,
            })
        } catch (e) {
            console.error('Failed to initiate WebRTC connection:', e)
            this.removePeer(uid)
        }
    }

    private onExistingPeers = async (data: { peers: { uid: string; socketId: string; username: string }[] }) => {
        const myRealUid = this.currentUid.slice(0, 36)
        for (const peerInfo of data.peers) {
            if (peerInfo.uid === myRealUid) continue
            await this.initiateConnection(peerInfo.uid, peerInfo.socketId, peerInfo.username)
        }
    }

    private onPeerJoined = (data: { uid: string; socketId: string; username: string }) => {
        const myRealUid = this.currentUid.slice(0, 36)
        if (data.uid === myRealUid) return
        if (this.peers.has(data.uid)) return

        const pc = this.createPeerConnection(data.uid, data.socketId)
        this.peers.set(data.uid, {
            pc,
            uid: data.uid,
            socketId: data.socketId,
            username: data.username,
            remoteStream: new MediaStream(),
            isScreenSharing: false,
        })
    }

    private onPeerLeft = (data: { uid: string }) => {
        this.removePeer(data.uid)
    }

    private onOffer = async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
        const peer = Array.from(this.peers.values()).find((p) => p.socketId === data.from)
        if (!peer) {
            console.warn('Received offer from unknown peer:', data.from)
            return
        }

        try {
            await peer.pc.setRemoteDescription(data.offer)
            const answer = await peer.pc.createAnswer()
            await peer.pc.setLocalDescription(answer)

            server.socket.emit('webrtc:answer', {
                to: data.from,
                answer,
            })
        } catch (e) {
            console.error('Failed to handle WebRTC offer:', e)
            this.removePeer(peer.uid)
        }
    }

    private onAnswer = async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
        const peer = Array.from(this.peers.values()).find((p) => p.socketId === data.from)
        if (!peer) return
        try {
            await peer.pc.setRemoteDescription(data.answer)
        } catch (e) {
            console.error('Failed to set remote description from answer:', e)
            this.removePeer(peer.uid)
        }
    }

    private onIceCandidate = async (data: { from: string; candidate: RTCIceCandidateInit }) => {
        const peer = Array.from(this.peers.values()).find((p) => p.socketId === data.from)
        if (!peer) return
        try {
            await peer.pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        } catch (e) {
            console.error('Error adding ICE candidate:', e)
        }
    }

    private onRemoteScreenShare = (data: { uid: string; isScreenSharing: boolean }) => {
        const peer = this.peers.get(data.uid)
        if (!peer) return
        peer.isScreenSharing = data.isScreenSharing
        this.emitUserInfoUpdated(data.uid)
    }

    private removePeer(uid: string) {
        const peer = this.peers.get(uid)
        if (!peer) return
        peer.pc.close()
        this.peers.delete(uid)
        signal.emit('user-left', { uid: peer.uid + peer.username })
    }

    public async toggleCamera() {
        if (!this.localStream || !this.localStream.getVideoTracks().length) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                const videoTrack = stream.getVideoTracks()[0]

                if (this.localStream) {
                    const oldTrack = this.localStream.getVideoTracks()[0]
                    if (oldTrack) {
                        oldTrack.stop()
                        this.localStream.removeTrack(oldTrack)
                    }
                    this.localStream.addTrack(videoTrack)
                } else {
                    this.localStream = stream
                }

                this.peers.forEach((peer) => {
                    const sender = peer.pc.getSenders().find((s) => s.track?.kind === 'video')
                    if (sender) {
                        sender.replaceTrack(videoTrack)
                    } else {
                        peer.pc.addTrack(videoTrack, this.localStream!)
                    }
                })

                this.playVideoTrackAtElementId('local-video')
                return false
            } catch (e) {
                console.error('Failed to get camera:', e)
                return true
            }
        }

        const videoTrack = this.localStream.getVideoTracks()[0]
        if (!videoTrack) return true

        videoTrack.enabled = !videoTrack.enabled

        this.peers.forEach((peer) => {
            const sender = peer.pc.getSenders().find((s) => s.track?.kind === 'video')
            if (sender && sender.track) {
                sender.track.enabled = videoTrack.enabled
            }
        })

        return !videoTrack.enabled
    }

    public async toggleMicrophone() {
        if (!this.localStream || !this.localStream.getAudioTracks().length) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                const audioTrack = stream.getAudioTracks()[0]

                if (this.localStream) {
                    const oldTrack = this.localStream.getAudioTracks()[0]
                    if (oldTrack) {
                        oldTrack.stop()
                        this.localStream.removeTrack(oldTrack)
                    }
                    this.localStream.addTrack(audioTrack)
                } else {
                    this.localStream = stream
                }

                this.peers.forEach((peer) => {
                    const sender = peer.pc.getSenders().find((s) => s.track?.kind === 'audio')
                    if (sender) {
                        sender.replaceTrack(audioTrack)
                    } else {
                        peer.pc.addTrack(audioTrack, this.localStream!)
                    }
                })

                return false
            } catch (e) {
                console.error('Failed to get microphone:', e)
                return true
            }
        }

        const audioTrack = this.localStream.getAudioTracks()[0]
        if (!audioTrack) return true

        audioTrack.enabled = !audioTrack.enabled

        this.peers.forEach((peer) => {
            const sender = peer.pc.getSenders().find((s) => s.track?.kind === 'audio')
            if (sender && sender.track) {
                sender.track.enabled = audioTrack.enabled
            }
        })

        return !audioTrack.enabled
    }

    public async toggleScreenShare() {
        if (this.isScreenSharing) {
            if (this.screenShareTrack) {
                this.screenShareTrack.stop()
                this.screenShareTrack = null
            }

            const cameraTrack = this.localStream?.getVideoTracks()[0]
            this.peers.forEach((peer) => {
                const sender = peer.pc.getSenders().find((s) => s.track?.kind === 'video')
                if (sender) {
                    if (cameraTrack && cameraTrack.enabled) {
                        sender.replaceTrack(cameraTrack)
                    } else {
                        sender.replaceTrack(null)
                    }
                }
            })

            this.isScreenSharing = false
            server.socket.emit('webrtc:screen-share', {
                proximityId: this.currentChannel,
                isScreenSharing: false,
            })
            signal.emit('local-screen-share-stopped')
            return false
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
                const screenShareTrack = screenStream.getVideoTracks()[0]
                this.screenShareTrack = screenShareTrack

                screenShareTrack.onended = () => {
                    if (this.isScreenSharing) {
                        this.toggleScreenShare()
                    }
                }

                this.peers.forEach((peer) => {
                    const sender = peer.pc.getSenders().find((s) => s.track?.kind === 'video')
                    if (sender) {
                        sender.replaceTrack(screenShareTrack)
                    } else {
                        peer.pc.addTrack(screenShareTrack, new MediaStream([screenShareTrack]))
                    }
                })

                this.isScreenSharing = true
                server.socket.emit('webrtc:screen-share', {
                    proximityId: this.currentChannel,
                    isScreenSharing: true,
                })
                signal.emit('local-screen-share-started')
                return true
            } catch (e) {
                console.error('Failed to share screen:', e)
                return false
            }
        }
    }

    public playVideoTrackAtElementId(elementId: string) {
        const container = document.getElementById(elementId)
        if (!container) return

        let videoElement = container.querySelector('video') as HTMLVideoElement | null
        if (!videoElement) {
            videoElement = document.createElement('video')
            videoElement.autoplay = true
            videoElement.playsInline = true
            videoElement.muted = true
            videoElement.className = 'w-full h-full object-cover'
            container.appendChild(videoElement)
        }

        if (this.localStream) {
            videoElement.srcObject = this.localStream
        }
    }

    public async joinChannel(channel: string, uid: string, realmId: string) {
        if (this.channelTimeout) {
            clearTimeout(this.channelTimeout)
        }

        this.channelTimeout = setTimeout(async () => {
            if (channel === this.currentChannel) return

            if (this.currentChannel) {
                await this.leaveCurrentGroup()
            }

            this.currentChannel = channel
            this.currentUid = uid
            this.currentUsername = uid.slice(36)
            this.currentRealmId = realmId

            server.socket.emit('webrtc:join-group', { proximityId: channel })
        }, 1000)
    }

    public async leaveChannel() {
        if (this.channelTimeout) {
            clearTimeout(this.channelTimeout)
        }

        this.channelTimeout = setTimeout(async () => {
            if (this.currentChannel === '') return
            await this.leaveCurrentGroup()
            this.currentChannel = ''
        }, 1000)
    }

    private async leaveCurrentGroup() {
        if (this.currentChannel) {
            server.socket.emit('webrtc:leave-group', { proximityId: this.currentChannel })
        }
        this.peers.forEach((peer) => peer.pc.close())
        this.peers.clear()
        signal.emit('reset-users')
    }

    public destroy() {
        if (this.channelTimeout) {
            clearTimeout(this.channelTimeout)
        }
        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => track.stop())
            this.localStream = null
        }
        if (this.screenShareTrack) {
            this.screenShareTrack.stop()
            this.screenShareTrack = null
        }
        this.peers.forEach((peer) => peer.pc.close())
        this.peers.clear()
        this.currentChannel = ''
    }

    public getIsScreenSharing() {
        return this.isScreenSharing
    }
}

export const videoChat = new VideoChat()
