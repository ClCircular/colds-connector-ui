import { useQuery } from '@tanstack/react-query'
import { useAuthUser } from '../../contexts/UserContext'
import { Negotiation } from '../../interfaces/negotiations/negotiations.interface'

const handleGetNegotiations = async () => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/v1/negotiations'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`
  console.log({ url, requestOptions })
  const response = await fetch(url, requestOptions)
  const data = await response.json()
  console.log({ data })
  return data as Negotiation[]
}

export const useGetNegotiations = () => {
  const { user } = useAuthUser()
  return useQuery({
    queryKey: ['negotiations', user?.userId],
    queryFn: handleGetNegotiations,
    refetchOnWindowFocus: false,
    enabled: !!user?.userId, // Only run if user is authenticated
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })
}
