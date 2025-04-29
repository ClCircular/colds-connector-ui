import { FC } from 'react'
import { IoCreateOutline } from 'react-icons/io5'

interface CatalogOffersProps {
  catalogId: string
}

export const CatalogOffers: FC<CatalogOffersProps> = () => {
  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold uppercase'>Ofertas de Datos</h1>
        <button
          className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
          //   onClick={() => setOpen(true)}
        >
          Crear nueva oferta de datos
          <IoCreateOutline className='ms-2 size-5 font-white' />
        </button>
      </div>
    </section>
  )
}
