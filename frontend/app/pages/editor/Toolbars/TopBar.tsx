import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import { Link, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import BasicButton from '~/components/BasicButton'
import signal from '~/utils/signal'
import { useModal } from '~/hooks/useModal'
import { toast } from 'react-toastify'
import { FloppyDisk } from '@phosphor-icons/react'
import { realmsApi } from '~/services/httpServices/realmService'

type TopBarProps = {
}

const TopBar:React.FC<TopBarProps> = () => {
    const { setLoadingText, setModal } = useModal()
    const { id } = useParams<{ id: string }>()

    const [barWidth, setBarWidth] = useState<number>(0)

    function beginSave() {
        signal.emit('beginSave')
        setModal('Loading')
        setLoadingText('Saving...')
    }

    useEffect(() => {
        const save = async (payload: { map_delta: any } | null) => {
            if (!payload) {
                setModal('None')
                signal.emit('saved', true)
                toast.success('Nothing to save')
                return
            }

            let success = false
            try {
                await realmsApi.update(id!, payload)
                toast.success('Saved!')
                success = true
            } catch (error: any) {
                toast.error(error?.response?.data?.message || 'Failed to save')
            }

            setModal('None')
            signal.emit('saved', success)
        }

        const onBarWidth = (width: number) => {
            setBarWidth(width)
        }

        signal.on('save', save)
        signal.on('barWidth', onBarWidth)

        return () => {
            signal.off('save', save)
            signal.off('barWidth', onBarWidth)
        }
    }, [id])

    function getBgColor() {
        if (barWidth < 0.7) {
            return 'bg-quaternary'
        } else if (barWidth < 0.9) {
            return 'bg-orange-400'
        } else {
            return 'bg-red-500'
        }
    }

    return (
        <div className='w-full h-[52px] bg-[#1a1a2e]/80 backdrop-blur-md flex flex-row items-center px-4 border-b border-white/10 gap-3 relative shrink-0 z-10'>
            <div className='hover:bg-white/10 animate-colors aspect-square grid place-items-center rounded-xl p-1.5 transition-all'>
                <Link to='/app'>
                    <ArrowLeftEndOnRectangleIcon className='h-6 w-6 text-white/80 hover:text-white transition-colors'/>
                </Link>
            </div>
            <BasicButton onClick={beginSave} className='flex flex-row gap-2 items-center py-0 px-4 h-9 !rounded-xl !bg-[#4f46e5] hover:!bg-[#4338ca] shadow-lg shadow-indigo-500/20 transition-all'>
                <span className='font-medium'>Save</span>
                <FloppyDisk className='h-4 w-4'/>
            </BasicButton>
            <p className='text-xs text-white/40 hidden sm:block'>Saving will kick any players that are online.</p>
            <div className='ml-auto hidden lg:flex flex-row gap-3 items-center pr-2'>
                {barWidth > 0.9 && (
                    <p className='text-xs font-medium text-red-400 animate-pulse'>
                        {barWidth >= 1 ? "You're out of space!" : "You're running out of space!"}
                    </p>
                )}
                <div className='w-64 h-2 rounded-full bg-white/10 overflow-hidden'>
                    <div
                        className={`${getBgColor()} h-full rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${Math.min(barWidth * 100, 100)}%` }}
                    />
                </div>
                <span className='text-xs text-white/40 w-10 text-right'>{Math.round(barWidth * 100)}%</span>
            </div>
        </div>
    )
}

export default TopBar
