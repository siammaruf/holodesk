import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import { Link, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import BasicButton from '~/components/BasicButton'
import signal from '~/utils/signal'
import { useModal } from '~/hooks/useModal'
import { RealmData } from '~/types/pixi'
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
        const save = async (realmData: RealmData) => {
            try {
                await realmsApi.update(id!, { map_data: realmData })
                toast.success('Saved!')
            } catch (error: any) {
                toast.error(error?.response?.data?.message || 'Failed to save')
            }

            setModal('None')
            signal.emit('saved')
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
        <div className='w-full h-[48px] bg-secondary flex flex-row items-center p-2 border-b-2 border-black gap-2 relative'>
            <div className='hover:bg-light-secondary animate-colors aspect-square grid place-items-center rounded-lg p-1'>
                <Link to='/app'>
                    <ArrowLeftEndOnRectangleIcon className='h-8 w-8 text-white'/>
                </Link>
            </div>
            <BasicButton onClick={beginSave} className='flex flex-row gap-2 items-center py-0 px-[8px] h-full '>
                Save
                <FloppyDisk className='h-6 w-6'/>
            </BasicButton>
            <p className='text-xs italic'>Saving will kick any players that are online.</p>
            <div className='absolute right-12 xl:right-[475px] hidden lg:flex flex-row gap-2 items-center'>
                {barWidth > 0.9 && <p className='text-xs italic text-red-500'>{barWidth >= 1 ? "You're out of space!" : "You're running out of space!"}</p>}
                <div className='w-80 h-[12px] rounded-md border-white border-[1px] overflow-hidden'>
                    <div className={`${getBgColor()} h-full`} style={{
                        width: barWidth * 100 + '%'
                    }}/>
                </div>
            </div>
        </div>
    )
}

export default TopBar
