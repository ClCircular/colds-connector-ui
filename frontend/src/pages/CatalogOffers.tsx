import { FC, useMemo, useState } from 'react'
import { IoCreateOutline } from 'react-icons/io5'
import { CreateOfferModal } from '../components/offers/CreateOfferModal'
import { useGetCatalogOffers } from '../api/catalogs/useGetCatalogOffers'
import { Loader } from '../components'
import { useGetCatalogs } from '../api/catalogs/useGetCatalogs'
import { useCatalogsOffersTable } from '../hooks/catalogsOffers/useCatalogsOffersTable'
import { Table } from '../components/shared/Table'

interface CatalogOffersProps {
  catalogId: string
}

export const CatalogOffers: FC<CatalogOffersProps> = ({ catalogId }) => {
  const [open, setOpen] = useState(false)

  const onClose = () => {
    setOpen(false)
  }

  const { data, isLoading, isPending } = useGetCatalogOffers(catalogId)
  const catalogsData = useGetCatalogs()

  const { columns, rows } = useCatalogsOffersTable({
    catalogId
  })

  const catalog = useMemo(() => {
    return catalogsData.data?._embedded?.catalogs.find(
      (catalog) => catalog._links.self.href.split('/').pop() === catalogId
    )
  }, [catalogId, catalogsData.data?._embedded?.catalogs])

  if (isLoading || isPending) {
    return (
      <div className='flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-[100]'>
        <Loader />
      </div>
    )
  }

  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <CreateOfferModal
        catalogIdProp={catalogId}
        isOpen={open}
        onClose={onClose}
      />
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold uppercase'>
          Ofertas de Datos - <i>{catalog?.title}</i>
        </h1>
        <button
          className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
          onClick={() => setOpen(true)}
        >
          Crear nueva oferta de datos
          <IoCreateOutline className='ms-2 size-5 font-white' />
        </button>
      </div>
      {data?._embedded.resources.length === 0 ? (
        <p className='text-center text-gray-500'>
          No hay ofertas de datos disponibles en este catálogo
        </p>
      ) : (
        <Table columns={columns} rows={rows} />
      )}
    </section>
  )
}
