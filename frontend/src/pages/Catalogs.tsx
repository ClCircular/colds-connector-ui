import { IoCreateOutline } from 'react-icons/io5'
import { CatalogCard } from '../components/catalogs/CatalogCard'
// import { Table } from '../components/shared/Table'
// import { useCatalogsTable } from '../hooks/catalogs/useCatalogsTable'
import { useState } from 'react'
import { CreateCatalogModal } from '../components/catalogs/CreateCatalogModal'
import { useGetCatalogs } from '../api/catalogs/useGetCatalogs'

export const Catalogs = () => {
  const [open, setOpen] = useState(false)
  const catalogsData = useGetCatalogs()
  // const { columns, rows } = useCatalogsTable()

  const onClose = () => {
    setOpen(false)
  }
  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <CreateCatalogModal isOpen={open} onClose={onClose} />
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold uppercase'>Catálogos</h1>
        <button
          className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
          onClick={() => setOpen(true)}
        >
          Crear nuevo catálogo
          <IoCreateOutline className='ms-2 size-5 font-white' />
        </button>
      </div>
      {catalogsData.data?._embedded?.catalogs.length === 0 ? (
        <p className='text-center text-gray-500'>
          No hay catalogos disponibles
        </p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center md:justify-items-stretch'>
          {catalogsData.data?._embedded?.catalogs.map((catalog) => (
            <CatalogCard
              key={catalog.title}
              title={catalog.title}
              description={catalog.description}
              numberOfResources={catalog.numberOfResources ?? 0}
              catalogId={catalog._links.self.href.split('/').pop() ?? ''}
            />
          ))}
        </div>
      )}
      {/* <Table columns={columns} rows={rows} /> */}
    </section>
  )
}
