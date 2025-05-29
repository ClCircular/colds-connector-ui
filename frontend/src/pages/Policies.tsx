import { useTranslation } from 'react-i18next'
import { usePoliciesTable } from '../hooks/policies/usePoliciesTable'
import { Table } from '../components/shared/Table'
import { useState } from 'react'
import { IoCreateOutline } from 'react-icons/io5'
import { CreatePolicyModal } from '../components/policies/CreatePolicyModal'

export const Policies = () => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const { columns, rows } = usePoliciesTable()

  const onClose = () => {
    setOpen(false)
  }

  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <CreatePolicyModal isOpen={open} onClose={onClose} />
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold uppercase'>{t('policies')}</h1>
        <button
          className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
          onClick={() => setOpen(true)}
        >
          {t('create_new_policy')}
          <IoCreateOutline className='ms-2 size-5 font-white' />
        </button>
      </div>
      {rows.length === 0 ? (
        <div className='flex justify-center items-center h-full'>
          <p className='text-gray-500'>{t('no_data_offers_available')}</p>
        </div>
      ) : (
        <Table columns={columns} rows={rows} />
      )}
    </section>
  )
}
