'use client'
import React, { useRef, useState } from 'react'
import { PlayApp } from '~/utils/pixi/PlayApp'
import { useEffect } from 'react'
import { RealmData } from '~/types/pixi'
import { useModal } from '~/hooks/useModal'
import { server } from '~/utils/backend/server'
import PlayerTags from './PlayerTags'

type PixiAppProps = {
    className?: string
    mapData: RealmData
    username: string
    access_token?: string
    realmId: string
    uid: string
    shareId: string
    initialSkin: string
    avatarUrl?: string
}

const PixiApp:React.FC<PixiAppProps> = ({ className, mapData, username, access_token, realmId, uid, shareId, initialSkin, avatarUrl }) => {

    const appRef = useRef<PlayApp | null>(null)
    const [playApp, setPlayApp] = useState<PlayApp | null>(null)
    const { setModal, setLoadingText, setFailedConnectionMessage, setErrorModal } = useModal()

    useEffect(() => {
        const mount = async () => {
            const app = new PlayApp(uid, realmId, mapData, username, initialSkin)
            appRef.current = app
            setModal('Loading')
            setLoadingText('Connecting to server...')
            const { success, errorMessage } = await server.connect(realmId, uid, shareId, access_token)
            if (!success) {
                setErrorModal('Failed To Connect')
                setFailedConnectionMessage(errorMessage)
                return
            }

            setLoadingText('Loading game...')
            await app.init()
            setPlayApp(app)
            setModal('None')
            const pixiApp = app.getApp()
            
            document.getElementById('app-container')!.appendChild(pixiApp.canvas)
        }

        if (!appRef.current) {
            mount()
        }
        
        return () => {
            if (appRef.current) {
                appRef.current.destroy()
            }
        }
    }, [])

    return (
        <div id='app-container' className={`relative overflow-hidden ${className}`}>
            {playApp && <PlayerTags playApp={playApp} avatarUrl={avatarUrl} />}
        </div>
    )
}

export default PixiApp
