'use client'
import signal from '~/utils/signal'
import React, { useState, useEffect, useRef } from 'react'
import { Chat, ArrowUpLeft } from '@phosphor-icons/react'

type ChatLogProps = {}

type Message = {
    content: string,
    username: string,
    color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'orange' | 'cyan' | 'white' | 'black'
}

function getColorClass(color: Message['color']) {
    switch (color) {
        case 'red':
            return 'text-red-400'
        case 'blue':
            return 'text-blue-400'
        case 'green':
            return 'text-emerald-400'
        case 'yellow':
            return 'text-amber-400'
        case 'purple':
            return 'text-violet-400'
        case 'pink':
            return 'text-pink-400'
        case 'orange':
            return 'text-orange-400'
        case 'cyan':
            return 'text-cyan-400'
        case 'white':
            return 'text-white/90'
        case 'black':
            return 'text-black'
        default:
            return 'text-white/90'
    }
}

const ChatLog: React.FC<ChatLogProps> = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [expanded, setExpanded] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onNewMessage = (message: Message) => {
            setMessages(prevMessages => [message, ...prevMessages])
            containerRef.current?.scrollTo(0, containerRef.current.scrollHeight)
        }

        const onNewRoomChat = (data: { name: string, channelId: string }) => {
            setMessages([{
                content: `Joined room ${data.name}. ${data.channelId ? 'Chat will be sent to channel: #' + data.channelId : ''}`,
                username: '',
                color: 'green'
            }])
        }

        signal.on('newMessage', onNewMessage)
        signal.on('newRoomChat', onNewRoomChat)

        return () => {
            signal.off('newMessage', onNewMessage)
            signal.off('newRoomChat', onNewRoomChat)
        }
    }, [])

    const expand = () => {
        setExpanded(true)
    }

    const collapse = () => {
        setExpanded(false)
    }

    return (
        <div className='absolute top-4 left-4 hidden sm:flex z-10'>
            {!expanded && (
                <button
                    className='glass-strong rounded-xl p-3 grid place-items-center
                        hover:bg-white/[0.06] hover:scale-105 active:scale-95
                        transition-all duration-200 ease-out group'
                    onClick={expand}
                >
                    <Chat className='h-5 w-5 text-white/60 group-hover:text-white/90 transition-colors' />
                    {messages.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full text-[9px] font-bold grid place-items-center">
                            {messages.length}
                        </div>
                    )}
                </button>
            )}
            {expanded && (
                <div className='glass-strong w-[420px] h-[220px] rounded-2xl overflow-hidden
                    shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.04)]
                    animate-fade-in-scale origin-top-left'>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05]">
                        <div className="flex items-center gap-2">
                            <Chat className="h-4 w-4 text-white/40" />
                            <span className="text-xs font-medium text-white/60">Room Chat</span>
                        </div>
                        <button
                            className='rounded-lg p-1.5 outline-none
                                hover:bg-white/[0.08] hover:scale-105 active:scale-95
                                transition-all duration-200 ease-out group'
                            onClick={collapse}
                        >
                            <ArrowUpLeft className='h-3.5 w-3.5 text-white/40 group-hover:text-white/80 transition-colors' />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className='w-full h-[calc(100%-40px)] flex flex-col-reverse overflow-y-scroll p-3 gap-1 transparent-scrollbar'>
                        {messages.length === 0 && (
                            <div className="flex-1 grid place-items-center">
                                <div className="flex flex-col items-center gap-2 text-white/20">
                                    <Chat className="h-8 w-8" />
                                    <p className="text-xs">No messages yet</p>
                                </div>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors ${getColorClass(message.color)}`}
                            >
                                {message.username && (
                                    <span className='font-semibold text-[11px] shrink-0 text-white/70 mt-[1px]'>
                                        {message.username}:
                                    </span>
                                )}
                                <span className="text-[11px] leading-relaxed text-white/80">{message.content}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatLog
