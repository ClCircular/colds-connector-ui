import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const handleRequestCredentials = async () => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: '/credentials/request',
      useIdentityHub: true
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `https://0bfzsz9z0c.execute-api.us-east-1.amazonaws.com/v1/`
  const response = await fetch(url, requestOptions)
  console.log({ response })
  response.status
  return response.status === 200
}

export const useRequestCredentials = () => {
  const { user } = useAuthUser()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: handleRequestCredentials,
    mutationKey: ['requestCredentials'],
    // Actualización optimista
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['credentials', user?.userId]
      })
      const previousData = queryClient.getQueryData([
        'credentials',
        user?.userId
      ])
      // Opcional: puedes poner un estado provisional
      queryClient.setQueryData(
        ['credentials', user?.userId],
        (old: Credential[]) => old
      )
      return { previousData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials', user?.userId] })
      toast.success(t('credentials_requested_successfully'))
    },
    onError: (err, _variables, context) => {
      console.log({ err })
      if (context?.previousData) {
        queryClient.setQueryData(
          ['credentials', user?.userId],
          context.previousData
        )
      }
    }
  })
}
