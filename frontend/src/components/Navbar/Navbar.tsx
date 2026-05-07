import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { NavbarChild } from './NavbarChild'
import { formatEmailToName } from '@/utils/formatEmailToName'

export const Navbar:React.FC = () => {
    const { user } = useAuth()

    return (
        <NavbarChild name={formatEmailToName(user?.email || '')} avatar_url={user?.avatar_url || '/google-logo.png'}/>
    )
}
