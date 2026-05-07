import React, { useState } from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import BasicButton from '../BasicButton'
import BasicInput from '../BasicInput'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { removeExtraSpaces } from '@/utils/removeExtraSpaces'
import { realmsApi } from '@/utils/api/realms'

const CreateRealmModal:React.FC = () => {
    const { modal, setModal } = useModal()
    const [realmName, setRealmName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [useDefaultMap, setUseDefaultMap] = useState<boolean>(true)
    const navigate = useNavigate()

    async function createRealm() {
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

    return (
        <Modal open={modal === 'Create Realm'} closeOnOutsideClick>
            <div className='flex flex-col items-center p-4 w-[400px] gap-4'>
                <h1 className='text-2xl'>Create a Space</h1>
                <BasicInput label={'Space Name'} className='w-[280px]' value={realmName} onChange={onChange} maxLength={32}/>
                <div className='flex items-center gap-2 w-[280px]'>
                    <input
                        type="checkbox"
                        id="useDefaultMap"
                        checked={useDefaultMap}
                        onChange={(e) => setUseDefaultMap(e.target.checked)}
                    />
                    <label htmlFor="useDefaultMap">Use starter map</label>
                </div>
                <BasicButton disabled={realmName.length <= 0 || loading} onClick={createRealm} className='text-lg'>
                    Create
                </BasicButton>
            </div>
        </Modal>
    )
}

export default CreateRealmModal
