import React, { useEffect, useRef, useState } from 'react'
import { TShirt } from '@phosphor-icons/react'
import { useModal } from '~/hooks/useModal'
import signal from '~/utils/signal'
import { ArrowLeftEndOnRectangleIcon, PencilIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import MicAndCameraButtons from '~/components/VideoChat/MicAndCameraButtons'
import { useVideoChat } from '~/hooks/useVideoChat'
import AnimatedCharacter from './SkinMenu/AnimatedCharacter'
import { videoChat } from '~/utils/video-chat/video-chat'
import Tooltip from '~/components/Tooltip'

type PlayNavbarProps = {
    username: string
    skin: string
    avatarUrl?: string
    createdAt?: string
}

function formatJoinDate(dateString?: string): string {
    if (!dateString) return 'Joined recently'
    const date = new Date(dateString)
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
}

const PlayNavbar:React.FC<PlayNavbarProps> = ({ username, skin, avatarUrl, createdAt }) => {
    const { setModal } = useModal()
    const { isCameraMuted } = useVideoChat()
    const [showPopup, setShowPopup] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null)
    const avatarRef = useRef<HTMLDivElement>(null)

    function onClickSkinButton() {
        setModal('Skin')
        signal.emit('requestSkin')
    }

    function togglePopup() {
        setShowPopup(prev => !prev)
    }

    function closePopup() {
        setShowPopup(false)
    }

    function openEditModal() {
        closePopup()
        setShowEditModal(true)
    }

    function closeEditModal() {
        setShowEditModal(false)
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target as Node)
            ) {
                closePopup()
            }
        }
        if (showPopup) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showPopup])

    useEffect(() => {
        videoChat.playVideoTrackAtElementId('local-video')
    }, [])

    return (
        <>
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
                <div className='relative h-9 sm:h-10 w-fit rounded-lg flex flex-row items-center
                    border border-white/[0.06]
                    transition-all duration-200'>

                    <div
                        ref={avatarRef}
                        onClick={togglePopup}
                        className='w-9 sm:w-10 h-full border-r border-white/[0.06] relative flex items-center justify-center shrink-0 cursor-pointer
                            hover:bg-white/[0.12] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.08)]
                            transition-all duration-200 ease-out group'
                    >
                        {/* Hover outline glow */}
                        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'
                            style={{
                                boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.25), 0 0 12px rgba(255,255,255,0.12)'
                            }}
                        />
                        <AnimatedCharacter src={'/sprites/characters/Character_' + skin + '.png'} noAnimation className='w-5 h-5 sm:w-6 sm:h-6 absolute bottom-1 pointer-events-none' />
                        <div id='local-video' className={`w-full h-full absolute pointer-events-none ${!isCameraMuted ? 'block' : 'hidden'}`}>
                        </div>

                        {/* Profile Popup */}
                        {showPopup && (
                            <div
                                ref={popupRef}
                                onClick={(e) => e.stopPropagation()}
                                className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 w-56
                                    bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl
                                    shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                                    p-4 flex flex-col items-center gap-3
                                    animate-fade-in-up'
                            >
                                {/* Avatar */}
                                <div className='relative'>
                                    {avatarUrl ? (
                                        <img
                                            alt="avatar"
                                            src={avatarUrl}
                                            className='h-16 w-16 rounded-full object-cover ring-2 ring-white/20'
                                        />
                                    ) : (
                                        <div className='h-16 w-16 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/20'>
                                            <UserCircleIcon className='h-10 w-10 text-white/70' />
                                        </div>
                                    )}
                                    <div className='absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black/60' />
                                </div>

                                {/* User Info */}
                                <div className='flex flex-col items-center gap-0.5'>
                                    <p className='text-sm font-semibold text-white/90'>{username}</p>
                                    <p className='text-xs text-white/40'>{formatJoinDate(createdAt)}</p>
                                </div>

                                {/* Edit Profile Button */}
                                <button
                                    onClick={openEditModal}
                                    className='w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium
                                        bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08]
                                        text-white/80 hover:text-white
                                        transition-all duration-200 ease-out'
                                >
                                    <PencilIcon className='h-4 w-4' />
                                    Edit Profile
                                </button>
                            </div>
                        )}
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

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className='fixed inset-0 z-40 flex items-center justify-center'>
                    <div
                        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
                        onClick={closeEditModal}
                    />
                    <div className='relative z-10 w-80
                        bg-[#141423] backdrop-blur-xl border border-white/10 rounded-2xl
                        shadow-[0_16px_48px_rgba(0,0,0,0.6)]
                        p-5 flex flex-col gap-4 animate-fade-in-scale'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-base font-semibold text-white/90'>Edit Profile</h3>
                            <button
                                onClick={closeEditModal}
                                className='p-1 rounded-lg hover:bg-white/10 transition-colors'
                            >
                                <XMarkIcon className='h-5 w-5 text-white/50' />
                            </button>
                        </div>
                        <div className='flex flex-col items-center gap-3 py-2'>
                            {avatarUrl ? (
                                <img
                                    alt="avatar"
                                    src={avatarUrl}
                                    className='h-20 w-20 rounded-full object-cover ring-2 ring-white/20'
                                />
                            ) : (
                                <div className='h-20 w-20 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/20'>
                                    <UserCircleIcon className='h-12 w-12 text-white/70' />
                                </div>
                            )}
                            <p className='text-sm text-white/60'>Profile editing coming soon</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PlayNavbar
