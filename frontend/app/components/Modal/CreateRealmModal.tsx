import React, { useState } from 'react'
import Modal from './Modal'
import { useModal } from '~/hooks/useModal'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { removeExtraSpaces } from '~/utils/removeExtraSpaces'
import { realmsApi } from '~/services/httpServices/realmService'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

const CreateRealmModal:React.FC = () => {
    const { modal, setModal } = useModal()
    const [realmName, setRealmName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [useDefaultMap, setUseDefaultMap] = useState<boolean>(true)
    const navigate = useNavigate()

    async function createRealm() {
        if (!realmName.trim()) return
        setLoading(true)

        try {
            const { data } = await realmsApi.create(realmName, useDefaultMap)
            if (data) {
                setRealmName('')
                setModal('None')
                toast.success('Your space has been created!')
                navigate(`/editor/${data.id}`)
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to create space')
        }

        setLoading(false)
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = removeExtraSpaces(e.target.value)
        setRealmName(value)
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && realmName.trim().length > 0 && !loading) {
            createRealm()
        }
    }

    return (
        <Modal open={modal === 'Create Realm'} closeOnOutsideClick>
            <div className='flex flex-col items-center p-8 w-[420px] gap-6'>
                <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                        <PlusCircleIcon className="h-6 w-6 text-white/80" />
                    </div>
                    <h1 className='text-xl font-semibold text-white'>Create a Space</h1>
                    <p className="text-sm text-white/50 text-center">Name your new space and choose whether to start with a starter map.</p>
                </div>

                <div className="w-full flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/80">Space Name</label>
                    <input
                        type="text"
                        value={realmName}
                        onChange={onChange}
                        onKeyDown={handleKeyDown}
                        maxLength={32}
                        placeholder="My Awesome Space"
                        autoFocus
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                    />
                </div>

                <label className="w-full flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            id="useDefaultMap"
                            checked={useDefaultMap}
                            onChange={(e) => setUseDefaultMap(e.target.checked)}
                            className="peer sr-only"
                        />
                        <div className="h-5 w-5 rounded-md border border-white/20 bg-white/5 peer-checked:bg-white/90 peer-checked:border-white/90 transition-all flex items-center justify-center">
                            <svg className="h-3.5 w-3.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>
                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">Use starter map</span>
                </label>

                <button
                    disabled={realmName.trim().length <= 0 || loading}
                    onClick={createRealm}
                    className="w-full rounded-xl bg-white text-black font-semibold py-2.5 px-4 hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                        <>
                            <PlusCircleIcon className="h-5 w-5" />
                            Create Space
                        </>
                    )}
                </button>
            </div>
        </Modal>
    )
}

export default CreateRealmModal
