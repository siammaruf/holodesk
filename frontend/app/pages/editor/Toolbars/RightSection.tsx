import React, { useState } from 'react'
import TileMenu from '../TileMenu'
import { SpecialTile } from '~/types/pixi'
import SpecialTiles from '../SpecialTiles'
import { SheetName } from '~/utils/pixi/spritesheet/spritesheet'
import { TileWithPalette } from '../Editor'

type RightSectionProps = {
    selectedTile: TileWithPalette
    setSelectedTile: (tile: TileWithPalette) => void
    selectSpecialTile: (specialTile: SpecialTile) => void
    specialTile: SpecialTile
    rooms: string[]
    setRooms: (rooms: string[]) => void
    roomIndex: number
    setRoomIndex: (index: number) => void
    palettes: SheetName[]
    selectedPalette: SheetName
    setSelectedPalette: (palette: SheetName) => void
}

type Tab = 'Tile' | 'Special Tiles'

const RightSection:React.FC<RightSectionProps> = ({ selectedTile, setSelectedTile, specialTile, selectSpecialTile, rooms, setRooms, roomIndex, setRoomIndex, palettes, selectedPalette, setSelectedPalette }) => {
    
    const [tab, setTab] = useState<Tab>('Tile')

    return (
        <div className='w-[380px] bg-[#1a1a2e]/60 backdrop-blur-sm flex flex-col select-none border-l border-white/5 shrink-0 h-full overflow-hidden'>
            <div className='flex flex-row h-11 px-2 pt-2 gap-1 shrink-0'>
                <button
                    className={`
                        grow rounded-t-lg cursor-pointer grid place-items-center select-none text-sm font-medium transition-all duration-200
                        ${tab === 'Tile'
                            ? 'bg-[#252542] text-white shadow-sm'
                            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                        }
                    `}
                    onClick={() => setTab('Tile')}
                >
                    Tiles
                </button>
                <button
                    className={`
                        grow rounded-t-lg cursor-pointer grid place-items-center select-none text-sm font-medium transition-all duration-200
                        ${tab === 'Special Tiles'
                            ? 'bg-[#252542] text-white shadow-sm'
                            : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                        }
                    `}
                    onClick={() => setTab('Special Tiles')}
                >
                    Special Tiles
                </button>
            </div>
            <div className='bg-[#252542] h-[2px] shrink-0'/>
            <div className='flex-1 overflow-hidden'>
                {tab === 'Tile' && (
                    <TileMenu
                        selectedTile={selectedTile}
                        setSelectedTile={setSelectedTile}
                        rooms={rooms}
                        setRooms={setRooms}
                        roomIndex={roomIndex}
                        setRoomIndex={setRoomIndex}
                        palettes={palettes}
                        selectedPalette={selectedPalette}
                        setSelectedPalette={setSelectedPalette}
                    />
                )}
                {tab === 'Special Tiles' && (
                    <div className='h-full overflow-y-auto transparent-scrollbar'>
                        <SpecialTiles specialTile={specialTile} selectSpecialTile={selectSpecialTile}/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RightSection