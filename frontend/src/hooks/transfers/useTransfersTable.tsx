import { useTranslation } from 'react-i18next'
import { useGetTransfers } from '../../api/transfers/useGetTransfers'
import { TransfersTableRow } from '../../interfaces/transfers/transfers.interface'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { filterFnDate } from '../../utils/FilterFnDate'
import dayjs from 'dayjs'

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
        cell: (props) => {
          const dateValue = props.getValue()
          // check if the date is equal to '0001-01-01T00:00:00.000Z'
          // if it is, then we return a dash
          if (dayjs(dateValue).year() < 2000) return '—'
          return dayjs(dateValue).format('YYYY/MM/DD HH:mm:ss')
        },
        meta: {
          filterVariant: 'date'
        },
        filterFn: filterFnDate
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
        created_at:
          !transfer.created_at || !dayjs(transfer.created_at).isValid()
            ? dayjs('0001-01-01T00:00:00.000Z').toDate()
            : dayjs(transfer.created_at).toDate()
      })) || []
    )
  }, [transfersData.data])

  return { columns, rows }
}
