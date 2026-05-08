'use client'
import React, { useState } from 'react'
import Dropdown from '~/components/Dropdown'
import { SheetName } from '~/utils/pixi/spritesheet/spritesheet'
import TileMenuGrid from './TileMenuGrid'
import Rooms from './Rooms'
import { TileWithPalette } from './Editor'
import { Layer } from '~/types/pixi'
import ToolButton from './Toolbars/ToolButton'
import { Wall, FlowerTulip, Couch } from '@phosphor-icons/react'

type TileMenuProps = {
    selectedTile: TileWithPalette,
    setSelectedTile: (tile: TileWithPalette) => void
    rooms: string[]
    setRooms: (rooms: string[]) => void
    roomIndex: number
    setRoomIndex: (index: number) => void
    palettes: SheetName[]
    selectedPalette: SheetName
    setSelectedPalette: (palette: SheetName) => void
}


const TileMenu:React.FC<TileMenuProps> = ({ selectedTile, setSelectedTile, rooms, setRooms, roomIndex, setRoomIndex, palettes, selectedPalette, setSelectedPalette }) => {

    const [selectedLayer, setSelectedLayer] = useState<Layer>('floor')

    return (
        <div className='flex flex-col h-full'>
            <div className='flex flex-col gap-3 p-4 border-b border-white/5 shrink-0'>
                <div className='flex flex-row items-center justify-between w-full'>
                    <span className='text-sm font-medium text-white/60'>Palette</span>
                    <Dropdown items={palettes} selectedItem={selectedPalette} setSelectedItem={setSelectedPalette}/>
                </div>
                <div className='w-full flex flex-row gap-2'>
                    <ToolButton selected={selectedLayer === 'floor'} onClick={() => setSelectedLayer('floor')} label='Floor'>
                        <Wall className='w-5 h-5 text-white/90'/>
                    </ToolButton>
                    <ToolButton selected={selectedLayer === 'above_floor'} onClick={() => setSelectedLayer('above_floor')} label='Above Floor'>
                        <FlowerTulip className='w-5 h-5 text-white/90'/>
                    </ToolButton>
                    <ToolButton selected={selectedLayer === 'object'} onClick={() => setSelectedLayer('object')} label='Objects'>
                        <Couch className='w-5 h-5 text-white/90'/>
                    </ToolButton>
                </div>
            </div>
            <div className='flex-1 min-h-0 overflow-hidden'>
                <TileMenuGrid selectedPalette={selectedPalette} selectedTile={selectedTile} setSelectedTile={setSelectedTile} layer={selectedLayer}/>
            </div>
            <div className='shrink-0 border-t border-white/5'>
                <Rooms
                    rooms={rooms}
                    setRooms={setRooms}
                    roomIndex={roomIndex}
                    setRoomIndex={setRoomIndex}
                />
            </div>
        </div>
    )
}

export default TileMenu