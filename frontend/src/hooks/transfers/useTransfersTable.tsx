import { useTranslation } from 'react-i18next'
import { useGetTransfers } from '../../api/transfers/useGetTransfers'
import { TransfersTableRow } from '../../interfaces/transfers/transfers.interface'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { filterFnDate } from '../../utils/FilterFnDate'
import dayjs from 'dayjs'
import { useGetNegotiations } from '../../api/negotiations/useGetNegotiations'
import { useLocation } from 'wouter'

export const useTransfersTable = () => {
  const { t } = useTranslation()
  const [_, setLocation] = useLocation()

  const transfersData = useGetTransfers()
  const negotiationsData = useGetNegotiations()

  const columnHelper = createColumnHelper<TransfersTableRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('negotiation', {
        header: t('negotiation'),
        cell: (props) => {
          const negotiationName = props.getValue()
          const agreementId = props.row.original.agreement_id
          return (
            <button
              className='text-blue-600 underline hover:text-blue-800 transition-colors'
              onClick={() => setLocation(`/negotiations/${agreementId}`)}
            >
              {negotiationName}
            </button>
          )
        }
      }),
      columnHelper.accessor('createdAt', {
        header: t('created_at'),
        cell: (props) => {
          const dateValue = props.getValue()
          if (dayjs(dateValue).year() < 2000) return '—'
          return dayjs(dateValue).format('YYYY/MM/DD HH:mm:ss')
        },
        meta: {
          filterVariant: 'date'
        },
        filterFn: filterFnDate
      }),
      columnHelper.accessor('transfer_state', {
        header: t('transfer_state'),
        cell: (props) => props.getValue()
      }),
      columnHelper.accessor('transfer_format', {
        header: t('transfer_format'),
        cell: (props) => props.getValue()
      })
    ],
    [t, setLocation, columnHelper]
  )

  const rows = useMemo(() => {
    if (!transfersData.data || !negotiationsData.data) return []
    return transfersData.data.map((transfer) => {
      const negotiation = negotiationsData.data.find(
        (n) => n.agreement_id === transfer.agreement_id
      )
      return {
        negotiation: negotiation?.contract_id || transfer.agreement_id,
        agreement_id: transfer.agreement_id,
        createdAt:
          !transfer.created_at || !dayjs(transfer.created_at).isValid()
            ? dayjs('0001-01-01T00:00:00.000Z').toDate()
            : dayjs(transfer.created_at).toDate(),
        transfer_state: transfer.transfer_state,
        transfer_format: transfer.transfer_format
      }
    })
  }, [transfersData.data, negotiationsData.data])

  return { columns, rows }
}
