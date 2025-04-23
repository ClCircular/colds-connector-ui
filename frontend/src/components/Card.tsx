import { FC } from 'react'
import { IoArrowForwardOutline } from 'react-icons/io5'
import { Link } from 'wouter'

interface CardProps {
  title: string
  description: string
  link: string
}

export const Card: FC<CardProps> = ({ description, link, title }) => {
  return (
    <article className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700'>
      <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
        {title}
      </h5>
      <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
        {description}
      </p>
      <Link
        href={link}
        className='inline-flex items-center transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-[#94bf43] dark:focus:ring-blue-800'
      >
        Navegar
        <IoArrowForwardOutline className='ms-2' />
      </Link>
    </article>
  )
}
