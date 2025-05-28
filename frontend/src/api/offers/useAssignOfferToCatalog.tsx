import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface OfferBody {
  catalogId: string
  offers: string[]
}

const assignOfferToCatalog = async (offer: OfferBody) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: `/v1/catalogs/${offer.catalogId}/offers`,
      body: JSON.stringify(offer.offers)
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
  return data as any
}

export const useAssignOfferToCatalog = (cleanUpOnSuccess: () => void) => {
  //   const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: assignOfferToCatalog,
    mutationKey: ['assignOfferToCatalog'],
    // onMutate: async (newOffer) => {
    //   await queryClient.cancelQueries({ queryKey: ['offers'] })
    //   const previousOffers = queryClient.getQueryData(['offers'])

    //   queryClient.setQueryData(['offers'], (old: any) => {
    //     return {
    //       ...old,

    //     }
    //   })

    //   return { previousOffers, newOffer }
    // },
    onSuccess: (data) => {
      console.log('Data offer assigned successfully', data)
      toast.success('Oferta de datos asignada con éxito', {
        description: `La oferta de datos: ${data.title} ha sido asignada con éxito.`,
        duration: 3000
      })
      cleanUpOnSuccess()
    },
    onError: (err) => {
      console.log('Error assigning data offer', err)
      toast.error('Error al asignar la oferta de datos', {
        description: `La oferta de datos no ha podido ser asignada.`,
        duration: 3000
      })
      //   queryClient.setQueryData(['offers'], context?.previousOffers)
    }
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['offers'] })
  })
  return mutation
}
