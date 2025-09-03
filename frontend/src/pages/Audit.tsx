import { useTranslation } from 'react-i18next'
import { useGetAuditByUser } from '../api/audit/useGetAuditByUser'
import { Loader } from '../components'
import { Table } from '../components/shared/Table'
import { useAuditTable } from '../hooks/audit/useAuditTable'

export const Audit = () => {
  const { t } = useTranslation()

  const { isLoading } = useGetAuditByUser()

  const { columns, rows } = useAuditTable()

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-[100]'>
        <Loader />
      </div>
    )
  }
  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold uppercase'>{t('audit')}</h1>
      </div>
      {rows.length === 0 ? (
        <div className='flex justify-center items-center h-full'>
          <p className='text-gray-500'>{t('no_contracts_available')}</p>
        </div>
      ) : (
        <Table columns={columns} rows={rows} />
      )}
    </section>
  )
}
