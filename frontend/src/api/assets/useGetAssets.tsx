import { useQuery } from '@tanstack/react-query'
import { useAuthUser } from '../../contexts/UserContext'
import { AssetsResponse } from '../../interfaces/assets/assets.interface'

const handleGetAssets = async ({ userEmail }: { userEmail: string }) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/v1/assets'
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `https://0bfzsz9z0c.execute-api.us-east-1.amazonaws.com`
  console.log({ url, requestOptions })
  const response = await fetch(url, requestOptions)
  const data = await response.json()
  console.log({ data })
  return data as AssetsResponse[]
}

export const useGetAssets = () => {
  const { user, userInfo } = useAuthUser()
  return useQuery({
    queryKey: ['assets', user?.userId],
    queryFn: () => handleGetAssets({ userEmail: userInfo?.email || '' }),
    refetchOnWindowFocus: false,
    enabled: !!user?.userId, // Only run if user is authenticated
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })
}
