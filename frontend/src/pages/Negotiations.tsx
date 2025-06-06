import { useTranslation } from 'react-i18next'
import { useGetNegotiations } from '../api/negotiations/useGetNegotiations'
import { Loader } from '../components'
import { Table } from '../components/shared/Table'
import { useNegotiationsTable } from '../hooks/negotiations/useNegotiationsTable'

export const Negotiations = () => {
  const { data, isLoading } = useGetNegotiations()
  const { columns, rows } = useNegotiationsTable()
  const { t } = useTranslation()
  if (isLoading) {
    return <Loader />
  }
  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold uppercase'>{t('negotiations')}</h1>
      </div>
      {rows.length === 0 ? (
        <div className='flex justify-center items-center h-full'>
          <p className='text-gray-500'>{t('no_negotiations_available')}</p>
        </div>
      ) : (
        <Table columns={columns} rows={rows} />
      )}
    </section>
  )
}
