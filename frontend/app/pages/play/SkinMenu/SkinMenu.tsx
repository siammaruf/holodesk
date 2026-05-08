import React, { useState, useEffect } from 'react'
import Modal from '~/components/Modal/Modal'
import { useModal } from '~/hooks/useModal'
import AnimatedCharacter from './AnimatedCharacter'
import { ArrowFatLeft, ArrowFatRight } from '@phosphor-icons/react'
import BasicLoadingButton from '~/components/BasicLoadingButton'
import { skins, defaultSkin } from '~/utils/pixi/Player/skins'
import signal from '~/utils/signal'
import { toast } from 'react-toastify'
import { profilesApi } from '~/services/httpServices/userService'

const SkinMenu:React.FC = () => {
    const { modal, setModal } = useModal()
    const [skinIndex, setSkinIndex] = useState<number>(skins.indexOf(defaultSkin))
    const [loading, setLoading] = useState(false)

    function decrement() {
        setSkinIndex((prevIndex) => (prevIndex - 1 + skins.length) % skins.length)
    }

    function increment() {
        setSkinIndex((prevIndex) => (prevIndex + 1) % skins.length)
    }

    useEffect(() => {
        const onGotSkin = (skin: string) => {
            setSkinIndex(skins.indexOf(skin))
        }

        signal.on('skin', onGotSkin)

        return () => {
            signal.off('skin', onGotSkin)
        }
    }, [])

    async function switchSkins() {
        const newSkin = skins[skinIndex]

        try {
            await profilesApi.update({ skin: newSkin })
            signal.emit('switchSkin', newSkin)
            setModal('None')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update skin')
        }
    }

    async function handleSwitchSkinsClick() {
        setLoading(true)
        await switchSkins()
        setLoading(false)
    }

    return (
        <Modal open={modal === 'Skin'} closeOnOutsideClick>
            <div className='w-[420px] h-[440px] flex flex-col items-center justify-between py-8 px-6'>
                {/* Header */}
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-lg font-semibold text-white/90">Choose Your Character</h2>
                    <div className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.06]">
                        <p className="text-xs text-white/50 font-medium">{skinIndex + 1} / {skins.length}</p>
                    </div>
                </div>

                {/* Character preview */}
                <div className="relative w-full flex-1 flex items-center justify-center">
                    {/* Decorative ring */}
                    <div className="absolute w-48 h-48 rounded-full border border-white/[0.04]" />
                    <div className="absolute w-64 h-64 rounded-full border border-white/[0.03]" />

                    <div className="relative z-10 p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                        <AnimatedCharacter src={`/sprites/characters/Character_${skins[skinIndex]}.png`} className='w-32 h-32'/>
                    </div>
                </div>

                {/* Navigation */}
                <div className='flex flex-row items-center justify-center gap-4 w-full'>
                    <button
                        className='w-12 h-12 rounded-xl glass grid place-items-center outline-none
                            hover:bg-white/[0.08] hover:scale-110 active:scale-95
                            transition-all duration-200 ease-out group'
                        onClick={decrement}
                    >
                        <ArrowFatLeft className='h-5 w-5 text-white/50 group-hover:text-white/80 transition-colors'/>
                    </button>

                    <BasicLoadingButton
                        onClick={handleSwitchSkinsClick}
                        loading={loading}
                        className='flex-1 py-3 rounded-xl glow-button text-sm font-semibold'
                    >
                        Confirm Selection
                    </BasicLoadingButton>

                    <button
                        className='w-12 h-12 rounded-xl glass grid place-items-center outline-none
                            hover:bg-white/[0.08] hover:scale-110 active:scale-95
                            transition-all duration-200 ease-out group'
                        onClick={increment}
                    >
                        <ArrowFatRight className='h-5 w-5 text-white/50 group-hover:text-white/80 transition-colors'/>
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default SkinMenu
