import { IoCreateOutline } from 'react-icons/io5'
import { CreateOfferModal } from '../components/offers/CreateOfferModal'
import { useState } from 'react'
import { useDataOffersTable } from '../hooks/offers/useDataOffersTable'
import { Table } from '../components/shared/Table'
import { useTranslation } from 'react-i18next'

export const DataOffers = () => {
  const [open, setOpen] = useState(false)

  const onClose = () => {
    setOpen(false)
  }

  const { columns, rows } = useDataOffersTable()

  const { t } = useTranslation()
  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <CreateOfferModal isOpen={open} onClose={onClose} />
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold uppercase'>{t('data_offers')}</h1>
        <button
          className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] cursor-pointer capitalize'
          onClick={() => setOpen(true)}
        >
          {t('create_new_data_offer')}
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
