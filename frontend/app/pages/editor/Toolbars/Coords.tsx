'use client'
import React, { useState, useEffect } from 'react'
import signal from '~/utils/signal'

type CoordsProps = {
    
}

const Coords:React.FC<CoordsProps> = () => {

    const [coords, setCoords] = useState({x: 0, y: 0})

    useEffect(() => {
        const setCoordinates = (data: any) => {
            setCoords(data)
        }

        signal.on('coordinates', setCoordinates)

        return () => {
            signal.off('coordinates', setCoordinates)
        }
    }, [])
    
    return (
        <div className='absolute bottom-4 right-[400px] px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white/70 text-xs font-mono pointer-events-none select-none border border-white/5 shadow-lg'>
            x: {coords.x} &nbsp; y: {coords.y}
        </div>
    )
}

export default Coords