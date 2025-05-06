import { FC } from 'react'
import { IoArrowForwardOutline } from 'react-icons/io5'
import { Link } from 'wouter'

interface NavigationCardProps {
  title: string
  description: string
  link: string
}

export const NavigationCard: FC<NavigationCardProps> = ({
  description,
  link,
  title
}) => {
  return (
    <article className='max-w-sm p-6 min-h-52 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between'>
      <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
        {title}
      </h5>
      <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
        {description}
      </p>
      <Link
        href={link}
        className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none'
      >
        Navegar
        <IoArrowForwardOutline className='ms-2' />
      </Link>
    </article>
  )
}
