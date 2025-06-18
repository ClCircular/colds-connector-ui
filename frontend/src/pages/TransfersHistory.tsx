import { useTranslation } from 'react-i18next'
import { useTransfersTable } from '../hooks/transfers/useTransfersTable'
import { Table } from '../components/shared/Table'
import { DownloadFormatModal } from '../components/transfers/DownloadFormatModal'

export const TransfersHistory = () => {
  const { columns, rows, isModalOpen, setIsModalOpen, jsonData } =
    useTransfersTable()

  console.log({ isModalOpen, jsonData })
  const { t } = useTranslation()
  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      {isModalOpen && (
        <DownloadFormatModal
          jsonData={jsonData}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold uppercase'>
          {t('transfers_history')}
        </h1>
      </div>
      {rows.length === 0 ? (
        <div className='flex justify-center items-center h-full'>
          <p className='text-gray-500'>{t('no_transfers_history_available')}</p>
        </div>
      ) : (
        <Table columns={columns} rows={rows} />
      )}
    </section>
  )
}
