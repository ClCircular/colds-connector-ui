import { useTranslation } from 'react-i18next'
import { useGetTransfers } from '../../api/transfers/useGetTransfers'
import { TransfersTableRow } from '../../interfaces/transfers/transfers.interface'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { filterFnDate } from '../../utils/FilterFnDate'
import dayjs from 'dayjs'
import { useGetNegotiations } from '../../api/negotiations/useGetNegotiations'
import { useLocation } from 'wouter'
import { useTransferStart } from '../../api/transfers/useTransferStart'

export const useTransfersTable = () => {
  const { t } = useTranslation()
  const [_, setLocation] = useLocation()

  const transfersData = useGetTransfers()
  const negotiationsData = useGetNegotiations()

  const transferStartMutation = useTransferStart()

  const columnHelper = createColumnHelper<TransfersTableRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('negotiation', {
        header: t('negotiation'),
        cell: (props) => {
          const negotiationAgreementId = props.getValue()
          return (
            <button
              className='text-blue-600 underline hover:text-blue-800 transition-colors'
              onClick={() =>
                setLocation(
                  `/negotiations?agreementId=${negotiationAgreementId}`
                )
              }
            >
              {negotiationAgreementId}
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
        header: t('status'),
        cell: (props) => props.getValue()
      }),
      columnHelper.accessor('transfer_format', {
        header: t('format'),
        cell: (props) => props.getValue()
      }),
      columnHelper.accessor('role', {
        header: t('role'),
        cell: (props) => props.getValue()
      }),
      //actions with buttons agree and download_data SOLO si role es PROVIDER y format es PULL
      columnHelper.display({
        id: 'actions',
        header: t('actions'),
        cell: (props) => {
          const row = props.row.original
          console.log({ role: row.role, transfer_format: row.transfer_format })
          if (
            row.role === 'PROVIDER' &&
            row.transfer_format.toUpperCase().includes('PULL')
          ) {
            return (
              <button
                className='px-2 py-1 bg-[#94bf43] text-white rounded hover:bg-green-600'
                onClick={() => {
                  transferStartMutation.mutate({
                    transferId: row.transfer_id
                  }) // Handle agree action
                }}
              >
                {t('agree')}
              </button>
            )
          } else if (
            row.role === 'CONSUMER' &&
            row.transfer_format.toUpperCase().includes('PULL') &&
            row.transfer_state === 'STARTED'
          ) {
            // If role is CONSUMER and format is PULL, show download data button
            return (
              <button
                className='px-2 py-1 bg-[#007bff] text-white rounded hover:bg-blue-600'
                onClick={() => {
                  // Handle download data action
                }}
              >
                {t('download_data')}
              </button>
            )
          } else {
            return null
          }
        }
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
        negotiation: transfer.agreement_id,
        agreement_id: transfer.agreement_id,
        transfer_id: transfer.transfer_id,
        createdAt:
          !transfer.created_at || !dayjs(transfer.created_at).isValid()
            ? dayjs('0001-01-01T00:00:00.000Z').toDate()
            : dayjs(transfer.created_at).toDate(),
        transfer_state: transfer.transfer_state,
        transfer_format: transfer.transfer_format,
        role: negotiation?.connector_role || 'consumer' // Default to 'consumer' if role is not defined
      }
    })
  }, [transfersData.data, negotiationsData.data])

  return { columns, rows }
}
