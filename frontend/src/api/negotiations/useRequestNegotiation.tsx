import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Negotiation,
  RequestNegotiationBody
} from '../../interfaces/negotiations/negotiations.interface'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'

const handleRequestNegotiation = async ({
  data,
  userEmail
}: {
  data: RequestNegotiationBody
  userEmail: string
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: `/v1/negotiations/request`,
      body: data
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `https://0bfzsz9z0c.execute-api.us-east-1.amazonaws.com/v1/`
  const response = await fetch(url, requestOptions)
  const dataFormatted = await response.json()
  return dataFormatted as Negotiation
}

export const useRequestNegotiation = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { user, userInfo } = useAuthUser()

  const mutation = useMutation({
    mutationFn: ({ data }: { data: RequestNegotiationBody }) =>
      handleRequestNegotiation({ data, userEmail: userInfo?.email || '' }),
    mutationKey: ['requestNegotiation'],
    onSuccess: async (data) => {
      // ponemos la respuesta en cache de negotiations
      await queryClient.cancelQueries({
        queryKey: ['negotiations', user?.userId]
      })

      // const previousNegotiations = queryClient.getQueryData<Negotiation[]>([
      //   'negotiations',
      //   user?.userId
      // ])
      queryClient.setQueryData<Negotiation[]>(
        ['negotiations', user?.userId],
        (old) => [...(old ?? []), data]
      )

      toast.success(
        t(
          'negotiation_requested_successfully',
          'Negotiation requested successfully'
        )
      )
    }
  })
  return mutation
}
