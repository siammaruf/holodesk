'use client'
import React from 'react'
import BasicButton from '~/components/BasicButton'
import AnimatedCharacter from './SkinMenu/AnimatedCharacter'
import { useVideoChat } from '~/hooks/useVideoChat'
import MicAndCameraButtons from '~/components/VideoChat/MicAndCameraButtons'

type IntroScreenProps = {
    realmName: string
    skin: string
    username: string
    setShowIntroScreen: (show: boolean) => void
}

const IntroScreen:React.FC<IntroScreenProps> = ({ realmName, skin, username, setShowIntroScreen }) => {

    const src = '/sprites/characters/Character_' + skin + '.png'

    return (
        <main className='animated-bg w-full h-dvh flex flex-col items-center justify-center relative overflow-hidden'>
            {/* Ambient background orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="z-10 flex flex-col items-center gap-10 animate-fade-in-up">
                {/* Header */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="px-4 py-1.5 rounded-full glass text-xs font-medium text-white/50 tracking-widest uppercase">
                        Virtual Space
                    </div>
                    <h1 className='text-4xl sm:text-5xl font-semibold tracking-tight'>
                        Welcome to <span className='text-gradient'>{realmName}</span>
                    </h1>
                    <p className="text-white/40 text-sm max-w-sm text-center leading-relaxed">
                        Join the room to start collaborating with others in this virtual space.
                    </p>
                </div>

                {/* Main content */}
                <div className="flex flex-col items-center gap-6">
                    {/* Video + Character row */}
                    <section className='flex flex-col sm:flex-row items-center gap-6 sm:gap-8'>
                        {/* Video column (card + controls) */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-fade-in-scale stagger-1 opacity-0">
                                <div className='glass-strong rounded-2xl p-1.5 glow-primary'>
                                    <div className='aspect-video w-[380px] sm:w-[480px] h-[240px] sm:h-[300px] bg-black/60 rounded-xl overflow-hidden relative'>
                                        <LocalVideo/>
                                    </div>
                                </div>
                            </div>
                            <div className="animate-fade-in-scale stagger-2 opacity-0">
                                <MicAndCameraButtons/>
                            </div>
                        </div>

                        {/* Character column (card + join button) */}
                        <div className="flex flex-col items-center justify-center gap-4 h-[240px] sm:h-[300px]">
                            <div className="animate-fade-in-scale stagger-2 opacity-0">
                                <div className='rounded-2xl p-6 flex flex-col items-center gap-5 min-w-[220px]'>
                                    <div className='flex flex-col items-center gap-3'>
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/[0.06] grid place-items-center overflow-hidden">
                                            <AnimatedCharacter src={src} noAnimation className="w-16 h-16"/>
                                        </div>
                                        <div className="flex flex-col items-center gap-0.5">
                                            <p className='text-white/90 font-medium text-sm'>{username}</p>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                <p className='text-white/40 text-xs'>Ready to join</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Join CTA */}
                            <div className="animate-fade-in-up stagger-3 opacity-0 w-full">
                                <BasicButton
                                    className='w-full py-3 px-6 rounded-xl glow-button text-sm font-semibold tracking-wide flex items-center justify-center gap-2'
                                    onClick={() => setShowIntroScreen(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                    Join
                                </BasicButton>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default IntroScreen

function LocalVideo() {
    const { isCameraMuted, isMicMuted } = useVideoChat()

    return (
        <div className='w-full h-full bg-[#0a0a12] grid place-items-center relative'>
            <div id='local-video' className='w-full h-full'>
            </div>
            <div className='absolute select-none text-sm text-white/60 items-center flex flex-col gap-1.5'>
                {isMicMuted && isCameraMuted && (
                    <>
                        <div className="w-12 h-12 rounded-full bg-white/5 grid place-items-center">
                            <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                        <p>You are muted</p>
                    </>
                )}
                {isCameraMuted && !isMicMuted && (
                    <>
                        <div className="w-12 h-12 rounded-full bg-white/5 grid place-items-center">
                            <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                        <p>Your camera is off</p>
                    </>
                )}
            </div>
            {isMicMuted && !isCameraMuted && (
                <div className='absolute bottom-3 right-3 select-none text-xs text-white/80 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10'>
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                    Muted
                </div>
            )}
        </div>
    )
}
