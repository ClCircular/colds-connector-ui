import { useForm, SubmitHandler } from 'react-hook-form'
import { useCreateOffer } from '../../api/offers/useCreateOffer'
import { useAssignOfferToCatalog } from '../../api/offers/useAssignOfferToCatalog'
interface OfferBody {
  title: string
  description: string
  keywords: string[]
  publisher: string
  sovereign: string
  paymentModality: string
}
export const useCreateOfferForm = ({ catalogId }: { catalogId: string }) => {
  const createOfferMutation = useCreateOffer(() => {
    console.log('Offer created successfully')
  })

  const assignOfferMutation = useAssignOfferToCatalog(() => {
    console.log('Offer assigned to catalog successfully')
  })

  const createOfferForm = useForm<OfferBody>({
    defaultValues: {
      title: '',
      description: '',
      keywords: [],
      publisher: '',
      sovereign: '',
      paymentModality: ''
    }
  })

  const onSubmit: SubmitHandler<OfferBody> = async (data, event) => {
    event?.stopPropagation()
    console.log({ data }, { event })
    // Call the API to create the offer here
    const createOfferResponse = await createOfferMutation.mutateAsync({
      ...data,
      license: 'https://creativecommons.org/licenses/by/4.0/'
    })
    console.log(createOfferResponse)
    const assignOfferResponse = await assignOfferMutation.mutateAsync({
      catalogId,
      offers: [createOfferResponse._links.self.href]
    })
    console.log(assignOfferResponse)
  }
  return { onSubmit, createOfferForm }
}
