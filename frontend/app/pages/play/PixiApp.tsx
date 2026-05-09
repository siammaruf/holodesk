'use client'
import React, { useRef, useState, useCallback } from 'react'
import { PlayApp } from '~/utils/pixi/PlayApp'
import { useEffect } from 'react'
import { RealmData } from '~/types/pixi'
import { useModal } from '~/hooks/useModal'
import { server } from '~/utils/backend/server'
import PlayerTags from './PlayerTags'
import { PencilIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

type PixiAppProps = {
    className?: string
    mapData: RealmData
    username: string
    access_token?: string
    realmId: string
    uid: string
    shareId: string
    initialSkin: string
    avatarUrl?: string
    createdAt?: string
}

function formatJoinDate(dateString?: string): string {
    if (!dateString) return 'Joined recently'
    const date = new Date(dateString)
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
}

const PixiApp:React.FC<PixiAppProps> = ({ className, mapData, username, access_token, realmId, uid, shareId, initialSkin, avatarUrl, createdAt }) => {

    const appRef = useRef<PlayApp | null>(null)
    const [playApp, setPlayApp] = useState<PlayApp | null>(null)
    const { setModal, setLoadingText, setFailedConnectionMessage, setErrorModal } = useModal()

    const [showPopup, setShowPopup] = useState(false)
    const [popupRect, setPopupRect] = useState<DOMRect | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)

    const handleLocalAvatarClick = useCallback((rect: DOMRect) => {
        setPopupRect(rect)
        setShowPopup(prev => !prev)
    }, [])

    const openEditModal = () => {
        setShowPopup(false)
        setShowEditModal(true)
    }

    const closeEditModal = () => {
        setShowEditModal(false)
    }

    useEffect(() => {
        const mount = async () => {
            const app = new PlayApp(uid, realmId, mapData, username, initialSkin)
            appRef.current = app
            setModal('Loading')
            setLoadingText('Connecting to server...')
            const { success, errorMessage } = await server.connect(realmId, uid, shareId, access_token)
            if (!success) {
                setErrorModal('Failed To Connect')
                setFailedConnectionMessage(errorMessage)
                return
            }

            setLoadingText('Loading game...')
            await app.init()
            setPlayApp(app)
            setModal('None')
            const pixiApp = app.getApp()
            
            document.getElementById('app-container')!.appendChild(pixiApp.canvas)
        }

        if (!appRef.current) {
            mount()
        }
        
        return () => {
            if (appRef.current) {
                appRef.current.destroy()
            }
        }
    }, [])

    // Compute popup position, keeping it on-screen
    const popupStyle = React.useMemo(() => {
        if (!popupRect) return {}
        const popupWidth = 224 // w-56
        const popupHeight = 240 // estimated
        const gap = 8

        let left = popupRect.left + popupRect.width / 2 - popupWidth / 2
        let top = popupRect.top - popupHeight - gap

        // Clamp to viewport
        const vw = window.innerWidth
        const vh = window.innerHeight

        if (left < gap) left = gap
        if (left + popupWidth > vw - gap) left = vw - popupWidth - gap
        if (top < gap) top = popupRect.bottom + gap
        if (top + popupHeight > vh - gap) top = vh - popupHeight - gap

        return { left, top }
    }, [popupRect])

    return (
        <div id='app-container' className={`relative overflow-hidden ${className}`}>
            {playApp && (
                <PlayerTags
                    playApp={playApp}
                    avatarUrl={avatarUrl}
                    onLocalAvatarClick={handleLocalAvatarClick}
                />
            )}

            {/* Profile Popup */}
            {showPopup && popupRect && (
                <>
                    {/* Click-outside overlay */}
                    <div
                        className="fixed inset-0 z-20"
                        style={{ background: 'transparent' }}
                        onClick={() => setShowPopup(false)}
                    />
                    <div
                        className="fixed z-30 w-56
                            bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl
                            shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                            p-4 flex flex-col items-center gap-3
                            animate-fade-in-up"
                        style={popupStyle}
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
                </>
            )}

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
        </div>
    )
}

export default PixiApp
