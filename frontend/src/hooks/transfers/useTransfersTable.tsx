import { useTranslation } from 'react-i18next'
import { useGetTransfers } from '../../api/transfers/useGetTransfers'
import { TransfersTableRow } from '../../interfaces/transfers/transfers.interface'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { filterFnDate } from '../../utils/FilterFnDate'
import dayjs from 'dayjs'
import { useGetNegotiations } from '../../api/negotiations/useGetNegotiations'
import { useLocation } from 'wouter'
import { useTransferStart } from '../../api/transfers/useTransferStart'
import { useTransfersRequestData } from '../../api/transfers/useTransfersRequestData'

export const useTransfersTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [jsonData, setJsonData] = useState('')
  const { t } = useTranslation()
  const [_, setLocation] = useLocation()

  const transfersData = useGetTransfers()
  const negotiationsData = useGetNegotiations()

  const transferStartMutation = useTransferStart()
  const transferRequestDataMutation = useTransfersRequestData()

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
          if (
            row.role === 'PROVIDER' &&
            row.transfer_format.toUpperCase().includes('PULL') &&
            row.transfer_state !== 'COMPLETED' &&
            row.transfer_state !== 'STARTED'
          ) {
            return (
              <button
                className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize disabled:bg-gray-200 disabled:cursor-not-allowed'
                onClick={() => {
                  transferStartMutation.mutate({
                    transferId: row.transfer_id
                  }) // Handle agree action
                }}
                disabled={transferStartMutation.isPending}
              >
                {t('agree_action')}
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
                className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#0096b9] rounded-lg hover:bg-[#448290] cursor-pointer capitalize disabled:bg-gray-200 disabled:cursor-not-allowed'
                disabled={transferRequestDataMutation.isPending}
                onClick={() => {
                  transferRequestDataMutation
                    .mutateAsync({
                      transferId: row.transfer_id
                    })
                    .then((data) => {
                      setIsModalOpen(true)
                      setJsonData(JSON.stringify(data, null, 2))
                    })
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

  return { columns, rows, isModalOpen, setIsModalOpen, jsonData, setJsonData }
}
