import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Transfer } from '../../interfaces/transfers/transfers.interface'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'

const handleTransferRequest = async ({
  agreementId
}: {
  agreementId: string
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: `/v1/transfers/request`,
      body: {
        agreementId
      }
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`
  const response = await fetch(url, requestOptions)
  const dataFormatted = await response.json()
  return dataFormatted as Transfer
}

export const useTransfersRequest = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { user } = useAuthUser()

  const mutation = useMutation({
    mutationFn: handleTransferRequest,
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
