import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoCreateOutline } from 'react-icons/io5'
import { Table } from '../components/shared/Table'
import { useContractsTable } from '../hooks/contracts/useContractsTable'
import { ContractModal } from '../components/contracts/ContractModal'

export const Contracts = () => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const { columns, rows, contractId, setContractId } =
    useContractsTable(setOpen)

  const onClose = () => {
    setOpen(false)
    setContractId('')
  }

  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <ContractModal isOpen={open} onClose={onClose} contractId={contractId} />
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold uppercase'>{t('contracts')}</h1>
        <button
          className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
          onClick={() => setOpen(true)}
        >
          {t('create_new_contract')}
          <IoCreateOutline className='ms-2 size-5 font-white' />
        </button>
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
