import React, { useState, useRef, useEffect } from 'react'
import { VideoCameraSlash, VideoCamera, Monitor, CaretUp, Microphone, MicrophoneSlash } from '@phosphor-icons/react'
import { useVideoChat } from '~/hooks/useVideoChat'
import Tooltip from '~/components/Tooltip'

interface DeviceDropdownProps {
    devices: MediaDeviceInfo[]
    selectedDevice: string
    onSelect: (deviceId: string) => void
    isOpen: boolean
    onToggle: () => void
    label: string
    triggerIcon?: React.ReactNode
}

const DeviceDropdown: React.FC<DeviceDropdownProps> = ({
    devices,
    selectedDevice,
    onSelect,
    isOpen,
    onToggle,
    label,
    triggerIcon,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (isOpen) onToggle()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onToggle])

    return (
        <div ref={dropdownRef} className='relative'>
            <button
                onClick={onToggle}
                className='group w-4 h-4 grid place-items-center rounded outline-none hover:bg-white/15 transition-all duration-200'
                aria-label={label}
            >
                {triggerIcon ?? <CaretUp className='w-3 h-3 text-white/50 hover:text-white/80 transition-colors' />}
            </button>
            {isOpen && (
                <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                    min-w-[180px] max-w-[240px]
                    bg-[rgba(15,15,15,0.9)] backdrop-blur-xl
                    border border-white/[0.08] rounded-xl
                    shadow-2xl shadow-black/60
                    overflow-hidden'>
                    <div className='py-1'>
                        {devices.length === 0 && (
                            <div className='px-3 py-2 text-[11px] text-white/40'>No devices found</div>
                        )}
                        {devices.map((device) => (
                            <button
                                key={device.deviceId}
                                onClick={() => {
                                    onSelect(device.deviceId)
                                    onToggle()
                                }}
                                className={`w-full text-left px-3 py-2 text-[11px] transition-colors duration-150 truncate
                                    ${device.deviceId === selectedDevice
                                        ? 'text-[#08D6A0] bg-white/5'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                title={device.label}
                            >
                                <div className='flex items-center gap-2'>
                                    {device.deviceId === selectedDevice && (
                                        <div className='w-1 h-1 rounded-full bg-[#08D6A0] shrink-0' />
                                    )}
                                    <span className='truncate'>{device.label || 'Unknown device'}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

const MicDropdownIcon: React.FC<{ isMuted: boolean }> = ({ isMuted }) => {
    const { audioLevels } = useVideoChat()

    if (isMuted) {
        return <CaretUp className='w-3 h-3 text-white/50 group-hover:text-white/80 transition-colors' />
    }

    // Center-based equalizer on the dropdown icon — symmetric from center
    const symmetricLevels = [
        (audioLevels[0] + audioLevels[1]) / 2,
        audioLevels[2],
        (audioLevels[3] + audioLevels[4]) / 2,
        audioLevels[5],
        (audioLevels[6] + audioLevels[7]) / 2,
    ]

    // Calculate average activity for smooth spacing expansion
    const avgLevel = symmetricLevels.reduce((a, b) => a + b, 0) / symmetricLevels.length
    const isActive = avgLevel > 0.15

    return (
        <div className='relative w-4 h-4'>
            {/* Equalizer — hidden on hover, arrow revealed */}
            <div 
                className={`absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-all duration-300 ease-out ${isActive ? 'gap-[3px]' : 'gap-[1.5px]'}`}
            >
                {symmetricLevels.map((level, i) => (
                    <div
                        key={i}
                        className='w-[3px] rounded-full bg-white transition-all duration-75 ease-out will-change-transform'
                        style={{
                            height: '10px',
                            transformOrigin: 'center',
                            transform: `scaleY(${Math.max(0.2, 0.25 + level * 3.5)})`,
                            opacity: 0.5 + level * 0.5,
                        }}
                    />
                ))}
            </div>
            {/* CaretUp arrow — shown on hover */}
            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out'>
                <CaretUp className='w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors' />
            </div>
        </div>
    )
}

const MicAndCameraButtons: React.FC = () => {
    const {
        isCameraMuted,
        isMicMuted,
        isScreenSharing,
        toggleCamera,
        toggleMicrophone,
        toggleScreenShare,
        audioDevices,
        videoDevices,
        selectedAudioDevice,
        selectedVideoDevice,
        switchAudioDevice,
        switchVideoDevice,
    } = useVideoChat()

    const [micDropdownOpen, setMicDropdownOpen] = useState(false)
    const [cameraDropdownOpen, setCameraDropdownOpen] = useState(false)

    const micClass = `w-[22px] h-[22px] sm:w-6 sm:h-6 ${!isMicMuted ? 'text-[#08D6A0]' : 'text-[#FF2F49]'}`
    const cameraClass = `w-[22px] h-[22px] sm:w-6 sm:h-6 ${!isCameraMuted ? 'text-[#08D6A0]' : 'text-[#FF2F49]'}`
    const screenClass = `w-[22px] h-[22px] sm:w-6 sm:h-6 ${isScreenSharing ? 'text-[#08D6A0]' : 'text-white/40'}`

    return (
        <section className='flex flex-row items-center gap-0.5 sm:gap-1'>
            {/* Microphone Control Group */}
            {micDropdownOpen ? (
                <div className={`group/mic flex items-center rounded-lg border border-white/[0.08] transition-all duration-200 ease-out
                    ${!isMicMuted ? 'hover:bg-[#08D6A0]/10 hover:border-[#08D6A0]/20' : 'hover:bg-[#FF2F49]/10 hover:border-[#FF2F49]/20'}`}>
                    <button
                        className='p-1 sm:p-1.5 outline-none transition-transform duration-200 ease-out hover:scale-105 active:scale-95 rounded-l-lg'
                        onClick={toggleMicrophone}
                    >
                        {isMicMuted
                            ? <MicrophoneSlash className={micClass} />
                            : <Microphone className={micClass} />}
                    </button>

                    {/* Separator */}
                    <div className='w-px self-stretch bg-white/10' />

                    {/* Dropdown — equalizer when unmuted, arrow on hover */}
                    <div className='px-0.5 py-1 rounded-r-lg'>
                        <DeviceDropdown
                            devices={audioDevices}
                            selectedDevice={selectedAudioDevice}
                            onSelect={switchAudioDevice}
                            isOpen={micDropdownOpen}
                            onToggle={() => {
                                setMicDropdownOpen(!micDropdownOpen)
                                setCameraDropdownOpen(false)
                            }}
                            label='Select microphone'
                            triggerIcon={<MicDropdownIcon isMuted={isMicMuted} />}
                        />
                    </div>
                </div>
            ) : (
                <Tooltip label={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}>
                    <div className={`group/mic flex items-center rounded-lg border border-white/[0.08] transition-all duration-200 ease-out
                        ${!isMicMuted ? 'hover:bg-[#08D6A0]/10 hover:border-[#08D6A0]/20' : 'hover:bg-[#FF2F49]/10 hover:border-[#FF2F49]/20'}`}>
                        <button
                            className='p-1 sm:p-1.5 outline-none transition-transform duration-200 ease-out hover:scale-105 active:scale-95 rounded-l-lg'
                            onClick={toggleMicrophone}
                        >
                            {isMicMuted
                                ? <MicrophoneSlash className={micClass} />
                                : <Microphone className={micClass} />}
                        </button>

                        {/* Separator */}
                        <div className='w-px self-stretch bg-white/10' />

                        {/* Dropdown — equalizer when unmuted, arrow on hover */}
                        <div className='px-0.5 py-1 rounded-r-lg'>
                            <DeviceDropdown
                                devices={audioDevices}
                                selectedDevice={selectedAudioDevice}
                                onSelect={switchAudioDevice}
                                isOpen={micDropdownOpen}
                                onToggle={() => {
                                    setMicDropdownOpen(!micDropdownOpen)
                                    setCameraDropdownOpen(false)
                                }}
                                label='Select microphone'
                                triggerIcon={<MicDropdownIcon isMuted={isMicMuted} />}
                            />
                        </div>
                    </div>
                </Tooltip>
            )}

            {/* Camera Control Group */}
            {cameraDropdownOpen ? (
                <div className={`group/cam flex items-center rounded-lg border border-white/[0.08] transition-all duration-200 ease-out
                    ${!isCameraMuted ? 'hover:bg-[#08D6A0]/10 hover:border-[#08D6A0]/20' : 'hover:bg-[#FF2F49]/10 hover:border-[#FF2F49]/20'}`}>
                    <button
                        className='p-1 sm:p-1.5 outline-none transition-transform duration-200 ease-out hover:scale-105 active:scale-95 rounded-l-lg'
                        onClick={toggleCamera}
                    >
                        {isCameraMuted
                            ? <VideoCameraSlash className={cameraClass} />
                            : <VideoCamera className={cameraClass} />}
                    </button>

                    {/* Separator */}
                    <div className='w-px self-stretch bg-white/10' />

                    {/* Dropdown */}
                    <div className='px-0.5 py-1 rounded-r-lg'>
                        <DeviceDropdown
                            devices={videoDevices}
                            selectedDevice={selectedVideoDevice}
                            onSelect={switchVideoDevice}
                            isOpen={cameraDropdownOpen}
                            onToggle={() => {
                                setCameraDropdownOpen(!cameraDropdownOpen)
                                setMicDropdownOpen(false)
                            }}
                            label='Select camera'
                        />
                    </div>
                </div>
            ) : (
                <Tooltip label={isCameraMuted ? 'Turn Camera On' : 'Turn Camera Off'}>
                    <div className={`group/cam flex items-center rounded-lg border border-white/[0.08] transition-all duration-200 ease-out
                        ${!isCameraMuted ? 'hover:bg-[#08D6A0]/10 hover:border-[#08D6A0]/20' : 'hover:bg-[#FF2F49]/10 hover:border-[#FF2F49]/20'}`}>
                        <button
                            className='p-1 sm:p-1.5 outline-none transition-transform duration-200 ease-out hover:scale-105 active:scale-95 rounded-l-lg'
                            onClick={toggleCamera}
                        >
                            {isCameraMuted
                                ? <VideoCameraSlash className={cameraClass} />
                                : <VideoCamera className={cameraClass} />}
                        </button>

                        {/* Separator */}
                        <div className='w-px self-stretch bg-white/10' />

                        {/* Dropdown */}
                        <div className='px-0.5 py-1 rounded-r-lg'>
                            <DeviceDropdown
                                devices={videoDevices}
                                selectedDevice={selectedVideoDevice}
                                onSelect={switchVideoDevice}
                                isOpen={cameraDropdownOpen}
                                onToggle={() => {
                                    setCameraDropdownOpen(!cameraDropdownOpen)
                                    setMicDropdownOpen(false)
                                }}
                                label='Select camera'
                            />
                        </div>
                    </div>
                </Tooltip>
            )}

            {/* Screen Share */}
            <Tooltip label={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}>
                <button
                    className='p-1 sm:p-1.5 rounded-lg outline-none transition-all duration-200 ease-out
                        hover:bg-white/5 hover:scale-105 active:scale-95'
                    onClick={toggleScreenShare}
                >
                    <Monitor className={screenClass} />
                </button>
            </Tooltip>
        </section>
    )
}

export default MicAndCameraButtons
