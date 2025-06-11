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

  const columns = useMemo(
    () => [
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
      columnHelper.accessor('transfer', {
        header: t('transfer'),
        cell: (info) => {
          // Solo mostrar si agree existe (que es agreement_id)
          const agreementId = info.getValue()
          if (!agreementId) return null
          return (
            <button
              className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
              onClick={() => transfersRequestMutation.mutate({ agreementId })}
            >
              {t('transfer_action')}
            </button>
          )
        }
      }),
      columnHelper.accessor('agree', {
        header: t('agree'),
        cell: (info) => {
          // Solo mostrar si agree NO existe (que es agreement_id)
          const agreementId = info.row.original.agreement_id
          if (agreementId) return null
          return (
            <button
              className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
              onClick={() => agreeMutation.mutate({ cn_id: info.getValue() })}
            >
              {t('agree_action')}
            </button>
          )
        }
      })
    ],
    [t]
  )

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
        signingDate: negotiation.signed_at,
        transfer: negotiation.agreement_id,
        agree: negotiation.cn_id,
        agreement_id: negotiation.agreement_id
      }
    })
  }, [negotiationsData.data, contractsData.data])

  return { columns, rows }
}
