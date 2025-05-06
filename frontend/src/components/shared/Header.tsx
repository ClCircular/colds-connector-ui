import { Dispatch, FC, SetStateAction } from 'react'
import { Link } from 'wouter'

export const Header: FC<{
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ setOpen }) => {
  return (
    <header className='w-full bg-gray-100 p-4 flex items-center justify-between shadow-md'>
      <Link href='/' className='flex items-center cursor-pointer'>
        <img src='/assets/Logo-clcircular.svg' className='h-15' />
      </Link>
      <button
        className='rounded-md bg-gray-200 p-2 hover:scale-105 transition-transform cursor-pointer'
        onClick={() => setOpen(true)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
          />
        </svg>
      </button>
    </header>
  )
}
