import React from 'react'
import { VideoCameraSlash, MicrophoneSlash, VideoCamera, Microphone, Monitor } from '@phosphor-icons/react'
import { useVideoChat } from '~/hooks/useVideoChat'

const MicAndCameraButtons:React.FC = () => {

    const { isCameraMuted, isMicMuted, isScreenSharing, toggleCamera, toggleMicrophone, toggleScreenShare } = useVideoChat()
    

    const micClass = `w-6 h-6 ${!isMicMuted ? 'text-[#08D6A0]' : 'text-[#FF2F49]'}`
    const cameraClass = `w-6 h-6 ${!isCameraMuted ? 'text-[#08D6A0]' : 'text-[#FF2F49]'}`
    const screenClass = `w-6 h-6 ${isScreenSharing ? 'text-[#08D6A0]' : 'text-[#BDBDBD]'}`

    return (
        <section className='flex flex-row gap-2'>
            <button 
                className={`${!isMicMuted ? 'bg-[#2A4B54] hover:bg-[#3b6975]' : 'bg-[#682E44] hover:bg-[#7a3650]'} 
                p-2 rounded-full animate-colors outline-none`}
                onClick={toggleMicrophone}
            >
                {isMicMuted ? <MicrophoneSlash className={micClass} /> : <Microphone className={micClass} />}
            </button>
            <button 
                className={`${!isCameraMuted ? 'bg-[#2A4B54] hover:bg-[#3b6975]' : 'bg-[#682E44] hover:bg-[#7a3650]'} 
                p-2 rounded-full animate-colors outline-none`}
                onClick={toggleCamera}
            >
                {isCameraMuted ? <VideoCameraSlash className={cameraClass} /> : <VideoCamera className={cameraClass} />}
            </button>
            <button 
                className={`${isScreenSharing ? 'bg-[#2A4B54] hover:bg-[#3b6975]' : 'bg-[#424A61] hover:bg-[#555e75]'} 
                p-2 rounded-full animate-colors outline-none`}
                onClick={toggleScreenShare}
                title="Share screen"
            >
                <Monitor className={screenClass} />
            </button>
        </section>
        
    )
}

export default MicAndCameraButtons
