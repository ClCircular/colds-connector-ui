import { useQuery } from '@tanstack/react-query'
import { useAuthUser } from '../../contexts/UserContext'
import { Credential } from '../../interfaces/credentials/credentials.interface'

const handleGetCredentials = async () => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/credentials',
      useIdentityHub: true
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`
  const response = await fetch(url, requestOptions)
  const data = await response.json()
  return data as Credential[]
}

export const useGetCredentials = () => {
  const { user } = useAuthUser()
  return useQuery({
    queryKey: ['credentials', user?.userId],
    queryFn: handleGetCredentials,
    enabled: !!user?.userId,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60
  })
}
