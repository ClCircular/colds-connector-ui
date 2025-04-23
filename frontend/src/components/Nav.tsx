import { Link } from 'wouter'
import {
  IoHome,
  IoDocuments,
  IoFileTrayFull,
  IoLink,
  IoCloudUpload,
  IoSwapHorizontal
} from 'react-icons/io5'

export const Nav = () => {
  const links = [
    { href: '/', label: 'Inicio', icon: <IoHome className='size-6' /> },
    {
      href: '/politics',
      label: 'Politics',
      icon: <IoDocuments className='size-6' />
    },
    {
      href: '/contracts',
      label: 'Contracts',
      icon: <IoFileTrayFull className='size-6' />
    },
    {
      href: '/data-connections',
      label: 'Data Connections',
      icon: <IoLink className='size-6' />
    },
    {
      href: '/offered-data',
      label: 'Offered Data',
      icon: <IoCloudUpload className='size-6' />
    },
    {
      href: '/exchanges',
      label: 'Exchanges',
      icon: <IoSwapHorizontal className='size-6' />
    }
  ]
  //   ${
  // isActive
  //   ? 'text-blue-600 bg-gray-100 dark:text-blue-400 dark:bg-gray-700'
  //   : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
  // }
  return (
    <ul className='space-y-2 font-medium'>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href}>
            <a
              className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group
                `}
            >
              {link.icon && link.icon}
              <span className='ms-3 text-lg'>{link.label}</span>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  )
}
