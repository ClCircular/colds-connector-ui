import { useTranslation } from 'react-i18next'
import { useGetTransfers } from '../../api/transfers/useGetTransfers'
import { TransfersTableRow } from '../../interfaces/transfers/transfers.interface'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

export const useTransfersTable = () => {
  const { t } = useTranslation()

  const transfersData = useGetTransfers()

  const columnHelper = createColumnHelper<TransfersTableRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('transfer_id', {
        header: t('transfer_id'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('agreement_id', {
        header: t('agreement_id'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('created_at', {
        header: t('created_at'),
        cell: (info) => info.getValue()
      })
    ],
    [t]
  )

  const rows = useMemo(() => {
    return (
      transfersData.data?.map((transfer) => ({
        transfer_id: transfer.transfer_id,
        agreement_id: transfer.agreement_id,
        status: transfer.transfer_state,
        created_at: new Date(transfer.created_at).toLocaleString()
      })) || []
    )
  }, [transfersData.data])

  return { columns, rows }
}
