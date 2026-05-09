import { useEffect, useRef } from 'react'
import { PlayApp } from '~/utils/pixi/PlayApp'

type PlayerTagsProps = {
    playApp: PlayApp
    avatarUrl?: string
}

function toTitleCase(str: string) {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}

export default function PlayerTags({ playApp, avatarUrl }: PlayerTagsProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const tagElements = useRef<Map<string, HTMLDivElement>>(new Map())
    const rafId = useRef<number>(0)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const getDummyAvatar = (name: string) => {
            const initial = name.charAt(0).toUpperCase() || '?'
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" rx="24" fill="%23374151"/><text x="24" y="30" font-size="22" fill="%23fff" text-anchor="middle" font-family="sans-serif">${initial}</text></svg>`
            return `data:image/svg+xml;base64,${btoa(svg)}`
        }

        const createTagElement = (uid: string, username: string, isLocal: boolean) => {
            const wrapper = document.createElement('div')
            wrapper.className = 'absolute pointer-events-none'
            wrapper.style.transform = 'translate(-50%, -100%)'

            const el = document.createElement('div')
            el.className =
                'relative flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.3)]'

            // Avatar (all players)
            const avatarWrapper = document.createElement('div')
            avatarWrapper.className = 'relative shrink-0'

            const img = document.createElement('img')
            img.src = isLocal ? (avatarUrl || getDummyAvatar(username)) : getDummyAvatar(username)
            img.alt = ''
            img.className = 'w-5 h-5 rounded-full object-cover ring-1 ring-white/20'
            img.onerror = () => {
                img.src = getDummyAvatar(username)
            }

            avatarWrapper.appendChild(img)

            // Online dot (local player only)
            if (isLocal) {
                const dot = document.createElement('div')
                dot.className =
                    'absolute -bottom-[1px] -right-[1px] w-2 h-2 rounded-full bg-emerald-400 ring-[1.5px] ring-black/60 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                avatarWrapper.appendChild(dot)
            }

            el.appendChild(avatarWrapper)

            const nameSpan = document.createElement('span')
            nameSpan.className =
                'text-white/90 text-[11px] font-medium whitespace-nowrap leading-none tracking-tight font-sans'
            nameSpan.textContent = toTitleCase(username)
            el.appendChild(nameSpan)

            // Tooltip pointer
            const arrow = document.createElement('div')
            arrow.className = 'absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 bg-black/40 rotate-45'
            arrow.style.clipPath = 'polygon(100% 0, 0 100%, 100% 100%)'
            el.appendChild(arrow)

            wrapper.appendChild(el)
            container.appendChild(wrapper)
            tagElements.current.set(uid, wrapper)
            return wrapper
        }

        const update = () => {
            const scale = playApp.scale
            const pivotX = playApp.getApp().stage.pivot.x
            const pivotY = playApp.getApp().stage.pivot.y

            const currentIds = new Set<string>()

            // Local player
            {
                const uid = playApp.uid
                const player = playApp.player
                currentIds.add(uid)

                let el = tagElements.current.get(uid)
                if (!el) {
                    el = createTagElement(uid, player.username, true)
                } else {
                    // Update name in case it changed
                    const nameSpan = el.querySelector('div > span') as HTMLSpanElement
                    if (nameSpan) {
                        nameSpan.textContent = toTitleCase(player.username)
                    }
                }

                const screenX = (player.parent.x - pivotX) * scale
                const screenY = (player.parent.y - pivotY) * scale
                el.style.left = `${screenX}px`
                el.style.top = `${screenY - (38 * scale) - 4}px`
            }

            // Other players
            for (const [uid, player] of Object.entries(playApp.players)) {
                currentIds.add(uid)

                let el = tagElements.current.get(uid)
                if (!el) {
                    el = createTagElement(uid, player.username, false)
                } else {
                    const nameSpan = el.querySelector('div > span') as HTMLSpanElement
                    if (nameSpan) {
                        nameSpan.textContent = toTitleCase(player.username)
                    }
                }

                const screenX = (player.parent.x - pivotX) * scale
                const screenY = (player.parent.y - pivotY) * scale
                el.style.left = `${screenX}px`
                el.style.top = `${screenY - (38 * scale) - 4}px`
            }

            // Remove disconnected players
            for (const [uid, el] of tagElements.current) {
                if (!currentIds.has(uid)) {
                    el.remove()
                    tagElements.current.delete(uid)
                }
            }

            rafId.current = requestAnimationFrame(update)
        }

        rafId.current = requestAnimationFrame(update)

        return () => {
            cancelAnimationFrame(rafId.current)
            for (const el of tagElements.current.values()) {
                el.remove()
            }
            tagElements.current.clear()
        }
    }, [playApp, avatarUrl])

    return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10" />
}
