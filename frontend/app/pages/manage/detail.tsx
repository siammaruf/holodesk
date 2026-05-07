import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '~/hooks/useAuth'
import ManageChild from './ManageChild'
import NotFound from '~/pages/not-found'
import { realmsApi } from '~/services/httpServices/realmService'

export default function Manage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [realm, setRealm] = useState<any>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin')
      return
    }

    if (user && id) {
      loadRealm()
    }
  }, [user, authLoading, id, navigate])

  const loadRealm = async () => {
    try {
      setLoading(true)
      const { data } = await realmsApi.getById(id!)
      if (!data) {
        setError(true)
        return
      }
      setRealm(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className='w-full h-screen grid place-items-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white'></div>
      </div>
    )
  }

  if (error || !realm) {
    return <NotFound />
  }

  return (
    <div>
      <ManageChild
        realmId={realm.id}
        startingShareId={realm.share_id}
        startingOnlyOwner={realm.only_owner}
        startingName={realm.name}
      />
    </div>
  )
}
