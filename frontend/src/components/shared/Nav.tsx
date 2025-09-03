import { Link, useLocation } from 'wouter'
import {
  IoHome,
  IoFileTrayFull,
  IoDocuments,
  IoShieldCheckmark,
  IoPeople,
  IoSearch,
  IoSwapVertical,
  IoKey,
  IoTimeOutline
} from 'react-icons/io5'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const Nav: FC<{
  setOpen: (open: boolean) => void
}> = ({ setOpen }) => {
  const [location] = useLocation()
  const { t } = useTranslation()

  const links = [
    {
      href: '/',
      label: t('home'),
      icon: <IoHome className='text-lg' />
    },
    {
      href: '/policies',
      label: t('policies'),
      icon: <IoShieldCheckmark className='text-lg' />
    },
    {
      href: '/contracts',
      label: t('contracts'),
      icon: <IoFileTrayFull className='text-lg' />
    },
    {
      href: '/assets',
      label: t('assets'),
      icon: <IoDocuments className='text-lg' />
    },
    {
      href: '/negotiations',
      label: t('negotiations'),
      icon: <IoPeople className='text-lg' />
    },
    {
      href: '/catalog-browser',
      label: t('catalog_browser'),
      icon: <IoSearch className='text-lg' />
    },
    {
      href: '/transfers-history',
      label: t('transfers_history'),
      icon: <IoSwapVertical className='text-lg' />
    },
    {
      href: '/credentials',
      label: t('credentials'),
      icon: <IoKey className='text-lg' />
    },
    {
      href: '/audit',
      label: t('audit'),
      icon: <IoTimeOutline className='text-lg' />
    }
  ]

  return (
    <ul className='space-y-2 font-medium'>
      {links.map(({ href, label, icon }) => {
        const active = location === href
        const base =
          'flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'
        const activeClasses =
          'text-[#94bf43] bg-gray-100 dark:text-blue-400 dark:bg-gray-700'
        const inactiveClasses = 'text-gray-900 dark:text-white'
        return (
          <li key={href}>
            <Link href={href}>
              <p
                onClick={() => setOpen(false)}
                className={`${base} ${
                  active ? activeClasses : inactiveClasses
                }`}
              >
                {icon}
                <span
                  className={`ms-3 text-lg ${
                    active ? activeClasses : inactiveClasses
                  }`}
                >
                  {label}
                </span>
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
