import { Link, useLocation } from 'wouter'
import {
  IoHome,
  IoDocuments,
  IoFileTrayFull,
  IoLink,
  IoCloudUpload,
  IoSwapHorizontal,
  IoAlbums
} from 'react-icons/io5'
import { FC } from 'react'

export const Nav: FC<{
  setOpen: (open: boolean) => void
}> = ({ setOpen }) => {
  const [location] = useLocation()
  const links = [
    { href: '/', label: 'Inicio', icon: <IoHome className='size-6' /> },
    {
      href: '/politics',
      label: 'Políticas',
      icon: <IoDocuments className='size-6' />
    },
    {
      href: '/contracts',
      label: 'Contratos',
      icon: <IoFileTrayFull className='size-6' />
    },
    {
      href: '/data-connections',
      label: 'Conexiones De Datos',
      icon: <IoLink className='size-6' />
    },
    {
      href: '/offered-data',
      label: 'Datos Ofrecidos',
      icon: <IoCloudUpload className='size-6' />
    },
    {
      href: '/exchanges',
      label: 'Intercambios',
      icon: <IoSwapHorizontal className='size-6' />
    },
    {
      href: '/catalogs',
      label: 'Catálogos',
      icon: <IoAlbums className='size-6' />
    }
  ]

  return (
    <ul className='space-y-2 font-medium'>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href}>
            <p
              onClick={() => setOpen(false)} // 👉 Cierra el menú
              className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                location === link.href
                  ? 'text-blue-600 bg-gray-100 dark:text-blue-400 dark:bg-gray-700'
                  : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {link.icon && link.icon}
              <span className='ms-3 text-lg'>{link.label}</span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
