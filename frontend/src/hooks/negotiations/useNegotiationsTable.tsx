import { createColumnHelper } from '@tanstack/react-table'
import { useGetNegotiations } from '../../api/negotiations/useGetNegotiations'
import { NegotiationRow } from '../../interfaces/negotiations/negotiations.interface'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { useGetContracts } from '../../api/contracts/useGetContracts'
import { useAgreeNegotiation } from '../../api/negotiations/useAgreeNegotiation'
import { useTransfersRequest } from '../../api/transfers/useTransfersRequest'
import dayjs from 'dayjs'
import { filterFnDate } from '../../utils/FilterFnDate'

export const useNegotiationsTable = () => {
  const negotiationsData = useGetNegotiations()
  const contractsData = useGetContracts()

  const columnHelper = createColumnHelper<NegotiationRow>()

  const agreeMutation = useAgreeNegotiation()
  const transfersRequestMutation = useTransfersRequest()

  const { t } = useTranslation()

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor('contractName', {
        header: t('contract'),
        cell: (info) => info.getValue()
      }),
      // columnHelper.accessor('provider', {
      //   header: t('provider'),
      //   cell: (info) => info.getValue()
      // }),
      columnHelper.accessor('signingDate', {
        header: t('signing_date'),
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
      }),
      columnHelper.accessor('createdAt', {
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
      }),
      columnHelper.accessor('updatedAt', {
        header: t('updated_at'),
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
      }),
      //state
      columnHelper.accessor('cn_state', {
        header: t('state'),
        cell: (info) => info.getValue()
      })
    ]

    // Columna de acciones: muestra los botones según el role
    const actionsColumn = columnHelper.display({
      id: 'actions',
      header: t('actions'),
      cell: (info) => {
        const row = info.row.original
        const role = row.role
        const agreementId = row.agreement_id
        const cnId = row.cn_id
        return (
          <div className='flex gap-2'>
            {/* Botón Transferir solo para CONSUMER y si hay agreementId */}
            {role === 'CONSUMER' && agreementId && (
              <button
                className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
                onClick={() => transfersRequestMutation.mutate({ agreementId })}
              >
                {t('transfer_action')}
              </button>
            )}
            {/* Botón Agree solo para PROVIDER y si no hay agreementId */}
            {role === 'PROVIDER' && !agreementId && (
              <button
                className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
                onClick={() => agreeMutation.mutate({ cn_id: cnId })}
              >
                {t('agree_action')}
              </button>
            )}
          </div>
        )
      }
    })

    // Agregar columna de acciones al final
    return [...baseColumns, actionsColumn]
  }, [t])

  const rows = useMemo(() => {
    if (!negotiationsData.data || !contractsData.data) return []

    return negotiationsData.data.map((negotiation) => {
      const contract = contractsData.data?.find(
        (c) => c.contract_id === negotiation.contract_id
      )
      return {
        ...negotiation,
        contractName: contract?.name,
        // provider: negotiation.provider_pid,
        // signingDate: negotiation.signed_at,
        signingDate:
          !negotiation.signed_at || !dayjs(negotiation.signed_at).isValid()
            ? dayjs('0001-01-01T00:00:00.000Z').toDate()
            : dayjs(negotiation.signed_at).toDate(),
        createdAt:
          !negotiation.created_at || !dayjs(negotiation.created_at).isValid()
            ? dayjs('0001-01-01T00:00:00.000Z').toDate()
            : dayjs(negotiation.created_at).toDate(),
        updatedAt:
          !negotiation.updated_at || !dayjs(negotiation.updated_at).isValid()
            ? dayjs('0001-01-01T00:00:00.000Z').toDate()
            : dayjs(negotiation.updated_at).toDate(),
        transfer: negotiation.agreement_id,
        cn_state: negotiation.cn_state,
        role: negotiation.connector_role,
        agree: negotiation.cn_id,
        agreement_id: negotiation.agreement_id
      }
    })
  }, [negotiationsData.data, contractsData.data])

  return { columns, rows }
}
