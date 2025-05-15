import { FC, useEffect, useState } from 'react'
import { IoAddCircleOutline, IoClose } from 'react-icons/io5'
import { useCreateOfferForm } from '../../hooks/offers/useCreateOfferForm'
import { useGetCatalogs } from '../../api/catalogs/useGetCatalogs'
import { useTranslation } from 'react-i18next'

interface CreateOfferModalProps {
  isOpen: boolean
  onClose: () => void
  catalogIdProp?: string
}
export const CreateOfferModal: FC<CreateOfferModalProps> = ({
  isOpen,
  onClose,
  catalogIdProp
}) => {
  // const [catalogId, setCatalogId] = useState(catalogIdProp || '')
  const [keywordsText, setKeywordsText] = useState<string>('')
  const { createOfferForm, onSubmit } = useCreateOfferForm(catalogIdProp)

  const catalogsData = useGetCatalogs()

  useEffect(() => {
    if (keywordsText.includes(',')) {
      const newKeyWord = keywordsText.split(',').shift()
      const newKeyWordTrimmed = newKeyWord?.trim()
      const actualValues = createOfferForm.getValues('keywords')
      const isAlreadyInKeywords = actualValues?.includes(
        newKeyWordTrimmed ?? ''
      )
      if (isAlreadyInKeywords) {
        setKeywordsText('')
        return
      }
      console.log({ actualValues })
      createOfferForm.setValue(
        'keywords',
        [...actualValues, ...(newKeyWordTrimmed ? [newKeyWordTrimmed] : [])],
        {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true
        }
      )
      setKeywordsText('')
    }
  }, [keywordsText, createOfferForm])

  const { t } = useTranslation()

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
              {t('create_data_offer')}
            </h3>
            <button
              type='button'
              className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm size-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer group'
              data-modal-hide='authentication-modal'
              onClick={onClose}
            >
              <IoClose className='group-hover:rotate-90 transition-transform size-6' />
              <span className='sr-only'>Close modal</span>
            </button>
          </div>
          <form
            className='p-4 md:p-5'
            onSubmit={createOfferForm.handleSubmit(onSubmit)}
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
                  {...createOfferForm.register('title', { required: true })}
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
                  rows={4}
                  {...createOfferForm.register('description', {
                    required: true
                  })}
                  className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder={t('description_placeholder')}
                ></textarea>
              </div>
              {/* publisher */}
              <div className='col-span-2'>
                <label
                  htmlFor='publisher'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('publisher')}
                </label>
                <input
                  type='text'
                  id='publisher'
                  {...createOfferForm.register('publisher', {
                    required: true
                  })}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  placeholder={t('publisher_placeholder')}
                />
              </div>
              <div className='col-span-2'>
                <label
                  htmlFor='sovereign'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('sovereign')}
                </label>
                <input
                  type='text'
                  id='sovereign'
                  {...createOfferForm.register('sovereign', {
                    required: true
                  })}
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  placeholder={t('sovereign_placeholder')}
                />
              </div>
              <div className='col-span-2'>
                <label
                  htmlFor='paymentModality'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('select_a_payment_method')}
                </label>
                <select
                  id='paymentModality'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...createOfferForm.register('paymentModality', {
                    required: true
                  })}
                >
                  <option selected>{t('select_a_payment_method')}</option>
                  <option value='free'>{t('free')}</option>
                </select>
              </div>
              {/* Catalog if catalogIdProp is undefined */}
              {!catalogIdProp && (
                <div className='col-span-2'>
                  <label
                    htmlFor='catalog'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    {t('select_a_catalog')}
                  </label>
                  <input
                    list={`filter-options-catalog`}
                    id='catalog'
                    placeholder={t('select_a_catalog')}
                    {...createOfferForm.register('catalogId', {
                      required: true
                    })}
                    // value={catalogId}
                    // name='catalog'
                    // onChange={(e) => setCatalogId(e.target.value)}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  />
                  <datalist id={`filter-options-catalog`}>
                    {catalogsData.data?.map((catalog) => (
                      <option key={catalog.title} value={catalog.catalogId}>
                        {catalog.title}
                      </option>
                    ))}
                  </datalist>
                </div>
              )}
              {/* Keywords */}
              <div className='col-span-2 flex flex-col'>
                <label
                  htmlFor='keywords'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('keywords')}
                </label>
                <input
                  type='text'
                  value={keywordsText}
                  id='keywords'
                  placeholder={t('enter_keywords_separated_by_commas')}
                  name='keywords'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 mb-2'
                  onChange={(e) => {
                    setKeywordsText(e.target.value)
                  }}
                />
                <div className='flex gap-2 flex-wrap'>
                  {createOfferForm.getValues('keywords')?.map((keyword) => (
                    <div
                      key={keyword}
                      className='flex items-center justify-between gap-1 bg-gray-200 rounded-full px-2 py-1'
                    >
                      <span className='text-sm text-gray-700'>{keyword}</span>
                      <button
                        type='button'
                        className='flex items-center justify-center size-5 cursor-pointer text-gray-500 hover:bg-gray-300 rounded-full'
                        onClick={() => {
                          const filteredKeywords = createOfferForm
                            .getValues('keywords')
                            .filter((k) => {
                              console.log({ k, keyword })
                              return k !== keyword
                            })
                          createOfferForm.setValue(
                            'keywords',
                            filteredKeywords,
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                              shouldTouch: true
                            }
                          )
                        }}
                      >
                        <IoClose className='text-gray-500' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              type='submit'
              className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none  cursor-pointer gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 capitalize'
              disabled={
                createOfferForm.formState.isSubmitting ||
                createOfferForm.formState.isValidating ||
                createOfferForm.formState.isLoading ||
                !createOfferForm.formState.isDirty ||
                !createOfferForm.formState.isValid
              }
            >
              <IoAddCircleOutline className='font-white size-5' />
              {t('create_data_offer')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
