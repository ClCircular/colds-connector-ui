import { FC, useState } from 'react'
import { Nav } from './Nav'
import { useTranslation } from 'react-i18next'
import { signOut } from 'aws-amplify/auth'
import { useLocation } from 'wouter'
import { useAuthUser } from '../../contexts/UserContext'

export const Drawer: FC<{
  open: boolean
  setOpen: (open: boolean) => void
}> = ({ open, setOpen }) => {
  const { t } = useTranslation()
  const [, setLocation] = useLocation()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { resetContext } = useAuthUser()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      resetContext()
      setLocation('/login')
    } catch (err) {
      alert('Error signing out')
      setIsSigningOut(false)
    }
  }
  return (
    <>
      {open && (
        <div
          className='fixed inset-0 bg-black opacity-45 z-30'
          onClick={() => setOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform duration-300 bg-white min-w-xs dark:bg-gray-800 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        tabIndex={-1}
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
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
            />
          </svg>
          <span className='sr-only'>Close menu</span>
        </button>
        <div className='py-4 overflow-y-auto'>
          <Nav setOpen={setOpen} />
          <div className='w-full h-px bg-slate-200 my-2' />
          <button
            type='button'
            className='text-white bg-[#94bf43] hover:bg-[#829e4d] focus:ring-4 focus:outline-none focus:ring-[#94bf43]/50 font-semibold rounded-lg text-sm px-5 py-2.5 text-center mb-2 w-full cursor-pointer transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? t('signing_out', 'Signing out...') : t('sign_out')}
          </button>
        </div>
      </div>
    </>
  )
}
