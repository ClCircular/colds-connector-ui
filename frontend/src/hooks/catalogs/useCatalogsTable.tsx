import { createColumnHelper } from '@tanstack/react-table'
import { useGetCatalogs } from '../../api/catalogs/useGetCatalogs'
import { useMemo } from 'react'
import { IoAddCircleOutline } from 'react-icons/io5'

interface CatalogRow {
  title: string
  description: string
  numberOfResources: number
}

export const useCatalogsTable = () => {
  const catalogsData = useGetCatalogs()

  const columnHelper = createColumnHelper<CatalogRow>()

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
      columnHelper.accessor('numberOfResources', {
        header: 'Número de recursos',
        cell: (info) => info.getValue(),
        meta: {
          isNumeric: true,
          filterVariant: 'range'
        }
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Acciones',
        cell: () => (
          <button className='inline-flex items-center gap-2 transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none cursor-pointer w-fit justify-center'>
            Añadir recurso
            <IoAddCircleOutline className='font-white size-5' />
          </button>
        )
      })
    ],
    [columnHelper]
  )

  const rows = useMemo(() => {
    if (catalogsData.isLoading) return []
    if (catalogsData.isError) return []

    return (
      catalogsData.data?._embedded?.catalogs.map((catalog) => ({
        title: catalog.title,
        description: catalog.description,
        numberOfResources: catalog.numberOfResources ?? 0
      })) ?? []
    )
  }, [catalogsData.data, catalogsData.isError, catalogsData.isLoading])

  return { columns, rows }
}
