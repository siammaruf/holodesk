import React, { useEffect, useRef, useState } from 'react'
import signal from '~/utils/signal'
import { MicrophoneSlash, Monitor } from '@phosphor-icons/react'
import AnimatedCharacter from '~/pages/play/SkinMenu/AnimatedCharacter'

interface RemoteUser {
    uid: string
    username: string
    micEnabled: boolean
    cameraEnabled: boolean
    isScreenSharing: boolean
    stream: MediaStream
}

const VideoBar:React.FC = () => {

    const [remoteUsers, setRemoteUsers] = useState<{ [uid: string]: RemoteUser }>({})

    useEffect(() => {
        const onUserInfoUpdated = (user: any) => {
            setRemoteUsers(prev => ({ ...prev, [user.uid]: {
                uid: user.uid,
                username: user.uid.slice(36),
                micEnabled: user.hasAudio,
                cameraEnabled: user.hasVideo,
                isScreenSharing: user.isScreenSharing,
                stream: user.stream,
            } }))
        }
        const onResetUsers = () => {
            setRemoteUsers({})
        }
        const onUserLeft = (user: { uid: string }) => {
            setRemoteUsers(prev => {
                const newUsers = { ...prev }
                delete newUsers[user.uid]
                return newUsers
            })
        }

        signal.on('user-info-updated', onUserInfoUpdated)
        signal.on('reset-users', onResetUsers)
        signal.on('user-left', onUserLeft)
        return () => {
            signal.off('user-info-updated', onUserInfoUpdated)
            signal.off('reset-users', onResetUsers)
            signal.off('user-left', onUserLeft)
        }

    }, [remoteUsers])

    return (
        <main className='absolute z-10 w-full flex flex-col items-center pt-4 top-0 left-0 pointer-events-none'>
            <section className='flex flex-row items-center gap-3 pointer-events-auto' id='video-container'>
                {Object.values(remoteUsers).map(user => (
                    <RemoteUser key={user.uid} user={user} />
                ))}
            </section>
        </main>
    )
}

export default VideoBar

function RemoteUser({ user }: { user: RemoteUser }) {

    const videoRef = useRef<HTMLVideoElement>(null)
    const [skin, setSkin] = useState<string>('')

    useEffect(() => {
        const onVideoSkin = (data: { skin: string, uid: string }) => {
            const slicedUid = user.uid.slice(0, 36)
            if (data.uid === slicedUid) {
                setSkin(data.skin)
            }
        }

        signal.on('video-skin', onVideoSkin)

        signal.emit('getSkinForUid', user.uid.slice(0, 36))
        return () => {
            signal.off('video-skin', onVideoSkin)
        }
    }, [])

    useEffect(() => {
        if (videoRef.current && user.stream) {
            videoRef.current.srcObject = user.stream
        }
    }, [user.stream])

    return (
        <div className='w-[200px] h-[112px] rounded-2xl overflow-hidden relative
            glass-strong
            shadow-[0_4px_24px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.04)]
            hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06)]
            transition-all duration-300 ease-out hover:-translate-y-0.5'>
            {/* Avatar placeholder */}
            <div className='absolute w-full h-full grid place-items-center z-[1]'>
                <div className='w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.08] grid place-items-center overflow-hidden'>
                    {skin && <AnimatedCharacter src={`/sprites/characters/Character_${skin}.png`} noAnimation className='w-10 h-10 relative bottom-1'/>}
                </div>
            </div>

            {/* Video stream */}
            {(user.cameraEnabled || user.isScreenSharing) && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className='w-full h-full object-cover absolute top-0 left-0 z-[2]'
                />
            )}

            {/* Bottom status bar */}
            <div className='absolute bottom-0 left-0 right-0 z-[3]
                bg-gradient-to-t from-black/80 to-transparent
                px-3 py-2 flex items-center gap-1.5'>
                {!user.micEnabled && (
                    <div className="w-5 h-5 rounded-full bg-red-500/20 grid place-items-center">
                        <MicrophoneSlash className='w-3 h-3 text-red-400' />
                    </div>
                )}
                {user.isScreenSharing && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 grid place-items-center">
                        <Monitor className='w-3 h-3 text-emerald-400' />
                    </div>
                )}
                <p className='text-[10px] font-medium text-white/80 truncate'>
                    {user.username}
                </p>
            </div>
        </div>
    )
}
