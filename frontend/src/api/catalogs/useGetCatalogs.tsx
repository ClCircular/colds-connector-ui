import { useQuery } from '@tanstack/react-query'

interface Catalog {
  creationDate: string
  modificationDate: string
  title: string
  description: string
  additional: any
  numberOfResources: number
  _links: {
    self: {
      href: string
    }
    offers: {
      href: string
    }
  }
}

interface IResponse {
  _embedded: {
    catalogs: Catalog[]
  }
  page: {
    size: number
    totalElements: number
    totalPages: number
    number: number
  }
}

export const getCatalogs = async () => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: '/api/catalogs'
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
