import { FC } from 'react'
import { IoAddCircleOutline } from 'react-icons/io5'

interface CatalogCardProps {
  title: string
  description: string
  numberOfResources: number
}

export const CatalogCard: FC<CatalogCardProps> = ({
  description,
  title,
  numberOfResources
}) => {
  return (
    <article className='max-w-sm p-6 min-h-52 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between'>
      <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
        {title}
      </h5>
      <p className='font-normal text-gray-700 dark:text-gray-400'>
        {description}
      </p>
      <p className='font-normal text-gray-700 dark:text-gray-400'>
        Número de recursos: {numberOfResources}
      </p>
      <button className='inline-flex items-center gap-2 w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none  cursor-pointer'>
        Añadir recurso
        <IoAddCircleOutline className='font-white size-5' />
      </button>
    </article>
  )
}
