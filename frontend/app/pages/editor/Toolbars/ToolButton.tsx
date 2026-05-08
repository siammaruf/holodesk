import React, { useState } from 'react'

type ToolButtonProps = {
    children?: React.ReactNode
    selected: boolean
    onClick?: () => void
    className?: string
    label?: string
    disabled?: boolean
}

const ToolButton:React.FC<ToolButtonProps> = ({ children, selected, onClick, className, label, disabled }) => {
    
    const [showTooltip, setShowTooltip] = useState<boolean>(false)

    const handleShowToolTip = (show: boolean) => {
        if (disabled) {
            setShowTooltip(false)
        } else {
            setShowTooltip(show)
        }

    }

    return (
        <div className='relative' onMouseEnter={() => handleShowToolTip(true)} onMouseLeave={() => handleShowToolTip(false)}>
            <button
                className={`
                    ${selected ? 'bg-white/15 text-white shadow-inner' : 'text-white/70'}
                    ${disabled ? 'pointer-events-none text-white/20 cursor-default' : 'hover:bg-white/10 hover:text-white active:scale-95'}
                    transition-all duration-200 ease-out
                    aspect-square grid place-items-center rounded-xl p-2
                    ${className}
                `}
                onClick={onClick}
            >
                {children}
            </button>
            {showTooltip && label && (
                <div className='absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1e1e2e] border border-white/10 text-white/90 text-xs rounded-lg whitespace-nowrap select-none shadow-xl z-50 pointer-events-none'>
                    {label}
                    <div className='absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-1.5 h-1.5 bg-[#1e1e2e] border-l border-b border-white/10 rotate-45'/>
                </div>
            )}
        </div>
    )
}
export default ToolButton