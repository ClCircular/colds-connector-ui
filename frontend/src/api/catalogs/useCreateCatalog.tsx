import { useMutation } from '@tanstack/react-query'

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

export const useCreateCatalog = () => {
  const mutation = useMutation({
    mutationFn: createCatalog,
    mutationKey: ['createCatalog'],
    onSuccess: (data) => {
      console.log('Catalog created successfully', data)
    },
    onError: (error) => {
      console.error('Error creating catalog', error)
    }
  })
  return mutation
}
