'use client'
import React, { useEffect, useState } from 'react'
import TileGridItem from './TileGridItem'
import { SheetName, sprites } from '~/utils/pixi/spritesheet/spritesheet'
import { TileWithPalette } from './Editor'
import { Layer } from '~/types/pixi'

type TileMenuGridProps = {
    selectedPalette: SheetName
    selectedTile: TileWithPalette
    setSelectedTile: (tile: TileWithPalette) => void
    layer: Layer
}

const TileMenuGrid:React.FC<TileMenuGridProps> = ({ selectedPalette, selectedTile, setSelectedTile, layer }) => {

    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        const load = async () => {
            setLoading(true)
            await sprites.load(selectedPalette)
            setLoading(false)
        }
        load()
    }, [selectedPalette])

    const getTiles = () => {
        const tiles = []
        for (const spriteData of sprites.spriteSheetDataSet[selectedPalette].spritesList) {
            const spriteLayer = spriteData.layer || 'floor'
            if (spriteLayer === layer && spriteData.name !== 'empty') {
                tiles.push(
                    <TileGridItem
                        sheetName={selectedPalette}
                        spriteName={spriteData.name}
                        selected={selectedTile.name === spriteData.name && selectedTile.palette === selectedPalette}
                        onClick={() => setSelectedTile({ name: spriteData.name, palette: selectedPalette })}
                        key={`${selectedPalette}-${spriteData.name}-${tiles.length}`}
                    />
                )
            }
        }

        return tiles
    }

    const tilesToDisplay = getTiles()

    return (
        <div className='w-full h-full overflow-y-auto p-4 transparent-scrollbar'>
            {tilesToDisplay.length === 0 && <div className='text-center text-white/40 text-sm py-8'>No tiles in this category.</div>}
            {!loading && (
                <div className='grid grid-cols-4 w-full gap-2'>
                    {tilesToDisplay}
                </div>
            )}
        </div>
    )
}

export default TileMenuGrid