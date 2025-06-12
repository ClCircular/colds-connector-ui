import { useQuery } from '@tanstack/react-query'
import { useAuthUser } from '../../contexts/UserContext'
import { CatalogRequest } from '../../interfaces/negotiations/negotiations.interface'

const handleCatalogRequest = async (
  providerURL: string = 'https://host.docker.internal:19194'
) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: `/v1/negotiations/catalog-request`,
      body: {
        providerURL
      }
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`
  const data = await fetch(url, requestOptions)
  console.log({ data })
  const dataFormatted = await data.json()
  return dataFormatted as CatalogRequest
}

export const useCatalogRequest = (providerURL: string) => {
  const { user } = useAuthUser()
  return useQuery({
    queryKey: ['catalogRequest', providerURL, user?.userId],
    queryFn: () => handleCatalogRequest(providerURL),
    refetchOnWindowFocus: false,
    enabled: !!user?.userId && !!providerURL, // Only run if user is authenticated and providerURL is provided
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 // 1 hour
  })
}
