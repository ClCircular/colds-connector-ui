import { IoCreateOutline } from 'react-icons/io5'
import { useGetCatalogs } from '../api/catalogs/useGetCatalogs'
import { CatalogCard } from '../components/catalogs/CatalogCard'

export const Catalogs = () => {
  const catalogsData = useGetCatalogs()
  return (
    <section className='flex flex-col gap-2 p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold uppercase'>Catálogos</h1>
        <button className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-[#94bf43] dark:focus:ring-blue-800 cursor-pointer capitalize'>
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
            />
          ))}
        </div>
      )}
    </section>
  )
}
