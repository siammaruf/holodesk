import React, { ReactNode } from 'react'

interface TooltipProps {
    children: ReactNode
    label: string
    position?: 'top' | 'bottom' | 'left' | 'right'
}

const Tooltip: React.FC<TooltipProps> = ({ children, label, position = 'top' }) => {
    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    }

    return (
        <div className='relative group/tooltip'>
            {children}
            <div
                className={`absolute ${positionClasses[position]} pointer-events-none
                opacity-0 group-hover/tooltip:opacity-100
                transition-all duration-150 ease-out
                scale-95 group-hover/tooltip:scale-100
                translate-y-1 group-hover/tooltip:translate-y-0
                z-50 whitespace-nowrap`}
            >
                <div className='px-2.5 py-1.5 text-[11px] font-medium text-white/90
                    bg-[rgba(15,15,15,0.85)] backdrop-blur-md
                    border border-white/[0.08] rounded-lg
                    shadow-lg shadow-black/40'>
                    {label}
                </div>
            </div>
        </div>
    )
}

export default Tooltip
