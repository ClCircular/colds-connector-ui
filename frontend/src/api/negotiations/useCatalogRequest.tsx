import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthUser } from '../../contexts/UserContext'
import { CatalogRequest } from '../../interfaces/negotiations/negotiations.interface'

const handleCatalogRequest = async ({
  providerURL = 'https://host.docker.internal:19194',
  userEmail
}: {
  providerURL: string
  userEmail: string
}) => {
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
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`
  const data = await fetch(url, requestOptions)
  console.log({ data })
  const dataFormatted = await data.json()
  return dataFormatted as CatalogRequest
}

export const useCatalogRequest = () => {
  const { user, userInfo } = useAuthUser()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['catalogRequest', user?.userId],
    mutationFn: ({ providerURL }: { providerURL: string }) =>
      handleCatalogRequest({ providerURL, userEmail: userInfo?.email || '' }),
    onError: (error) => {
      console.error('Error fetching catalog request:', error)
    },
    onSuccess: (data) => {
      console.log('Catalog request successful:', data)
      queryClient.setQueryData<CatalogRequest[]>(
        ['catalogRequests', user?.userId],
        (oldData) => (oldData ? [...oldData, data] : [data])
      )
    }
  })
}
