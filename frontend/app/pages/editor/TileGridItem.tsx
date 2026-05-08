'use client'
import React from 'react'
import { SheetName } from '~/utils/pixi/spritesheet/spritesheet'
import { sprites } from '~/utils/pixi/spritesheet/spritesheet'

type TileGridItemProps = {
    sheetName: SheetName
    spriteName: string
    selected: boolean
    onClick: () => void
}

const MAX_PREVIEW_SIZE = 64

const TileGridItem: React.FC<TileGridItemProps> = ({ sheetName, spriteName, selected, onClick }) => {
    const sprite = sprites.spriteSheetDataSet[sheetName].sprites[spriteName]
    const sheet = sprites.spriteSheetDataSet[sheetName]

    const { x, y, width, height } = sprite
    const higherDimension = Math.max(width, height)
    const scale = higherDimension > 0 ? MAX_PREVIEW_SIZE / higherDimension : 1

    const scaledWidth = Math.round(width * scale)
    const scaledHeight = Math.round(height * scale)
    // Use exact fractional pixels for background math so the sprite region stays perfectly aligned
    const bgWidth = sheet.width * scale
    const bgHeight = sheet.height * scale
    const bgX = x * scale
    const bgY = y * scale

    return (
        <div
            className={`
                w-full aspect-square cursor-pointer rounded-xl flex flex-col items-center justify-center
                transition-all duration-200 ease-out
                ${selected
                    ? 'bg-white/10 ring-1 ring-white/20 shadow-lg shadow-black/20'
                    : 'bg-white/5 hover:bg-white/[0.08] hover:ring-1 hover:ring-white/10'
                }
            `}
            onClick={onClick}
            title={spriteName}
        >
            <div className='w-full grow grid place-items-center p-2'>
                <div
                    data-sprite={spriteName}
                    data-sheet={sheetName}
                    data-scale={scale.toFixed(3)}
                    data-bgwidth={bgWidth}
                    data-bgheight={bgHeight}
                    data-bgx={bgX}
                    data-bgy={bgY}
                    style={{
                        backgroundImage: `url(${sheet.url})`,
                        backgroundPosition: `-${bgX}px -${bgY}px`,
                        backgroundSize: `${bgWidth}px ${bgHeight}px`,
                        width: `${scaledWidth}px`,
                        height: `${scaledHeight}px`,
                        imageRendering: 'pixelated',
                        backgroundRepeat: 'no-repeat',
                        overflow: 'hidden',
                    }}
                />
            </div>
        </div>
    )
}

export default TileGridItem
