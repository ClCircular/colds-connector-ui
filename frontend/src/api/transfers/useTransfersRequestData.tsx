import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuthUser } from '../../contexts/UserContext'

const handleTransfersRequestData = async ({
  transferId,
  userEmail
}: {
  transferId: string
  userEmail: string
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: `/v1/transfers/requestData/${transferId}`
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `https://0bfzsz9z0c.execute-api.us-east-1.amazonaws.com`
  const response = await fetch(url, requestOptions)
  const dataFormatted = await response.json()
  console.log({ dataFormatted })
  return dataFormatted
}

export const useTransfersRequestData = () => {
  const { t } = useTranslation()
  const { userInfo } = useAuthUser()
  const mutation = useMutation({
    mutationFn: ({ transferId }: { transferId: string }) =>
      handleTransfersRequestData({
        transferId,
        userEmail: userInfo?.email || ''
      }),
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ['transfers', user?.userId]
      // })
      toast.success(t('transfers_request_data_success'))
    },
    onError: () => {
      toast.error(t('transfers_request_data_error'))
    }
  })

  return mutation
}
