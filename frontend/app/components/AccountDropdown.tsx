import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useAuth } from '~/hooks/useAuth'
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface AccountDropdownProps {
    name: string
    avatar_url: string
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ name, avatar_url }) => {
    const { logout } = useAuth()

    async function handleSignOut() {
        await logout()
    }

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-3 rounded-full px-2 py-1.5 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                <span className="text-sm font-medium text-white/90 hidden sm:block">{name}</span>
                {avatar_url ? (
                    <img
                        alt="avatar"
                        src={avatar_url}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
                    />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/10">
                        <UserCircleIcon className="h-6 w-6 text-white/70" />
                    </div>
                )}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-[#1e1e2f] border border-white/10 shadow-2xl shadow-black/40 focus:outline-none overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs text-white/50">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{name}</p>
                    </div>
                    <div className="p-1.5">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleSignOut}
                                    className={`${
                                        active ? 'bg-white/10' : ''
                                    } group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors`}
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                    Sign Out
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default AccountDropdown
