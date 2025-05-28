import { useQuery } from '@tanstack/react-query'

export interface Offer {
  offerId: string
  creationDate: string
  modificationDate: string
  title: string
  description: string
  keywords: string[]
  publisher: string
  language: string
  license: string
  version: number
  sovereign: string
  paymentModality: string
  catalogs: Catalog[]
  contracts: Contract[]
  representations: any[]
  subscriptions: any[]
  brokers: any[]
}

export interface Catalog {
  title: string
  catalogId: string
}

export interface Contract {
  title: string
  contractId: string
}

export const getOffers = async () => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/v1/offers'
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
    return data as Offer[]
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
