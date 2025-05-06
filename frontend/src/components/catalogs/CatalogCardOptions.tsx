import { IoEllipsisHorizontal } from 'react-icons/io5'
export const CatalogCardOptions = () => {
  return (
    <div data-dial-init className='absolute group top-2 right-2'>
      <div
        id='speed-dial-menu-dropdown'
        className='group-hover:flex flex-col justify-end hidden py-1 mb-4 space-y-2 bg-white border border-gray-100 rounded-lg shadow-xs absolute -right-20 top-6 z-10'
      >
        <ul className='text-sm text-gray-500 dark:text-gray-300'>
          <li>
            <a
              href='#'
              className='flex items-center px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
            >
              <svg
                className='w-3.5 h-3.5 me-2'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 18 18'
              >
                <path d='M14.419 10.581a3.564 3.564 0 0 0-2.574 1.1l-4.756-2.49a3.54 3.54 0 0 0 .072-.71 3.55 3.55 0 0 0-.043-.428L11.67 6.1a3.56 3.56 0 1 0-.831-2.265c.006.143.02.286.043.428L6.33 6.218a3.573 3.573 0 1 0-.175 4.743l4.756 2.491a3.58 3.58 0 1 0 3.508-2.871Z' />
              </svg>
              <span className='text-sm font-medium'>Share</span>
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
            >
              <svg
                className='w-3.5 h-3.5 me-2'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M5 20h10a1 1 0 0 0 1-1v-5H4v5a1 1 0 0 0 1 1Z' />
                <path d='M18 7H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h14Z' />
              </svg>
              <span className='text-sm font-medium'>Print</span>
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
            >
              <svg
                className='w-3.5 h-3.5 me-2'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z' />
                <path d='M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z' />
              </svg>
              <span className='text-sm font-medium'>Save</span>
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
            >
              <svg
                className='w-3.5 h-3.5 me-2'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 18 20'
              >
                <path d='M5 9V4.13a2.96 2.96 0 0 0-1.293.749L.879 7.707A2.96 2.96 0 0 0 .13 9H5Zm11.066-9H9.829a2.98 2.98 0 0 0-2.122.879L7 1.584A.987.987 0 0 0 6.766 2h4.3A3.972 3.972 0 0 1 15 6v10h1.066A1.97 1.97 0 0 0 18 14V2a1.97 1.97 0 0 0-1.934-2Z' />
                <path d='M11.066 4H7v5a2 2 0 0 1-2 2H0v7a1.969 1.969 0 0 0 1.933 2h9.133A1.97 1.97 0 0 0 13 18V6a1.97 1.97 0 0 0-1.934-2Z' />
              </svg>
              <span className='text-sm font-medium'>Copy</span>
            </a>
          </li>
        </ul>
      </div>
      <button
        type='button'
        data-dial-toggle='speed-dial-menu-dropdown'
        aria-controls='speed-dial-menu-dropdown'
        aria-expanded='false'
        className='flex items-center justify-center ml-auto text-gray-600 bg-gray-200 rounded-full size-6 hover:bg-gray-300 transition-colors'
      >
        <IoEllipsisHorizontal />
      </button>
    </div>
  )
}
