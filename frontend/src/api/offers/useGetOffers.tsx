import { useQuery } from '@tanstack/react-query'

interface Offer {
  creationDate: string
  modificationDate: string
  title: string
  description: string
  additional: any
  keywords: string[]
  publisher: string
  language: string
  license: string
  version: string
  sovereign: any
  endpointDocumentation: any
  paymentModality: string
  samples: any[]
}

interface IResponse {
  _embedded: {
    resources: Offer[]
  }
  page: {
    size: number
    totalElements: number
    totalPages: number
    number: number
  }
}

export const getOffers = async () => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/api/offers'
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

export const useGetOffers = () => {
  const offersData = useQuery({
    queryKey: ['offers'],
    queryFn: getOffers,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })

  return offersData
}
