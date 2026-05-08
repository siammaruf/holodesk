'use client'
import React, { useEffect, useState } from 'react'
import PixiApp from './PixiApp'
import { RealmData } from '~/types/pixi'
import PlayNavbar from './PlayNavbar'
import { useModal } from '~/hooks/useModal'
import signal from '~/utils/signal'
import IntroScreen from './IntroScreen'
import VideoBar from '~/components/VideoChat/VideoBar'
import { VideoChatProvider } from '~/hooks/useVideoChat'

type PlayClientProps = {
    mapData: RealmData
    username: string
    access_token?: string
    realmId: string
    uid: string
    shareId: string
    initialSkin: string
    name: string
}

const PlayClient:React.FC<PlayClientProps> = ({ mapData, username, access_token, realmId, uid, shareId, initialSkin, name }) => {

    const { setErrorModal, setDisconnectedMessage } = useModal()

    const [showIntroScreen, setShowIntroScreen] = useState(true)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const [skin, setSkin] = useState(initialSkin)

    useEffect(() => {
        const onShowKickedModal = (message: string) => {
            setErrorModal('Disconnected')
            setDisconnectedMessage(message)
        }

        const onShowDisconnectModal = () => {
            setErrorModal('Disconnected')
            setDisconnectedMessage('You have been disconnected from the server.')
        }

        const onSwitchSkin = (skin: string) => {
            setSkin(skin)
        }

        signal.on('showKickedModal', onShowKickedModal)
        signal.on('showDisconnectModal', onShowDisconnectModal)
        signal.on('switchSkin', onSwitchSkin)

        return () => {
            signal.off('showKickedModal', onShowDisconnectModal)
            signal.off('showDisconnectModal', onShowDisconnectModal)
            signal.off('switchSkin', onSwitchSkin)
        }
    }, [])

    const handleJoin = () => {
        setIsTransitioning(true)
        setTimeout(() => {
            setShowIntroScreen(false)
            setIsTransitioning(false)
        }, 400)
    }

    return (
        <VideoChatProvider uid={uid}>
            <div className="relative w-full h-dvh overflow-hidden bg-[#0a0a12]">
                {/* Game view */}
                {!showIntroScreen && (
                    <>
                        <div className={`relative w-full h-dvh flex flex-col-reverse sm:flex-col ${!isTransitioning ? 'animate-fade-in-scale' : ''}`}>
                            <VideoBar />
                            <PixiApp
                                mapData={mapData}
                                className='w-full grow sm:h-full sm:flex-grow-0'
                                username={username}
                                access_token={access_token}
                                realmId={realmId}
                                uid={uid}
                                shareId={shareId}
                                initialSkin={skin}
                            />
                        </div>
                        <PlayNavbar username={username} skin={skin}/>
                    </>
                )}

                {/* Intro screen */}
                {showIntroScreen && (
                    <div className={`absolute inset-0 z-50 transition-opacity duration-400 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                        <IntroScreen
                            realmName={name}
                            skin={skin}
                            username={username}
                            setShowIntroScreen={handleJoin}
                        />
                    </div>
                )}
            </div>
        </VideoChatProvider>
    )
}
export default PlayClient
