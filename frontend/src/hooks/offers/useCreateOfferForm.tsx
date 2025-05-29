import { useForm, SubmitHandler } from 'react-hook-form'
import { useCreateOffer } from '../../api/offers/useCreateOffer'
interface OfferBody {
  title: string
  description: string
  keywords: string[]
  publisher: string
  sovereign: string
  paymentModality: string
}
export const useCreateOfferForm = () => {
  const createOfferMutation = useCreateOffer(() => {
    console.log('Offer created successfully')
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
  }
  return { onSubmit, createOfferForm }
}
