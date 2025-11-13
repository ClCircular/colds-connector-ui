import { useQuery } from '@tanstack/react-query'
import { useAuthUser } from '../../contexts/UserContext'
import { Transfer } from '../../interfaces/transfers/transfers.interface'

const handleGetTransfers = async ({ userEmail }: { userEmail: string }) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/v1/transfers'
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
  try {
    const response = await fetch(url, requestOptions)
    const data = await response.json()
    console.log({ data })
    return data as Transfer[]
  } catch (error) {
    console.log({ error })
    throw new Error('Error al llamar a la API')
  }
}

export const useGetTransfers = () => {
  const { user, userInfo } = useAuthUser()

  return useQuery({
    queryKey: ['transfers', user?.userId],
    queryFn: () => handleGetTransfers({ userEmail: userInfo?.email || '' }),
    enabled: !!user?.userId, // Only run if user is authenticated
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })
}
