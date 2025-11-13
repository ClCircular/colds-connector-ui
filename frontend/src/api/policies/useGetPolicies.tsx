import { useQuery } from '@tanstack/react-query'
import { useAuthUser } from '../../contexts/UserContext'
import { Policy } from '../../interfaces/policies/policies.interface'

const handleGetPolicies = async ({ userEmail }: { userEmail: string }) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/v1/policies'
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url =
    import.meta.env.VITE_API_URL ??
    `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`
  console.log({ url, requestOptions })
  const response = await fetch(url, requestOptions)
  const data = await response.json()
  console.log({ data })
  return data as Policy[]
}

export const useGetPolicies = () => {
  const { user, userInfo } = useAuthUser()
  return useQuery({
    queryKey: ['policies', user?.userId],
    queryFn: () => handleGetPolicies({ userEmail: userInfo?.email || '' }),
    enabled: !!user?.userId, // Only run if user is authenticated
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })
}
