import { FC } from 'react'
import { IoGridSharp } from 'react-icons/io5'

export const Drawer: FC<{
  open: boolean
  setOpen: (open: boolean) => void
}> = ({ open, setOpen }) => {
  return (
    <>
      {open && (
        <div
          className='fixed inset-0 bg-black opacity-45 z-30'
          onClick={() => setOpen(false)}
        />
      )}
      <div
        id='drawer-navigation'
        className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-64 dark:bg-gray-800 ${
          open ? 'translate-x-0' : 'tra'
        }`}
        tabIndex={-1}
        aria-labelledby='drawer-navigation-label'
      >
        <h5
          id='drawer-navigation-label'
          className='text-base font-semibold text-gray-500 uppercase dark:text-gray-400'
        >
          Menu
        </h5>
        <button
          onClick={() => setOpen(false)}
          type='button'
          data-drawer-hide='drawer-navigation'
          aria-controls='drawer-navigation'
          className='text-gray-400 bg-transparent cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white group'
        >
          <svg
            className={`size-3 group-hover:rotate-90 transition-transform`}
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 14 14'
          >
            <path
              stroke='currentColor'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
            />
          </svg>
          <span className='sr-only'>Close menu</span>
        </button>
        <div className='py-4 overflow-y-auto'>
          <ul className='space-y-2 font-medium'>
            <li>
              <a
                href='#'
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <IoGridSharp />
                <span className='ms-3'>Inicio</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
