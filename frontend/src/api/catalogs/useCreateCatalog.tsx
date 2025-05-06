import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface CatalogBody {
  title: string
  description: string
}

export interface CatalogResponse {
  creationDate: string
  modificationDate: string
  title: string
  description: string
  additional: Additional
  _links: Links
}

export interface Links {
  self: Self
  offers: Offers
}

export interface Offers {
  href: string
  templated: boolean
}

export interface Self {
  href: string
}

export interface Additional {}

const createCatalog = async (catalog: CatalogBody) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: '/api/catalogs',
      body: JSON.stringify(catalog)
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
  return data as CatalogResponse
}

export const useCreateCatalog = (cleanUpOnSuccess: () => void) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createCatalog,
    mutationKey: ['createCatalog'],
    onMutate: async (newCatalog) => {
      await queryClient.cancelQueries({ queryKey: ['catalogs'] })
      const previousCatalogs = queryClient.getQueryData(['catalogs'])

      queryClient.setQueryData(['catalogs'], (old: any) => {
        return {
          ...old,
          _embedded: {
            catalogs: [
              ...old._embedded.catalogs,
              {
                ...newCatalog,
                creationDate: new Date().toISOString(),
                modificationDate: new Date().toISOString(),
                numberOfResources: 0,
                additional: {},
                _links: {
                  self: { href: '' },
                  offers: { href: '' }
                }
              }
            ]
          }
        }
      })

      return { previousCatalogs, newCatalog }
    },
    onSuccess: (data) => {
      console.log('Catalog created successfully', data)
      toast.success('Catalogo creado con éxito', {
        description: `El catalogo ${data.title} ha sido creado con éxito.`,
        duration: 3000
      })
      cleanUpOnSuccess()
    },
    onError: (err, newTodo, context) => {
      console.log('Error creating catalog', err)
      toast.error('Error al crear el catalogo', {
        description: `El catalogo ${newTodo.title} no ha podido ser creado.`,
        duration: 3000
      })
      queryClient.setQueryData(['catalogs'], context?.previousCatalogs)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['catalogs'] })
  })
  return mutation
}
