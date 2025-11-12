import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Transfer } from '../../interfaces/transfers/transfers.interface'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'

const handleTransferRequest = async ({
  agreementId,
  userEmail
}: {
  agreementId: string
  userEmail: string
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
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `https://0bfzsz9z0c.execute-api.us-east-1.amazonaws.com`
  const response = await fetch(url, requestOptions)
  const dataFormatted = await response.json()
  return dataFormatted as Transfer
}

export const useTransfersRequest = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { user, userInfo } = useAuthUser()

  const mutation = useMutation({
    mutationFn: ({ agreementId }: { agreementId: string }) =>
      handleTransferRequest({ agreementId, userEmail: userInfo?.email || '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transfers', user?.userId]
      })
      toast.success(t('transfers_request_success'))
    },
    onError: () => {
      toast.error(t('transfers_request_error'))
    }
  })

  return mutation
}
