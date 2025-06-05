import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
// import { filterFnDate } from '../../utils/FilterFnDate'
// import dayjs from 'dayjs'
import { IoTrash } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { useGetAssets } from '../../api/assets/useGetAssets'
import { AssetRow } from '../../interfaces/assets/assets.interface'
import { useDeleteAsset } from '../../api/assets/useDeleteAsset'

export const useAssetsTable = (setOpen: Dispatch<SetStateAction<boolean>>) => {
  const [assetId, setAssetId] = useState('')
  const assetsData = useGetAssets()
  const { t } = useTranslation()

  const { mutate } = useDeleteAsset()

  const handleDeleteAsset = (assetId: string) => {
    const assetName = assetsData.data?.find(
      (asset) => asset.asset_id === assetId
    )?.name
    const response = confirm(
      `Are you sure you want to delete the asset with name: ${assetName}?`
    )
    if (response) {
      mutate({ assetId })
    }
  }

  const columnHelper = createColumnHelper<AssetRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('name'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('description', {
        header: t('description'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('type', {
        header: t('type'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('flow', {
        header: t('flow'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('source', {
        header: t('source'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('version', {
        header: t('version'),
        cell: (info) => info.getValue(),
        filterFn: 'inNumberRange',
        meta: {
          filterVariant: 'number'
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: t('actions'),
        cell: (info) => {
          const id = info.row.original.id
          console.log({ id })
          return (
            <div className='flex space-x-2 items-center justify-center'>
              {/* Add action buttons here, e.g., Edit, Delete */}
              <button
                className='text-blue-500 hover:bg-slate-100 transition-colors rounded-full p-3 cursor-pointer'
                onClick={() => {
                  setOpen(true)
                  setAssetId(id)
                }}
              >
                <MdEdit className='size-6' />
              </button>
              <button
                className='text-red-500 hover:bg-slate-100 transition-colors rounded-full p-3 cursor-pointer'
                onClick={() => handleDeleteAsset(id)}
              >
                <IoTrash className='size-6' />
              </button>
            </div>
          )
        }
      })
    ],
    [t, columnHelper]
  )

  const rows = useMemo(() => {
    console.log({ assetsData: assetsData.data })
    if (!assetsData.data) return []
    return (
      assetsData.data?.map((asset) => ({
        name: asset.name,
        description: asset.description,
        type: asset.data_source.type,
        flow: asset.data_source.flow,
        source: asset.data_source.source,
        version: asset.properties.version,
        id: asset.asset_id
      })) || []
    )
  }, [assetsData.data])

  return { columns, rows, assetId, setAssetId }
}
