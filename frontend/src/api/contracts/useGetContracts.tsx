import { useQuery } from '@tanstack/react-query'
import { Contract } from '../../interfaces/contracts/contracts.interface'

export const getContracts = async () => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/v1/contracts'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:8083`
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
  const offersData = useQuery({
    queryKey: ['contracts'],
    queryFn: getContracts,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })

  return offersData
}
