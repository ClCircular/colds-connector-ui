import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FiExternalLink } from 'react-icons/fi'
import { IoAddCircleOutline } from 'react-icons/io5'
import { Link } from 'wouter'
// import { CatalogCardOptions } from './CatalogCardOptions'

interface CatalogCardProps {
  title: string
  description: string
  numberOfResources: number
  catalogId: string
}

export const CatalogCard: FC<CatalogCardProps> = ({
  description,
  title,
  numberOfResources,
  catalogId
}) => {
  const { t } = useTranslation()
  return (
    <article className='max-w-sm p-6 min-h-52 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between relative'>
      {/* <CatalogCardOptions /> */}

      <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
        {title}
      </h5>
      <p className='font-normal text-gray-700 dark:text-gray-400'>
        {description}
      </p>
      <Link
        className='font-normal text-gray-700 dark:text-gray-400 flex items-center gap-2 underline'
        href={`/catalogs/${catalogId}/offers`}
      >
        {t('number_of_resources')}: {numberOfResources}
        <FiExternalLink className='inline-block' />
      </Link>
      <button className='inline-flex items-center gap-2 w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none  cursor-pointer'>
        {t('add_resource')}
        <IoAddCircleOutline className='font-white size-5' />
      </button>
    </article>
  )
}
