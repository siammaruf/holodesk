import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/hooks/useAuth'
import RealmsMenu from '~/components/dashboard/RealmsMenu/RealmsMenu'
import { realmsApi } from '~/services/httpServices/realmService'

interface Realm {
  id: string
  name: string
  share_id: string
  shared?: boolean
}

export default function App() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [realms, setRealms] = useState<Realm[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin')
      return
    }

    if (user) {
      fetchRealms()
    }
  }, [user, loading, navigate])

  const fetchRealms = async () => {
    try {
      setIsLoading(true)
      const allRealms: Realm[] = []

      const { data: ownedRealms } = await realmsApi.list()
      if (ownedRealms) {
        allRealms.push(...ownedRealms)
      }

      const { data: visitedRealms } = await realmsApi.visited()
      if (visitedRealms) {
        allRealms.push(...visitedRealms)
      }

      setRealms(allRealms)
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load realms')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className='w-full h-screen grid place-items-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white'></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className='text-3xl pl-4 sm:pl-8 pt-8'>Your Spaces</h1>
      <RealmsMenu realms={realms} errorMessage={errorMessage} />
    </div>
  )
}
