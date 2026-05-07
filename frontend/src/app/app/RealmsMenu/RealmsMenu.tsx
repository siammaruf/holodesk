import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import BasicButton from '@/components/BasicButton'
import DesktopRealmItem from './DesktopRealmItem'
import { useNavigate } from 'react-router-dom'
import { api } from '@/utils/api/client'

type Realm = {
    id: string,
    name: string,
    share_id: string
    shared?: boolean
}

type RealmsMenuProps = {
    realms: Realm[]
    errorMessage: string
}

const RealmsMenu:React.FC<RealmsMenuProps> = ({ realms, errorMessage }) => {
    const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null)
    const [playerCounts, setPlayerCounts] = useState<number[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
        }
    }, [errorMessage])

    useEffect(() => {
        getPlayerCounts()
    }, [realms])

    function getLink() {
        if (selectedRealm?.share_id) {
            return `/play/${selectedRealm.id}?shareId=${selectedRealm.share_id}`
        } else {
            return `/play/${selectedRealm?.id}`
        }
    }

    async function getPlayerCounts() {
        if (realms.length === 0) return
        try {
            const realmIds = realms.map((realm) => realm.id).join(',')
            const { data } = await api.get(`/sessions/player-counts?realmIds=${realmIds}`)
            if (data) {
                setPlayerCounts(data.playerCounts)
            }
        } catch {
            // Silently fail - player counts are not critical
        }
    }

    return (
        <>
            <div className='flex flex-col items-center p-4 gap-2 sm:hidden'>
                {realms.length === 0 && <p className='text-center'>You have no spaces you can join. Create one on desktop to get started!</p>}
                {realms.map((realm, index) => {
                    function selectRealm() {
                        setSelectedRealm(realm)
                    }

                    return (
                        <BasicButton key={realm.id} className={`w-full h-12 border-4 border-transparent flex flex-row items-center justify-between ${selectedRealm?.id === realm.id ? 'border-white' : ''}`} onClick={selectRealm}>
                            <p className='text-button text-xl text-left'>{realm.name}</p>
                            {playerCounts[index] !== undefined && <div className='rounded-full grid place-items-center w-8 h-8 font-bold bg-green-500'>
                                {playerCounts[index]}
                            </div>}
                        </BasicButton>
                    )
                })}
                <div className='fixed bottom-0 w-full bg-primary grid place-items-center p-2'>
                     <BasicButton className='w-[90%] text-xl px-0 py-0' disabled={selectedRealm === null} onClick={() => navigate(getLink())}>
                        Join Space
                    </BasicButton>
                </div>
            </div>

            <div className='flex-col items-center w-full p-8 hidden sm:flex'>
                {realms.length === 0 && <p className='text-center'>You have no spaces you can join. Create a space to get started!</p>}
                <div className='hidden sm:grid grid-cols-2 md:grid-cols-3 gap-8 w-full'>
                    {realms.map((realm, index) => {
                        return (
                            <DesktopRealmItem key={realm.id} name={realm.name} id={realm.id} shareId={realm.share_id} shared={realm.shared} playerCount={playerCounts[index]}/>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default RealmsMenu
