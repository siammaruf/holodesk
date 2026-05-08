import React from 'react'
import { useVideoChat } from '~/hooks/useVideoChat'

const AudioVisualizer: React.FC = () => {
    const { audioLevels, isMicMuted } = useVideoChat()

    if (isMicMuted) return null

    // Calculate average volume level from all bars
    const avgLevel = audioLevels.reduce((a, b) => a + b, 0) / audioLevels.length

    return (
        <div className='w-full h-[3px] bg-white/5 rounded-full overflow-hidden mt-0.5'>
            <div
                className='h-full rounded-full bg-[#08D6A0] transition-all duration-75 ease-out'
                style={{
                    width: `${Math.max(avgLevel * 100, 5)}%`,
                    opacity: 0.5 + avgLevel * 0.5,
                }}
            />
        </div>
    )
}

export default AudioVisualizer
