import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import signal from '../../utils/signal'
import { videoChat } from '../../utils/video-chat/video-chat'

interface VideoChatContextType {
    toggleCamera: () => void
    toggleMicrophone: () => void
    toggleScreenShare: () => void
    isCameraMuted: boolean
    isMicMuted: boolean
    isScreenSharing: boolean
}

const VideoChatContext = createContext<VideoChatContextType | undefined>(undefined)

interface VideoChatProviderProps {
    children: ReactNode
    uid: string
}

export const VideoChatProvider: React.FC<VideoChatProviderProps> = ({ children }) => {
    const [isCameraMuted, setIsCameraMuted] = useState(true)
    const [isMicMuted, setIsMicMuted] = useState(true)
    const [isScreenSharing, setIsScreenSharing] = useState(false)

    useEffect(() => {
        return () => {
            videoChat.destroy()
        }
    }, [])

    const toggleCamera = async () => {
        const muted = await videoChat.toggleCamera()
        setIsCameraMuted(muted)
    }

    const toggleMicrophone = async () => {
        const muted = await videoChat.toggleMicrophone()
        setIsMicMuted(muted)
    }

    const toggleScreenShare = async () => {
        const sharing = await videoChat.toggleScreenShare()
        setIsScreenSharing(sharing)
    }

    const value: VideoChatContextType = {
        toggleCamera,
        toggleMicrophone,
        toggleScreenShare,
        isCameraMuted,
        isMicMuted,
        isScreenSharing,
    }

    return (
        <VideoChatContext.Provider value={value}>
            {children}
        </VideoChatContext.Provider>
    )
}

export const useVideoChat = () => {
  const context = useContext(VideoChatContext)
  if (context === undefined) {
    throw new Error('useVideoChat must be used within a VideoChatProvider')
  }
  return context
}
