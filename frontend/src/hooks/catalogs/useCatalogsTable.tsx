import { createColumnHelper } from '@tanstack/react-table'
import { useGetCatalogs } from '../../api/catalogs/useGetCatalogs'
import { useMemo } from 'react'

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
        header: 'Title',
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('numberOfResources', {
        header: 'Number of Resources',
        cell: (info) => info.getValue()
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
