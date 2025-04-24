import { useQuery } from '@tanstack/react-query'

interface DataSource {
  creationDate: string
  modificationDate: string
  id: string
  type: string
}

interface IResponse {
  _embedded: {
    datasources: DataSource[]
  }
  page: {
    size: number
    totalElements: number
    totalPages: number
    number: number
  }
}

export const getDataSources = async () => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/api/datasources'
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
    return data as IResponse
  } catch (error) {
    console.log({ error })
    throw new Error('Error al llamar a la API')
  }
}

export const useGetDataSources = () => {
  const offersData = useQuery({
    queryKey: ['datasources'],
    queryFn: getDataSources,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })

  return offersData
}
