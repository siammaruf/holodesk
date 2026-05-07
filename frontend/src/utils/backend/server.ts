import io, { Socket } from 'socket.io-client'
import { api } from '../api/client'

type ConnectionResponse = {
    success: boolean
    errorMessage: string
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const backend_url: string = new URL(apiUrl).origin

class Server {
    public socket: Socket = io(backend_url, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
    })
    private connected: boolean = false

    public async connect(realmId: string, uid: string, shareId: string, access_token: string) {
        this.socket.io.opts.transportOptions = {
            polling: {
                extraHeaders: {
                    'Authorization': `Bearer ${access_token}`
                }
            }
        }
        this.socket.io.opts.query = { uid }
        this.socket.connect()

        return new Promise<ConnectionResponse>((resolve, reject) => {
            this.socket.on('connect', () => {
                this.connected = true

                this.socket.emit('joinRealm', {
                    realmId,
                    shareId
                })
            })

            this.socket.on('joinedRealm', () => {
                resolve({
                    success: true,
                    errorMessage: ''
                })
            })

            this.socket.on('failedToJoinRoom', (reason: string) => {
                resolve({
                    success: false,
                    errorMessage: reason
                })
            })

            this.socket.on('connect_error', (err: any) => {
                console.error('Connection error:', err)
                resolve({
                    success: false,
                    errorMessage: err.message
                })
            })
        })
    }

    public disconnect() {
        if (this.connected) {
            this.connected = false
            this.socket.disconnect()
        }
    }

    public async getPlayersInRoom(roomIndex: number) {
        try {
            const { data } = await api.get(`/sessions/players?roomIndex=${roomIndex}`)
            return { data, error: null }
        } catch (error: any) {
            return { data: null, error: { message: error?.response?.data?.message || 'Failed to get players' } }
        }
    }
}

const server = new Server()

export { server }
