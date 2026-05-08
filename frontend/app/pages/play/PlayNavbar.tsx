import React, { useEffect } from 'react'
import { TShirt } from '@phosphor-icons/react'
import { useModal } from '~/hooks/useModal'
import signal from '~/utils/signal'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import MicAndCameraButtons from '~/components/VideoChat/MicAndCameraButtons'
import { useVideoChat } from '~/hooks/useVideoChat'
import AnimatedCharacter from './SkinMenu/AnimatedCharacter'
import { videoChat } from '~/utils/video-chat/video-chat'
import Tooltip from '~/components/Tooltip'

type PlayNavbarProps = {
    username: string
    skin: string
}

const PlayNavbar:React.FC<PlayNavbarProps> = ({ username, skin }) => {
    const { setModal } = useModal()
    const { isCameraMuted } = useVideoChat()

    function onClickSkinButton() {
        setModal('Skin')
        signal.emit('requestSkin')
    }

    useEffect(() => {
        videoChat.playVideoTrackAtElementId('local-video')
    }, [])

    return (
        <div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-row items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5 select-none w-fit
            glass-strong rounded-xl
            shadow-[0_6px_24px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.05)]
            transition-all duration-300 ease-out
            hover:shadow-[0_10px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.08)]
            hover:-translate-y-0.5'>

            {/* Leave room button */}
            <Tooltip label='Leave Room'>
                <Link to='/app' className='aspect-square grid place-items-center rounded-lg p-1 sm:p-1.5 outline-none
                    hover:bg-white/[0.08] hover:scale-110 active:scale-95
                    transition-all duration-200 ease-out group'>
                    <ArrowLeftEndOnRectangleIcon className='h-[18px] w-[18px] sm:h-5 sm:w-5 text-white/50 group-hover:text-red-400 transition-colors duration-200'/>
                </Link>
            </Tooltip>

            {/* User profile card */}
            <div className='h-9 sm:h-10 w-fit rounded-lg overflow-hidden flex flex-row items-center
                border border-white/[0.06]
                transition-all duration-200'>
                <div className='w-9 sm:w-10 h-full border-r border-white/[0.06] relative grid place-items-center shrink-0 overflow-hidden'>
                    <AnimatedCharacter src={'/sprites/characters/Character_' + skin + '.png'} noAnimation className='w-5 h-5 sm:w-6 sm:h-6 absolute bottom-1' />
                    <div id='local-video' className={`w-full h-full absolute ${!isCameraMuted ? 'block' : 'hidden'}`}>
                    </div>
                </div>
                <div className='flex-1 flex flex-col justify-center px-2 min-w-0'>
                    <p className='text-white/90 text-[11px] font-medium truncate leading-tight'>{username}</p>
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-400/80" />
                        <p className='text-white/40 text-[9px] leading-tight'>Available</p>
                    </div>
                </div>
            </div>

            {/* Media controls */}
            <div className='flex flex-row items-center'>
                <MicAndCameraButtons />
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-white/[0.06]" />

            {/* Skin button */}
            <Tooltip label='Change Skin'>
                <button className='aspect-square grid place-items-center rounded-lg p-1 sm:p-1.5 outline-none
                    hover:bg-white/[0.08] hover:scale-110 active:scale-95
                    transition-all duration-200 ease-out group' onClick={onClickSkinButton}>
                    <TShirt className='h-[18px] w-[18px] sm:h-5 sm:w-5 text-white/50 group-hover:text-indigo-300 transition-colors duration-200'/>
                </button>
            </Tooltip>
        </div>
    )
}

export default PlayNavbar
