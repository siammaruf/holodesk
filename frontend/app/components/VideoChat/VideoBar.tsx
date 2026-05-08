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
        <main className='absolute z-10 w-full flex flex-col items-center pt-2 top-0 left-0'>
            <section className='flex flex-row items-center gap-4' id='video-container'>
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
        <div className='w-[233px] h-[130px] bg-[#0f0f1d] bg-opacity-90 rounded-lg overflow-hidden relative'>
            <div className='absolute w-full h-full grid place-items-center'>
                <div className='w-[48px] h-[48px] bg-[#222222] rounded-full border-2 border-[#424A61] grid place-items-center overflow-hidden'>
                    {skin && <AnimatedCharacter src={`/sprites/characters/Character_${skin}.png`} noAnimation className='w-full h-full relative bottom-1'/>}
                </div>
            </div>
            {(user.cameraEnabled || user.isScreenSharing) && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className='w-full h-full object-cover absolute top-0 left-0'
                />
            )}
            <p className='absolute bottom-1 left-2 bg-black bg-opacity-70 rounded-full z-10 text-xs p-1 px-2 select-none flex flex-row items-center gap-1'>
                {!user.micEnabled && <MicrophoneSlash className='w-3 h-3 text-[#FF2F49]' />}
                {user.isScreenSharing && <Monitor className='w-3 h-3 text-[#08D6A0]' />}
                {user.username}
            </p>
        </div>
    )
}
