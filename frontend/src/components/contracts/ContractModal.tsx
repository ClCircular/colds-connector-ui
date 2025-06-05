import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IoAddCircleOutline, IoClose } from 'react-icons/io5'
import { useContractForm } from '../../hooks/contracts/useContractForm'
import { Divider } from '../shared/Divider'

interface ICreateContractModalProps {
  isOpen: boolean
  onClose: () => void
  contractId?: string // Optional, if you want to edit an existing contract
}
export const ContractModal: FC<ICreateContractModalProps> = ({
  isOpen,
  onClose,
  contractId
}) => {
  const { t } = useTranslation()
  const {
    createContractForm,
    onSubmit,
    assetsOptionsForSelect,
    policiesOptionsForSelect
  } = useContractForm({ onClose, contractId })

  return (
    <div
      id='authentication-modal'
      tabIndex={-1}
      aria-hidden='true'
      onClick={onClose}
      className={` bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full ${
        isOpen ? 'flex' : 'hidden'
      }`}
    >
      <div
        className='relative p-4 w-full max-w-md max-h-full z-[60]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='relative bg-white rounded-lg shadow-sm z-[60] dark:bg-gray-700'>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {contractId ? t('edit_contract') : t('create_contract')}
            </h3>
            <button
              type='button'
              className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer group'
              data-modal-hide='authentication-modal'
              onClick={onClose}
            >
              <IoClose className='group-hover:rotate-90 transition-transform size-6' />
              <span className='sr-only'>Close modal</span>
            </button>
          </div>
          <form
            className='p-4 md:p-5'
            onSubmit={createContractForm.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 mb-4 grid-cols-2'>
              <div className='col-span-2'>
                <label
                  htmlFor='name'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('name')}
                </label>
                <input
                  type='text'
                  id='name'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  placeholder={t('name_placeholder')}
                  required
                  {...createContractForm.register('name', { required: true })}
                />
              </div>
              <div>
                <label
                  htmlFor='accessPolicySelect'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('access_policy')}
                </label>
                <select
                  id='accessPolicySelect'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...createContractForm.register('access_policy_id', {
                    required: true
                  })}
                >
                  <option value=''>{t('select_access_policy')}</option>
                  {policiesOptionsForSelect?.map((policy) => (
                    <option key={policy.value} value={policy.value}>
                      {policy.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor='contractPolicy'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('contract_policy')}
                </label>
                <select
                  id='contractPolicy'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...createContractForm.register('contract_policy_id', {
                    required: true
                  })}
                >
                  <option value=''>{t('select_contract_policy')}</option>
                  {policiesOptionsForSelect?.map((policy) => (
                    <option key={policy.value} value={policy.value}>
                      {policy.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-span-2'>
                <label
                  htmlFor='asset'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('asset')}
                </label>
                <select
                  id='asset'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...createContractForm.register('asset_id', {
                    required: true
                  })}
                >
                  <option value=''>{t('select_asset')}</option>
                  {assetsOptionsForSelect?.map((asset) => (
                    <option key={asset.value} value={asset.value}>
                      {asset.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Divider />
            <footer className='flex justify-end py-2'>
              <button
                type='submit'
                className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none  cursor-pointer gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400'
              >
                <IoAddCircleOutline className='font-white size-5' />
                {contractId ? t('edit_contract') : t('create_contract')}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  )
}
