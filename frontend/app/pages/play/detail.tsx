import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '~/hooks/useAuth'
import NotFound from '~/pages/not-found'
import PlayClient from './PlayClient'
import { realmsApi } from '~/services/httpServices/realmService'
import { profilesApi } from '~/services/httpServices/userService'
import { formatEmailToName } from '~/utils/formatEmailToName'

export default function Play() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const shareId = searchParams.get('shareId') || ''
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [realm, setRealm] = useState<any>(null)
  const [skin, setSkin] = useState('009')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin')
      return
    }

    if (user && id) {
      loadData()
    }
  }, [user, authLoading, id, navigate])

  const loadData = async () => {
    try {
      setLoading(true)

      // Fetch realm
      let realmData
      if (!shareId) {
        const { data } = await realmsApi.getById(id!)
        realmData = data
      } else {
        const { data } = await realmsApi.getByShareId(shareId)
        realmData = data
      }

      // Fetch profile
      const { data: profile } = await profilesApi.me()

      if (!realmData || !profile) {
        setError('Realm not found')
        setLoading(false)
        return
      }

      if (!realmData.map_data?.rooms || realmData.map_data.rooms.length === 0) {
        setError('This realm has no rooms. Please open it in the editor and add at least one room.')
        setLoading(false)
        return
      }

      setRealm(realmData)
      setSkin(profile.skin || '009')

      // Add to visited realms if shared and not owner
      if (shareId && realmData.owner_id !== user?.id) {
        await profilesApi.addVisitedRealm(shareId)
      }

      setError('')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load realm')
    } finally {
      setLoading(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className='w-full h-dvh grid place-items-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white'></div>
      </div>
    )
  }

  if (error || !realm) {
    return <NotFound specialMessage={error} />
  }

  return (
      <PlayClient
      mapData={realm.map_data}
      username={formatEmailToName(user?.email || '')}
      access_token={undefined}
      realmId={id!}
      uid={user?.id || ''}
      shareId={shareId}
      initialSkin={skin}
      name={realm.name}
      avatarUrl={user?.avatar_url}
    />
  )
}
