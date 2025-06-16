import { FC } from 'react'
import Papa from 'papaparse'

interface DownloadFormatModalProps {
  jsonData: string
  open: boolean
  onClose: () => void
}

export const DownloadFormatModal: FC<DownloadFormatModalProps> = ({
  jsonData,
  open,
  onClose
}) => {
  if (!open) return null

  const handleDownloadJson = () => {
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleDownloadCsv = () => {
    const csvData = Papa.unparse(JSON.parse(jsonData))
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in'>
        <button
          className='absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold focus:outline-none'
          onClick={onClose}
          aria-label='Cerrar'
        >
          &times;
        </button>
        <h2 className='text-xl font-semibold mb-2 text-gray-800 dark:text-white'>
          Descargar datos
        </h2>
        <p className='mb-6 text-gray-600 dark:text-gray-300'>
          Elige el formato para descargar los datos:
        </p>
        <div className='flex flex-col gap-3'>
          <button
            onClick={handleDownloadJson}
            className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400'
          >
            Descargar como JSON
          </button>
          <button
            onClick={handleDownloadCsv}
            className='w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400'
          >
            Descargar como CSV
          </button>
        </div>
      </div>
    </div>
  )
}
