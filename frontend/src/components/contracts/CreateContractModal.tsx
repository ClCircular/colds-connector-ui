import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IoAddCircleOutline, IoClose } from 'react-icons/io5'
import { useCreateContractForm } from '../../hooks/contracts/useCreateContractForm'

interface ICreateContractModalProps {
  isOpen: boolean
  onClose: () => void
}
export const CreateContractModal: FC<ICreateContractModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation()
  const { createContractForm, onSubmit } = useCreateContractForm()

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
              {t('create_contract')}
            </h3>
            <button
              type='button'
              className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer group'
              data-modal-hide='authentication-modal'
              onClick={onClose}
            >
              <IoClose className='group-hover:rotate-180 transition-transform size-6' />
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
                  htmlFor='title'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('title')}
                </label>
                <input
                  type='text'
                  id='title'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  placeholder={t('title_placeholder')}
                  required
                  {...createContractForm.register('title', { required: true })}
                />
              </div>

              <div className='col-span-2'>
                <label
                  htmlFor='description'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('description')}
                </label>
                <textarea
                  id='description'
                  {...createContractForm.register('description', {
                    required: true
                  })}
                  rows={4}
                  className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder={t('description_placeholder')}
                ></textarea>
              </div>
              <div className='col-span-2 flex flex-col gap-1'>
                <p>{t('validity_date_of_the_contract')}</p>
                <div className='flex gap-4'>
                  <div className='w-1/2 flex flex-col gap-1'>
                    <label
                      htmlFor='startDate'
                      className='block text-sm font-medium text-gray-900 dark:text-white'
                    >
                      {t('start_date')}
                    </label>
                    <input
                      type='date'
                      id='start-date'
                      {...createContractForm.register('startDate', {
                        required: true
                      })}
                      placeholder='Ingrese la fecha'
                      className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 bg-gray-50'
                    />
                  </div>
                  <div className='w-1/2 flex flex-col gap-1'>
                    <label
                      htmlFor='end-date'
                      className='block text-sm font-medium text-gray-900 dark:text-white'
                    >
                      {t('end_date')}
                    </label>
                    <input
                      type='date'
                      id='endDate'
                      {...createContractForm.register('endDate', {
                        required: true
                      })}
                      placeholder='Ingrese la fecha'
                      className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 bg-gray-50'
                    />
                  </div>
                </div>
              </div>
              <div className='col-span-2'>
                <label
                  htmlFor='accessPolicy'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('select_access_policy')}
                </label>
                <select
                  id='accessPolicy'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...createContractForm.register('accessPolicy', {
                    required: true
                  })}
                >
                  <option selected>{t('select_access_policy')}</option>
                  <option value='PROVIDE_ACCESS'>{t('allow_access')}</option>
                </select>
              </div>
            </div>
            <button
              type='submit'
              className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none  cursor-pointer gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400'
            >
              <IoAddCircleOutline className='font-white size-5' />
              {t('create_contract')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
