import { ColumnFiltersState, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
// import { IoAddCircleOutline } from 'react-icons/io5'
import { useGetOffers } from '../../api/offers/useGetOffers'
import { useTranslation } from 'react-i18next'
import { useGetCatalogs } from '../../api/catalogs/useGetCatalogs'
import { IoAddCircleOutline } from 'react-icons/io5'
import { FiExternalLink } from 'react-icons/fi'

interface DataOfferRow {
  creationDate: string
  modificationDate: string
  title: string
  description: string
  additional: any
  keywords: string[]
  publisher: string
  language: string
  license: string
  version: string
  sovereign: any
  catalogs: string[]
  contracts: string[]
  endpointDocumentation: any
  paymentModality: string
  samples: any[]
}

export const useDataOffersTable = () => {
  const dataOffersData = useGetOffers()
  const catalogsData = useGetCatalogs()

  const { t } = useTranslation()

  // get the catalogId sended from state
  // const catalogId = history?.state?.catalogId
  const catalogId = useMemo(
    () => history?.state?.catalogId as string | undefined,
    [history?.state?.catalogId]
  )

  const columnHelper = createColumnHelper<DataOfferRow>()

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
      //keywords
      columnHelper.accessor('keywords', {
        header: t('keywords'),
        cell: (info) => info.getValue().join(', ')
      }),
      //publisher
      columnHelper.accessor('publisher', {
        header: t('publisher'),
        cell: (info) => info.getValue()
      }),
      //language
      columnHelper.accessor('language', {
        header: t('language'),
        cell: (info) => info.getValue()
      }),
      //sovereign
      columnHelper.accessor('sovereign', {
        header: t('sovereign'),
        cell: (info) => info.getValue()
      }),
      //paymentModality
      columnHelper.accessor('paymentModality', {
        header: t('payment_modality'),
        cell: (info) => info.getValue()
      }),
      // catalog
      columnHelper.accessor('catalogs', {
        header: t('catalogs'),
        cell: (info) => {
          const catalogs = info.getValue()
          return catalogs.length > 0 ? catalogs.join(' | ') : '-'
        },
        filterFn: (row, columnId, value) => {
          const catalogs = row.getValue(columnId) as string[]
          return catalogs.some((catalog: string) => catalog === value)
        }
      }),
      // contracts
      columnHelper.accessor('contracts', {
        header: t('contracts'),
        cell: (info) => {
          const contracts = info.getValue()
          return contracts.length > 0 ? contracts.join(' | ') : '-'
        },
        filterFn: (row, columnId, value) => {
          const contracts = row.getValue(columnId) as string[]
          return contracts.some((contract: string) => contract === value)
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: t('actions'),
        cell: () => (
          <div className='flex items-center gap-4 px-10'>
            <button className='cursor-pointer'>
              <IoAddCircleOutline className='text-[#0096b9] size-6' />
            </button>
            <button className='cursor-pointer'>
              <FiExternalLink className='text-[#94bf43] size-6' />
            </button>
            {/* <button className='inline-flex items-center gap-2 transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none cursor-pointer w-fit justify-center'>
              {t('add_contract')}
              <IoAddCircleOutline className='font-white size-5' />
            </button>
            <button className='inline-flex items-center gap-2 transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none cursor-pointer w-fit justify-center'>
              {t('see_contracts')}
              <IoAddCircleOutline className='font-white size-5' />
            </button> */}
          </div>
        )
      })
    ],
    [columnHelper, t]
  )

  const rows = useMemo(() => {
    if (dataOffersData.isLoading) return []
    if (dataOffersData.isError) return []

    return (
      dataOffersData.data?.map(
        ({
          title,
          description,
          keywords,
          publisher,
          paymentModality,
          sovereign,
          language,
          contracts,
          catalogs
        }) => ({
          title,
          description,
          keywords,
          publisher,
          paymentModality,
          sovereign,
          catalogs: catalogs.map((catalog) => catalog.title),
          contracts: contracts.map((contract) => contract.title),
          language: language || '-'
        })
      ) ?? []
    )
  }, [dataOffersData.data, dataOffersData.isError, dataOffersData.isLoading])

  const initialFilters: ColumnFiltersState = useMemo(() => {
    const filters: ColumnFiltersState = []
    if (catalogId) {
      filters.push({
        id: 'catalogs',
        value:
          catalogsData.data?.find((catalog) => catalog.catalogId === catalogId)
            ?.title || ''
      })
    }
    return filters
  }, [catalogId, catalogsData.data])

  return { columns, rows, initialFilters }
}
