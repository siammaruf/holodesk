import React from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { useModal } from '~/hooks/useModal'
import AccountDropdown from '../AccountDropdown'

type NavbarChildProps = {
    name: string,
    avatar_url: string
}

export const NavbarChild:React.FC<NavbarChildProps> = ({ name, avatar_url }) => {
    const { setModal } = useModal()

    return (
        <div className='h-16'>
            <div className='w-full fixed top-0 left-0 h-16 bg-[#1a1a2e]/90 backdrop-blur-md border-b border-white/5 flex flex-row items-center px-4 sm:px-8 justify-between z-10'>
                <button
                    onClick={() => setModal('Create Realm')}
                    className='hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20'
                >
                    <PlusCircleIcon className='h-5 w-5'/>
                    Create Space
                </button>
                <AccountDropdown name={name} avatar_url={avatar_url} />
            </div>
        </div>
    )
}
