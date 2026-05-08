import React, { useEffect, useState, useRef } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import BasicButton from '~/components/BasicButton'
import signal from '~/utils/signal'
import { useModal } from '~/hooks/useModal'
import RoomItem from './RoomItem'
import { toast } from 'react-toastify'

type RoomsProps = {
    rooms: string[]
    setRooms: (rooms: string[]) => void
    roomIndex: number
    setRoomIndex: (index: number) => void
}

const Rooms:React.FC<RoomsProps> = ({ rooms, setRooms, roomIndex, setRoomIndex }) => {
    const roomsContainerRef = useRef<HTMLDivElement>(null)
    const { setModal, setLoadingText }= useModal()
    const firstRender = useRef(true)

    function onClickCreateRoom() {
        if (rooms.length >= 50) {
            toast.error('You can only have up to 50 rooms.')
            return
        }

        signal.emit('createRoom')
    }

    useEffect(() => {
        // scroll when new room is created
        if (firstRender.current === false) {
            roomsContainerRef.current?.scrollTo(0, roomsContainerRef.current.scrollHeight)
        }

        const onNewRoom = (newRoom: string) => {
            setRooms([...rooms, newRoom])
            firstRender.current = false
        }

        const onLoadingRoom = () => {
            setModal('Loading')
            setLoadingText('Loading room...')
        }

        const onRoomChanged = (index: number) => {
            setRoomIndex(index)
            setModal('None')
        }

        const onRoomDeleted = ({ deletedIndex, newIndex }: { deletedIndex: number, newIndex: number }) => {
            setRoomIndex(newIndex)
            const newRooms = [...rooms]
            newRooms.splice(deletedIndex, 1)
            setRooms(newRooms)
        }

        const onRoomNameChanged = ({ index, newName }: { index: number, newName: string }) => {
            const newRooms = [...rooms]
            newRooms[index] = newName
            setRooms(newRooms)
        }

        signal.on('newRoom', onNewRoom)
        signal.on('loadingRoom', onLoadingRoom)
        signal.on('roomChanged', onRoomChanged)
        signal.on('roomDeleted', onRoomDeleted)
        signal.on('roomNameChanged', onRoomNameChanged)

        return () => {
            signal.off('newRoom', onNewRoom)
            signal.off('loadingRoom', onLoadingRoom)
            signal.off('roomChanged', onRoomChanged)
            signal.off('roomDeleted', onRoomDeleted)
            signal.off('roomNameChanged', onRoomNameChanged)
        }
    }, [rooms])

    return (
        <div className='flex flex-col gap-2 p-4 w-full'>
            <div className='flex flex-row items-center justify-between'>
                <h2 className='text-sm font-medium text-white/60'>Rooms</h2>
                <span className='text-xs text-white/30'>{rooms.length}/50</span>
            </div>
            <div className='flex flex-col w-full overflow-y-auto max-h-[140px] gap-1.5 transparent-scrollbar' ref={roomsContainerRef}>
                {rooms.map((room, index) => (
                    <RoomItem rooms={rooms} selectedRoomIndex={roomIndex} roomIndex={index} roomName={room} setRooms={setRooms} key={index}/>
                ))}
            </div>
            <BasicButton className='flex flex-row items-center gap-2 text-sm w-full justify-center h-10 !rounded-xl !bg-[#4f46e5] hover:!bg-[#4338ca] shadow-lg shadow-indigo-500/20 mt-1' onClick={onClickCreateRoom}>
                <PlusCircleIcon className='h-4 w-4'/>
                Create Room
            </BasicButton>
        </div>
    )
}

export default Rooms