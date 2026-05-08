import React from 'react'

type SpecialTileItemProps = {
    children: React.ReactNode
    iconColor: 'red' | 'blue' | 'green' | 'yellow'
    title: string,
    description: string
    selected: boolean
    onClick: () => void
}

const SpecialTileItem:React.FC<SpecialTileItemProps> = ({ children, iconColor, title, description, selected, onClick }) => {
    
    function getColorClassName() {
        switch (iconColor) {
            case 'red':
                return 'bg-red-500'
            case 'blue':
                return 'bg-blue-500'
            case 'green':
                return 'bg-green-500'
            case 'yellow':
                return 'bg-yellow-500'
        }
    }

    return (
        <div
            className={`
                group relative w-full cursor-pointer transition-all duration-200 ease-out rounded-xl border
                ${selected
                    ? 'bg-white/10 border-white/20 shadow-lg shadow-black/20'
                    : 'bg-white/5 border-white/5 hover:bg-white/[0.07] hover:border-white/10'
                }
            `}
            onClick={onClick}
        >
            <div className='flex flex-row items-center gap-4 p-4'>
                <div className={`${getColorClassName()} rounded-xl p-2.5 shadow-lg transition-transform duration-200 group-hover:scale-105`}>
                    {children}
                </div>
                <div className='flex flex-col min-w-0'>
                    <h3 className='text-sm font-semibold text-white/90'>{title}</h3>
                    <p className='text-xs text-white/50 leading-relaxed mt-0.5'>{description}</p>
                </div>
            </div>
            {selected && (
                <div className='absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20 pointer-events-none'/>
            )}
        </div>
    )
}

export default SpecialTileItem