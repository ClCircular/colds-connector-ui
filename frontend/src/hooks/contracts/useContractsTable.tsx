import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
// import { IoAddCircleOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { useGetContracts } from '../../api/contracts/useGetContracts'
import dayjs from 'dayjs'
import { filterFnDate } from '../../utils/FilterFnDate'

interface ContractRow {
  title: string
  description: string
  start: Date
  end: Date
  rules: string[]
  offers: string[]
}

export const useContractsTable = () => {
  const contractsData = useGetContracts()

  const { t } = useTranslation()

  const columnHelper = createColumnHelper<ContractRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: t('title'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('description', {
        header: t('description'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('start', {
        header: t('start_date'),
        cell: (info) => {
          const dateValue = info.getValue()
          if (dayjs(dateValue).year() < 2000) return '—'
          return dayjs(dateValue).format('YYYY/MM/DD')
        },
        filterFn: filterFnDate
      }),
      columnHelper.accessor('end', {
        header: t('end_date'),
        cell: (info) => {
          const dateValue = info.getValue()
          if (dayjs(dateValue).year() < 2000) return '—'
          return dayjs(dateValue).format('YYYY/MM/DD')
        },
        filterFn: filterFnDate
      }),
      columnHelper.accessor('rules', {
        header: t('rules'),
        cell: (info) => {
          const rules = info.getValue()
          return rules.length > 0 ? (
            rules.join(' | ')
          ) : (
            <span className='text-gray-500'>{t('no_rules')}</span>
          )
        }
      }),
      columnHelper.accessor('offers', {
        header: t('offers'),
        cell: (info) => {
          const offers = info.getValue()
          return offers.length > 0 ? (
            offers.join(' | ')
          ) : (
            <span className='text-gray-500'>{t('no_offers')}</span>
          )
        }
      })
    ],
    [columnHelper, t]
  )

  const rows = useMemo(() => {
    if (contractsData.isLoading) return []
    if (contractsData.isError) return []

    return (
      contractsData.data?.map(
        ({ title, description, end, offers, rules, start }) => ({
          title,
          description,
          end:
            !end || !dayjs(end).isValid()
              ? dayjs('0001-01-01T00:00:00.000Z').toDate()
              : dayjs(end).toDate(),
          start:
            !start || !dayjs(start).isValid()
              ? dayjs('0001-01-01T00:00:00.000Z').toDate()
              : dayjs(start).toDate(),
          rules: rules.map((rule) => rule.title),
          offers: offers.map((offer) => offer.title)
        })
      ) ?? []
    )
  }, [contractsData.data, contractsData.isError, contractsData.isLoading])

  return { columns, rows }
}
