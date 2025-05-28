import { useQuery } from '@tanstack/react-query'

export interface Catalog {
  catalogId: string
  creationDate: string
  modificationDate: string
  title: string
  description: string
  offers: Offer[]
}

export interface Offer {
  title: string
  offerId: string
}

export const getCatalogs = async () => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/v1/catalogs'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:8083`
  console.log({ url, requestOptions })
  const response = await fetch(url, requestOptions)
  const data = (await response.json()) || {}
  console.log({ data })
  return data as Catalog[]
}

export const useGetCatalogs = () => {
  const offersData = useQuery({
    queryKey: ['catalogs'],
    queryFn: getCatalogs,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })

  return offersData
}
