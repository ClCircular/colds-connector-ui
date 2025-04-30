import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
// import { IoAddCircleOutline } from 'react-icons/io5'
import { useGetCatalogOffers } from '../../api/catalogs/useGetCatalogOffers'

interface CatalogOfferRow {
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
  endpointDocumentation: any
  paymentModality: string
  samples: any[]
}

export const useCatalogsOffersTable = ({
  catalogId
}: {
  catalogId: string
}) => {
  const catalogOffersData = useGetCatalogOffers(catalogId)

  const columnHelper = createColumnHelper<CatalogOfferRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Titulo',
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('description', {
        header: 'Descripcion',
        cell: (info) => info.getValue()
      }),
      //keywords
      columnHelper.accessor('keywords', {
        header: 'Palabras clave',
        cell: (info) => info.getValue().join(', ')
      }),
      //publisher
      columnHelper.accessor('publisher', {
        header: 'Publicador',
        cell: (info) => info.getValue()
      }),
      //language
      columnHelper.accessor('language', {
        header: 'Idioma',
        cell: (info) => info.getValue()
      }),
      //sovereign
      columnHelper.accessor('sovereign', {
        header: 'Soberano',
        cell: (info) => info.getValue()
      }),
      //paymentModality
      columnHelper.accessor('paymentModality', {
        header: 'Modalidad de pago',
        cell: (info) => info.getValue()
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
    [columnHelper]
  )

  const rows = useMemo(() => {
    if (catalogOffersData.isLoading) return []
    if (catalogOffersData.isError) return []

    return (
      catalogOffersData.data?._embedded?.resources.map((catalogOffer) => ({
        title: catalogOffer.title,
        description: catalogOffer.description,
        additional: catalogOffer.additional,
        keywords: catalogOffer.keywords,
        publisher: catalogOffer.publisher,
        paymentModality: catalogOffer.paymentModality,
        sovereign: catalogOffer.sovereign
      })) ?? []
    )
  }, [
    catalogOffersData.data,
    catalogOffersData.isError,
    catalogOffersData.isLoading
  ])

  return { columns, rows }
}
