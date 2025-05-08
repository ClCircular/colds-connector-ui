import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
// import { IoAddCircleOutline } from 'react-icons/io5'
import { useGetOffers } from '../../api/offers/useGetOffers'
import { useTranslation } from 'react-i18next'

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

  const { t } = useTranslation()

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
        }
      }),
      // contracts
      columnHelper.accessor('contracts', {
        header: t('contracts'),
        cell: (info) => {
          const contracts = info.getValue()
          return contracts.length > 0 ? contracts.join(' | ') : '-'
        }
      })
      //   columnHelper.display({
      //     id: 'actions',
      //     header: 'Acciones',
      //     cell: () => (
      //       <button className='inline-flex items-center gap-2 transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none cursor-pointer w-fit justify-center'>
      //         Añadir recurso
      //         <IoAddCircleOutline className='font-white size-5' />
      //       </button>
      //     )
      //   })
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

  return { columns, rows }
}
