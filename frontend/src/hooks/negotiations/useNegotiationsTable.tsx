import { createColumnHelper } from '@tanstack/react-table'
import { useGetAssets } from '../../api/assets/useGetAssets'
import { useGetNegotiations } from '../../api/negotiations/useGetNegotiations'
import { NegotiationRow } from '../../interfaces/negotiations/negotiations.interface'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

export const useNegotiationsTable = () => {
  const negotiationsData = useGetNegotiations()
  const assetsData = useGetAssets()

  const columnHelper = createColumnHelper<NegotiationRow>()

  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      columnHelper.accessor('assetName', {
        header: t('asset'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('provider', {
        header: t('provider'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('signingDate', {
        header: t('signing_date'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('transfer', {
        header: t('transfer'),
        cell: (info) => (
          <button
            className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
            onClick={() => console.log('Transfer clicked', info.getValue())}
          >
            Transfer
          </button>
        )
      })
    ],
    [t]
  )

  const rows = useMemo(() => {
    if (!negotiationsData.data || !assetsData.data) return []

    return negotiationsData.data.map((negotiation) => {
      const asset = assetsData.data.find(
        (a) => a.asset_id === negotiation.cn_id
      )
      return {
        ...negotiation,
        assetName: asset?.name,
        provider: negotiation.provider_pid,
        signingDate: negotiation.signed_at,
        transfer: negotiation.cn_id
      }
    })
  }, [negotiationsData.data, assetsData.data])

  return { columns, rows }
}
