import { useQuery } from '@tanstack/react-query'
import { Contract } from '../../interfaces/contracts/contracts.interface'
import { useAuthUser } from '../../contexts/UserContext'

export const getContracts = async ({ userEmail }: { userEmail: string }) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/v1/contracts'
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`
  console.log({ url, requestOptions })
  try {
    const response = await fetch(url, requestOptions)
    const data = await response.json()
    console.log({ data })
    return data as Contract[]
  } catch (error) {
    console.log({ error })
    throw new Error('Error al llamar a la API')
  }
}

export const useGetContracts = () => {
  const { user, userInfo } = useAuthUser()
  const contractsData = useQuery({
    queryKey: ['contracts', user?.userId],
    queryFn: () => getContracts({ userEmail: userInfo?.email || '' }),
    enabled: !!user?.userId, // Only run if user is authenticated
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })

  return contractsData
}
