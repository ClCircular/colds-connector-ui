import { FC, useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IoAddCircleOutline, IoClose } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { usePolicyForm } from '../../hooks/policies/usePolicyForm'
import { Divider } from '../shared/Divider'

interface IPolicyModalProps {
  isOpen: boolean
  onClose: () => void
  policyId?: string // Optional, if you want to edit an existing policy
}
export const PolicyModal: FC<IPolicyModalProps> = ({
  isOpen,
  onClose,
  policyId
}) => {
  const { t } = useTranslation()
  const { createPolicyForm, onSubmit } = usePolicyForm({ policyId, onClose })
  const action = createPolicyForm.watch('action')
  const policyType = useWatch({
    control: createPolicyForm.control,
    name: 'policy_constraints.type'
  })
  useEffect(() => {
    createPolicyForm.setValue('policy_constraints.value', '')
  }, [policyType])
  const { errors } = createPolicyForm.formState
  console.log(errors)
  return (
    <div
      id='authentication-modal'
      tabIndex={-1}
      aria-hidden='true'
      onClick={() => {
        createPolicyForm.reset()
        onClose()
      }}
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
              {policyId ? t('update_policy') : t('create_policy')}
            </h3>
            <button
              type='button'
              className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer group'
              data-modal-hide='authentication-modal'
              onClick={() => {
                createPolicyForm.reset()
                onClose()
              }}
            >
              <IoClose className='group-hover:rotate-90 transition-transform size-6' />
              <span className='sr-only'>Close modal</span>
            </button>
          </div>
          <form
            className='p-4 md:p-5'
            onSubmit={createPolicyForm.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 mb-4 grid-cols-2'>
              {/* Name */}
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
                  {...createPolicyForm.register('name', { required: true })}
                />
              </div>

              {/* Action (drop-down) */}
              <div className='col-span-2'>
                <label
                  htmlFor='action'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  {t('policy_type')}
                </label>
                <select
                  id='action'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  {...createPolicyForm.register('action', { required: true })}
                >
                  <option value='access'>{t('access')}</option>
                  <option value='use'>{t('use')}</option>
                  {/* <option value='DENY'>{t('deny')}</option> */}
                </select>
              </div>
              {action && (
                <>
                  <p>{t('requirements')}</p>

                  {/* type (drop-down with one option, DATA ACCESS) */}
                  <div className='col-span-2'>
                    <label
                      htmlFor='type'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      {t('type')}
                    </label>
                    <select
                      id='type'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      {...createPolicyForm.register('policy_constraints.type', {
                        required: true
                      })}
                    >
                      {action === 'use' && (
                        <>
                          <option value=''>
                            -- {t('select_policy_type')} --
                          </option>
                          <option value='elapsedTime'>
                            {t('elapsed_time')}
                          </option>
                        </>
                      )}
                      {action === 'access' && (
                        <>
                          <option value=''>-- Select Type --</option>
                          <option value='DATA_ACCESS'>
                            {t('data_access')}
                          </option>{' '}
                        </>
                      )}
                    </select>
                  </div>

                  {/* operator and value drop-downs, shown only if type is DATA_ACCESS */}
                  <div className='col-span-2'>
                    <label
                      htmlFor='operator'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      {t('operator')}
                    </label>
                    <select
                      id='operator'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      {...createPolicyForm.register(
                        'policy_constraints.operator',
                        {
                          required: true
                        }
                      )}
                    >
                      <option value='eq'>{t('eq', 'Equals')}</option>
                    </select>
                  </div>
                  {policyType && (
                    <div className='col-span-2'>
                      <label
                        htmlFor='value'
                        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        {t('value')}
                      </label>
                      {policyType === 'DATA_ACCESS' && (
                        <select
                          key='DATA_ACCESS'
                          id='value'
                          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                          {...createPolicyForm.register(
                            'policy_constraints.value',
                            {
                              required: true
                            }
                          )}
                        >
                          <option value='public'>
                            {t('public', 'Public')}
                          </option>
                          <option value='private'>
                            {t('private', 'Private')}
                          </option>
                          <option value='sensitive'>
                            {t('sensitive', 'Sensitive')}
                          </option>
                        </select>
                      )}

                      {policyType === 'elapsedTime' && (
                        <>
                          <input
                            key='elapsedTime'
                            type='text'
                            id='value'
                            placeholder='e.g. 3D or 48H'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                            {...createPolicyForm.register(
                              'policy_constraints.value',
                              {
                                required: true,
                                pattern: {
                                  value: /^(\d+)([DH])$/, // d = days, h = hours
                                  message:
                                    'Use format like 3D (days) or 48H (hours)'
                                }
                              }
                            )}
                          />
                          {errors.policy_constraints?.value && (
                            <p className='text-red-600 text-sm mt-1'>
                              {errors.policy_constraints.value.message}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <Divider />
            <footer className='flex justify-end py-2'>
              <button
                type='submit'
                className='inline-flex items-center w-fit transition-colors px-3 py-2 text-sm font-medium text-center text-white bg-[#94bf43] rounded-lg hover:bg-[#819e4a] focus:ring-4 focus:outline-none  cursor-pointer gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400'
                disabled={
                  !createPolicyForm.formState.isValid ||
                  createPolicyForm.formState.isSubmitting ||
                  (policyId && !createPolicyForm.formState.isDirty
                    ? true
                    : false)
                }
              >
                {policyId ? (
                  <MdEdit className='font-white size-5' />
                ) : (
                  <IoAddCircleOutline className='font-white size-5' />
                )}
                {/* {t('create_policy')} */}
                {policyId ? t('update_policy') : t('create_policy')}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  )
}
