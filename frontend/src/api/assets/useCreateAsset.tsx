import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AssetCreatedResponse,
  AssetsResponse,
  CreateAssetBody
} from '../../interfaces/assets/assets.interface'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'
import dayjs from 'dayjs'

const handleCreateAsset = async ({
  assetData,
  userEmail
}: {
  assetData: CreateAssetBody
  userEmail: string
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: '/v1/assets',
      body: JSON.stringify(assetData)
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`

  console.log({ url, requestOptions })
  const response = await fetch(url, requestOptions)
  console.log({ response })
  const data = (await response.json()) || {}
  console.log({ data })
  return data as AssetCreatedResponse
}

export const useCreateAsset = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { user, userInfo } = useAuthUser()

  const mutation = useMutation({
    mutationFn: ({ assetData }: { assetData: CreateAssetBody }) =>
      handleCreateAsset({ assetData, userEmail: userInfo?.email ?? '' }),
    mutationKey: ['createAsset'],
    onMutate: async ({ assetData }) => {
      await queryClient.cancelQueries({ queryKey: ['assets', user?.userId] })
      const previousAssets = queryClient.getQueryData<AssetsResponse[]>([
        'assets',
        user?.userId
      ])

      // Generamos una "fake" asset para mostrar inmediatamente
      const now = dayjs().toDate()
      const optimisticAsset = {
        asset_id: 'temp-id-' + Date.now(),
        created_at: now,
        updated_at: now,
        ...assetData
      }

      queryClient.setQueryData<AssetsResponse[]>(
        ['assets', user?.userId],
        (oldData) => [...(oldData ?? []), optimisticAsset]
      )

      return { previousAssets, optimisticAsset }
    },
    onError: (error, _, context) => {
      console.log({ error })
      if (context?.previousAssets) {
        queryClient.setQueryData(
          ['assets', user?.userId],
          context?.previousAssets
        )
      }
      toast.error(t('asset_creation_error'))
    },

    onSuccess: (data, _, context) => {
      queryClient.setQueryData<AssetsResponse[]>(
        ['assets', user?.userId],
        (old) => {
          return old
            ?.filter((p) => p.asset_id !== context?.optimisticAsset.asset_id)
            .concat(data.data)
        }
      )
      toast.success(
        t('asset_created_successfully', 'Asset created successfully')
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', user?.userId] })
    }
  })
  return mutation
}
