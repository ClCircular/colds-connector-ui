import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'

const handleAgreeNegotiation = async ({ cn_id }: { cn_id: string }) => {
  console.log({ cn_id })
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: `/v1/negotiations/agree/${cn_id}`
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`
  const response = await fetch(url, requestOptions)
  const dataFormatted = await response.json()
  return dataFormatted as { message: string }
}

export const useAgreeNegotiation = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { user } = useAuthUser()

  const mutation = useMutation({
    mutationFn: handleAgreeNegotiation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['negotiations', user?.userId]
      })
      toast.success(t('negotiations.agree.success'))
    },
    onError: () => {
      toast.error(t('negotiations.agree.error'))
    }
  })
  return mutation
}
