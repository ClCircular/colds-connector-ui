import { Dispatch, FC, SetStateAction } from 'react'
import { IoMenuOutline } from 'react-icons/io5'
import { Link } from 'wouter'
import { LangSwitch } from './LangSwitch'

export const Header: FC<{
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ setOpen }) => {
  return (
    <header className='w-full bg-gray-100 p-4 flex items-center justify-between shadow-md'>
      <Link href='/' className='flex items-center cursor-pointer'>
        <img src='/assets/Logo-clcircular.svg' className='h-15' />
      </Link>
      <div className='flex items-center gap-4'>
        <LangSwitch />
        <button
          className='rounded-md bg-gray-200 p-2 hover:scale-105 transition-transform cursor-pointer'
          onClick={() => setOpen(true)}
        >
          <IoMenuOutline className='size-6' />
        </button>
      </div>
    </header>
  )
}
