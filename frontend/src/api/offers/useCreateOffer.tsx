import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface OfferBody {
  title: string
  description: string
  keywords: string[]
  publisher: string
  sovereign: string
  paymentModality: string
}

export interface OfferResponse {
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
  endpointDocumentation: string
  paymentModality: string
  samples: any[]
  additional: Additional
  _links: Links
}

export interface Links {
  self: Self
  contracts: Brokers
  representations: Brokers
  catalogs: Brokers
  subscriptions: Brokers
  brokers: Brokers
}

export interface Brokers {
  href: string
  templated: boolean
}

export interface Self {
  href: string
}

export interface Additional {}

const createOffer = async (offer: OfferBody) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: '/api/offers',
      body: JSON.stringify(offer)
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
  return data as OfferResponse
}

export const useCreateOffer = (cleanUpOnSuccess: () => void) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createOffer,
    mutationKey: ['createOffer'],
    onMutate: async (newOffer) => {
      await queryClient.cancelQueries({ queryKey: ['offers'] })
      const previousOffers = queryClient.getQueryData(['offers'])

      queryClient.setQueryData(['offers'], (old: any) => {
        return {
          ...old,
          _embedded: {
            offers: [
              ...old._embedded.offers,
              {
                ...newOffer,
                creationDate: new Date().toISOString(),
                modificationDate: new Date().toISOString(),
                sovereign: newOffer.sovereign,
                publisher: newOffer.publisher,
                keywords: newOffer.keywords,
                endpointDocumentation: ''
              }
            ]
          }
        }
      })

      return { previousOffers, newOffer }
    },
    onSuccess: (data) => {
      console.log('Data offer created successfully', data)
      toast.success('Oferta de datos creada con éxito', {
        description: `La oferta de datos: ${data.title} ha sido creada con éxito.`,
        duration: 3000
      })
      cleanUpOnSuccess()
    },
    onError: (err, newOffer, context) => {
      console.log('Error creating data offer', err)
      toast.error('Error al crear la oferta de datos', {
        description: `La oferta de datos ${newOffer.title} no ha podido ser creada.`,
        duration: 3000
      })
      queryClient.setQueryData(['offers'], context?.previousOffers)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['offers'] })
  })
  return mutation
}
