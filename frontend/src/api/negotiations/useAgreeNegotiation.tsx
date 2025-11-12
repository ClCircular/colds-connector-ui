import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'

const handleAgreeNegotiation = async ({
  cn_id,
  userEmail
}: {
  cn_id: string
  userEmail: string
}) => {
  console.log({ cn_id })
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: `/v1/negotiations/agree/${cn_id}`
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `https://0bfzsz9z0c.execute-api.us-east-1.amazonaws.com`
  const response = await fetch(url, requestOptions)
  const dataFormatted = await response.json()
  return dataFormatted as { message: string }
}

export const useAgreeNegotiation = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { user, userInfo } = useAuthUser()

  const mutation = useMutation({
    mutationFn: ({ cn_id }: { cn_id: string }) =>
      handleAgreeNegotiation({ cn_id, userEmail: userInfo?.email || '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['negotiations', user?.userId]
      })
      toast.success(t('negotiations_agree_success'))
    },
    onError: () => {
      toast.error(t('negotiations_agree_error'))
    }
  })
  return mutation
}
