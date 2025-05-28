import { useQuery } from '@tanstack/react-query'

//! Unused by the moment

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

export const getCatalogOffers = async ({
  catalogId
}: {
  catalogId: string
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: `/v1/catalogs/${catalogId}/offers`
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
  return data as IResponse
}

export const useGetCatalogOffers = (catalogId: string) => {
  const offersData = useQuery({
    queryKey: ['catalogOffers', catalogId],
    queryFn: ({ queryKey }) => {
      const [, catalogId] = queryKey
      return getCatalogOffers({ catalogId })
    },
    refetchOnWindowFocus: false,
    retryOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })

  return offersData
}
