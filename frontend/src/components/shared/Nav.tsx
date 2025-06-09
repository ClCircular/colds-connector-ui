import { Link, useLocation } from 'wouter'
import {
  IoHome,
  IoFileTrayFull,
  IoDocuments,
  IoShieldCheckmark
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
      icon: <IoHome className='size-6 text-inherit' />
    },
    {
      href: '/policies',
      label: t('policies'),
      icon: <IoShieldCheckmark className='size-6' />
    },
    {
      href: '/contracts',
      label: t('contracts'),
      icon: <IoFileTrayFull className='size-6' />
    },
    {
      href: '/assets',
      label: t('assets'),
      icon: <IoDocuments className='size-6' />
    },
    // negotiations
    {
      href: '/negotiations',
      label: t('negotiations'),
      icon: <IoFileTrayFull className='size-6' />
    },
    // catalog browser
    {
      href: '/catalog-browser',
      label: t('catalog_browser'),
      icon: <IoFileTrayFull className='size-6' />
    }
  ]

  return (
    <ul className='space-y-2 font-medium'>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href}>
            <p
              onClick={() => setOpen(false)} // 👉 Cierra el menú
              className={`flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                location === link.href
                  ? 'text-[#94bf43] bg-gray-100 dark:text-blue-400 dark:bg-gray-700'
                  : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {link.icon && link.icon}
              <span
                className={`ms-3 text-lg ${
                  location === link.href
                    ? 'text-[#94bf43] bg-gray-100 dark:text-blue-400 dark:bg-gray-700'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {link.label}
              </span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
