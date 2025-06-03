import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AssetsResponse,
  CreateAssetBody
} from '../../interfaces/assets/assets.interface'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'

const handleUpdateAsset = async ({
  newAssetData,
  assetId
}: {
  assetId: string
  newAssetData: CreateAssetBody
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'PUT',
      url: `/v1/assets/${assetId}`,
      body: newAssetData
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:8083`
  await fetch(url, requestOptions)
  return { assetId, newAssetData }
}

export const useUpdateAsset = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { user } = useAuthUser()

  const mutation = useMutation({
    mutationFn: handleUpdateAsset,
    mutationKey: ['updateAsset'],
    onMutate: async ({ assetId, newAssetData }) => {
      await queryClient.cancelQueries({ queryKey: ['assets', user?.userId] })
      const previousAssets = queryClient.getQueryData<CreateAssetBody[]>([
        'assets',
        user?.userId
      ])
      queryClient.setQueryData<AssetsResponse[]>(
        ['assets', user?.userId],
        (old) =>
          (old ?? []).map((p) =>
            p.asset_id === assetId ? { ...p, ...newAssetData } : p
          )
      )
      return { previousAssets }
    },
    onError: (err, _, context) => {
      console.error('Error updating asset:', err)
      if (context?.previousAssets) {
        queryClient.setQueryData(
          ['assets', user?.userId],
          context.previousAssets
        )
      }
      toast.error(t('asset_update_error', 'Asset update failed'))
    },
    onSuccess: () => {
      toast.success(
        t('asset_updated_successfully', 'Asset updated successfully')
      )
    }
  })
  return mutation
}
