import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'
import { AssetsResponse } from '../../interfaces/assets/assets.interface'

const handleDeleteAsset = async ({
  assetId,
  userEmail
}: {
  assetId: string
  userEmail: string
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'DELETE',
      url: `/v1/assets/${assetId}`
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `https://0bfzsz9z0c.execute-api.us-east-1.amazonaws.com`
  await fetch(url, requestOptions)
  return { assetId }
}

export const useDeleteAsset = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { user, userInfo } = useAuthUser()

  const mutation = useMutation({
    mutationFn: ({ assetId }: { assetId: string }) =>
      handleDeleteAsset({ assetId, userEmail: userInfo?.email || '' }),
    mutationKey: ['deleteAsset'],
    onMutate: async ({ assetId }) => {
      await queryClient.cancelQueries({ queryKey: ['assets', user?.userId] })
      const previousAssets = queryClient.getQueryData<AssetsResponse[]>([
        'assets',
        user?.userId
      ])
      queryClient.setQueryData<AssetsResponse[]>(
        ['assets', user?.userId],
        (old) => (old ?? []).filter((a) => a.asset_id !== assetId)
      )
      return { previousAssets }
    },
    onError: (err, _, context) => {
      console.error('Error deleting asset:', err)
      if (context?.previousAssets) {
        queryClient.setQueryData(
          ['assets', user?.userId],
          context.previousAssets
        )
      }
      toast.error(t('asset_deletion_error', 'Asset deletion failed'))
    },
    onSuccess: () => {
      toast.success(
        t('asset_deleted_successfully', 'Asset deleted successfully')
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', user?.userId] })
    }
  })

  return mutation
}
