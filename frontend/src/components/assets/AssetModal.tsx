import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IoAddCircleOutline, IoClose } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { useAssetForm } from '../../hooks/assets/useAssetForm'

interface IAssetModalProps {
  isOpen: boolean
  onClose: () => void
  assetId?: string // Optional, if you want to edit an existing asset
}
export const AssetModal: FC<IAssetModalProps> = ({
  isOpen,
  onClose,
  assetId
}) => {
  const { t } = useTranslation()
  const { assetForm, onSubmit } = useAssetForm({ assetId, onClose })

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
              {assetId ? t('update_asset') : t('create_asset')}
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
            onSubmit={assetForm.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 mb-4 grid-cols-2'>
              {/* Title */}
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
                  {...assetForm.register('name', {
                    required: true
                  })}
                />
              </div>

              {/* Description */}
              <div className='col-span-2'>
                <label
                  htmlFor='description'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('description')}
                </label>
                <input
                  type='text'
                  id='description'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  placeholder={t('description_placeholder')}
                  required
                  {...assetForm.register('description', {
                    required: true
                  })}
                />
              </div>

              {/* Type (select, only HTTPDATA for now) */}
              <div className='col-span-2'>
                <label
                  htmlFor='asset_data_type'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('type')}
                </label>
                <select
                  id='asset_data_type'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  {...assetForm.register('data_source.type', {
                    required: true
                  })}
                >
                  <option value='HttpData'>{t('httpdata', 'HTTPDATA')}</option>
                </select>
              </div>

              {/* Flow (PULL OR PUSH) */}
              <div className='col-span-2'>
                <label
                  htmlFor='asset_data_flow'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('flow')}
                </label>
                <select
                  id='asset_data_flow'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  {...assetForm.register('data_source.flow', {
                    required: true
                  })}
                >
                  <option value='PULL'>{t('pull', 'PULL')}</option>
                  <option value='PUSH'>{t('push', 'PUSH')}</option>
                </select>
              </div>

              {/* Data address, only if type is HTTPDATA */}
              {assetForm.watch('data_source.type') === 'HttpData' && (
                <div className='col-span-2'>
                  <label
                    htmlFor='asset_data_address'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    {t('data_address')}
                  </label>
                  <input
                    type='text'
                    id='asset_data_address'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                    placeholder={t('data_address_placeholder')}
                    required
                    {...assetForm.register('data_source.source', {
                      required: true
                    })}
                  />
                </div>
              )}
            </div>
            <button
              type='submit'
              className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none  cursor-pointer gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400'
              disabled={
                !assetForm.formState.isValid ||
                assetForm.formState.isSubmitting ||
                (assetId && !assetForm.formState.isDirty ? true : false)
              }
            >
              {assetId ? (
                <MdEdit className='font-white size-5' />
              ) : (
                <IoAddCircleOutline className='font-white size-5' />
              )}
              {/* {t('create_policy')} */}
              {assetId ? t('update_asset') : t('create_asset')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
