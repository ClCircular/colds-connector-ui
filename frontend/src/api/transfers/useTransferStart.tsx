import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuthUser } from '../../contexts/UserContext'

const handleTransferStart = async ({ transferId }: { transferId: string }) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: `/v1/transfers/start/${transferId}`
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`
  const response = await fetch(url, requestOptions)
  const dataFormatted = await response.json()
  console.log({ dataFormatted })
  return dataFormatted as any
}

export const useTransferStart = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { user } = useAuthUser()

  const mutation = useMutation({
    mutationFn: handleTransferStart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transfers', user?.userId]
      })
      toast.success(t('transfers.request.success'))
    },
    onError: () => {
      toast.error(t('transfers.request.error'))
    }
  })
  return mutation
}
