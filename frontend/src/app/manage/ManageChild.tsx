import React, { useState } from 'react'
import BasicButton from '@/components/BasicButton'
import { toast } from 'react-toastify'
import { useModal } from '../hooks/useModal'
import { Copy } from '@phosphor-icons/react'
import BasicInput from '@/components/BasicInput'
import { removeExtraSpaces } from '@/utils/removeExtraSpaces'
import { realmsApi } from '@/utils/api/realms'

type ManageChildProps = {
    realmId: string
    startingShareId: string
    startingOnlyOwner: boolean
    startingName: string
}

const ManageChild:React.FC<ManageChildProps> = ({ realmId, startingShareId, startingOnlyOwner, startingName }) => {
    const [selectedTab, setSelectedTab] = useState(0)
    const [shareId, setShareId] = useState(startingShareId)
    const [onlyOwner, setOnlyOwner] = useState(startingOnlyOwner)
    const [name, setName] = useState(startingName)
    const { setModal, setLoadingText } = useModal()

    async function save() {
        if (name.trim() === '') {
            toast.error('Name cannot be empty!')
            return
        }

        setModal('Loading')
        setLoadingText('Saving...')

        try {
            await realmsApi.update(realmId, {
                only_owner: onlyOwner,
                name: name,
            })
            toast.success('Saved!')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to save')
        }

        setModal('None')
    }

    function copyLink() {
        const link = window.location.origin + '/play/' + realmId + '?shareId=' + shareId
        navigator.clipboard.writeText(link)
        toast.success('Link copied!')
    }

    async function generateNewLink() {
        setModal('Loading')
        setLoadingText('Generating new link...')

        try {
            const { data } = await realmsApi.regenerateShareId(realmId)
            const newShareId = data.share_id
            setShareId(newShareId)
            const link = window.location.origin + '/play/' + realmId + '?shareId=' + newShareId
            navigator.clipboard.writeText(link)
            toast.success('New link copied!')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to generate link')
        }

        setModal('None')
    }

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = removeExtraSpaces(e.target.value)
        setName(value)
    }

    return (
        <div className='flex flex-col items-center pt-24'>
            <div className='flex flex-row gap-8 relative'>
                <div className='flex flex-col h-[500px] w-[200px] border-white border-r-2 pr-4 gap-2'>
                    <h1 className={`${selectedTab === 0 ? 'font-bold underline' : ''} cursor-pointer`} onClick={() => setSelectedTab(0)}>General</h1>
                    <h1 className={`${selectedTab === 1 ? 'font-bold underline' : ''} cursor-pointer`} onClick={() => setSelectedTab(1)}>Sharing Options</h1>
                </div>
                <div className='flex flex-col w-[300px]'>
                    {selectedTab === 0 && (
                        <div className='flex flex-col gap-2'>
                            Name
                            <BasicInput value={name} onChange={onNameChange} maxLength={32}/>
                        </div>
                    )}
                    {selectedTab === 1 && (
                        <div className='flex flex-col gap-2'>
                            <BasicButton className='flex flex-row items-center gap-2 text-sm max-w-max' onClick={copyLink}>
                                Copy Link <Copy />
                            </BasicButton>
                            <BasicButton className='flex flex-row items-center gap-2 text-sm max-w-max' onClick={generateNewLink}>
                                Generate New Link <Copy />
                            </BasicButton>
                        </div>
                    )}
                </div>
                <BasicButton className='absolute bottom-[-50px] right-0' onClick={save}>
                    Save
                </BasicButton>
            </div>
        </div>
    )
}

export default ManageChild
