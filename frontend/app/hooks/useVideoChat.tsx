import React, { createContext, useContext, ReactNode, useEffect, useState, useRef, useCallback } from 'react'
import signal from '~/utils/signal'
import { videoChat } from '~/utils/video-chat/video-chat'

interface VideoChatContextType {
    toggleCamera: () => void
    toggleMicrophone: () => void
    toggleScreenShare: () => void
    isCameraMuted: boolean
    isMicMuted: boolean
    isScreenSharing: boolean
    audioDevices: MediaDeviceInfo[]
    videoDevices: MediaDeviceInfo[]
    selectedAudioDevice: string
    selectedVideoDevice: string
    switchAudioDevice: (deviceId: string) => Promise<void>
    switchVideoDevice: (deviceId: string) => Promise<void>
    audioLevels: number[]
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
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
    const [selectedAudioDevice, setSelectedAudioDevice] = useState('')
    const [selectedVideoDevice, setSelectedVideoDevice] = useState('')
    const [audioLevels, setAudioLevels] = useState<number[]>(new Array(8).fill(0))
    const rafRef = useRef<number | null>(null)

    useEffect(() => {
        const loadDevices = async () => {
            const audioDevs = await videoChat.getAudioDevices()
            const videoDevs = await videoChat.getVideoDevices()
            setAudioDevices(audioDevs)
            setVideoDevices(videoDevs)
            if (audioDevs.length > 0 && !selectedAudioDevice) {
                setSelectedAudioDevice(audioDevs[0].deviceId)
            }
            if (videoDevs.length > 0 && !selectedVideoDevice) {
                setSelectedVideoDevice(videoDevs[0].deviceId)
            }
        }
        loadDevices()

        const handleDeviceChange = () => {
            loadDevices()
        }
        navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange)
        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange)
        }
    }, [selectedAudioDevice, selectedVideoDevice])

    const updateAudioLevels = useCallback(() => {
        const analyser = videoChat.getAudioAnalyser()
        if (!analyser || isMicMuted) {
            setAudioLevels(new Array(8).fill(0))
            rafRef.current = requestAnimationFrame(updateAudioLevels)
            return
        }

        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(dataArray)

        const levels: number[] = []
        const bars = 8
        const step = Math.floor(dataArray.length / bars)
        for (let i = 0; i < bars; i++) {
            let sum = 0
            for (let j = 0; j < step; j++) {
                sum += dataArray[i * step + j]
            }
            const avg = sum / step
            const normalized = Math.min(avg / 255, 1)
            levels.push(normalized)
        }
        setAudioLevels(levels)
        rafRef.current = requestAnimationFrame(updateAudioLevels)
    }, [isMicMuted])

    useEffect(() => {
        rafRef.current = requestAnimationFrame(updateAudioLevels)
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [updateAudioLevels])

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
        if (!muted) {
            videoChat.setupAudioAnalyser()
        }
    }

    const toggleScreenShare = async () => {
        const sharing = await videoChat.toggleScreenShare()
        setIsScreenSharing(sharing)
    }

    const switchAudioDevice = async (deviceId: string) => {
        setSelectedAudioDevice(deviceId)
        await videoChat.switchAudioDevice(deviceId)
    }

    const switchVideoDevice = async (deviceId: string) => {
        setSelectedVideoDevice(deviceId)
        await videoChat.switchVideoDevice(deviceId)
    }

    const value: VideoChatContextType = {
        toggleCamera,
        toggleMicrophone,
        toggleScreenShare,
        isCameraMuted,
        isMicMuted,
        isScreenSharing,
        audioDevices,
        videoDevices,
        selectedAudioDevice,
        selectedVideoDevice,
        switchAudioDevice,
        switchVideoDevice,
        audioLevels,
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
