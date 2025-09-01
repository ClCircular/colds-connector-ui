import { useTranslation } from 'react-i18next'
import { useGetCredentials } from '../api/credentials/useGetCredentials'
import { Loader } from '../components'
import { useRequestCredentials } from '../api/credentials/useRequestCredentials'
import dayjs from 'dayjs'

export const Credentials = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useGetCredentials()
  const { mutate, isPending, isError } = useRequestCredentials()

  if (isLoading || isPending) {
    return (
      <div className='flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-[100]'>
        <Loader />
      </div>
    )
  }

  return (
    <section className='flex flex-col gap-2 p-4 h-full'>
      <div className='flex w-full justify-between items-center'>
        <h1 className='text-lg font-semibold uppercase'>{t('credentials')}</h1>
        <button
          className='mb-4 px-4 py-2 w-fit bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400 disabled:cursor-not-allowed'
          onClick={() => mutate()}
          disabled={isPending || (Array.isArray(data) && data.length > 0)}
        >
          {isPending ? t('loading') + '...' : t('request_credentials')}
        </button>
      </div>
      {isError && (
        <div className='mb-4 text-red-600'>
          {t('credentials_request_error')}
        </div>
      )}
      {/* Mostrar los datos si existen */}
      {Array.isArray(data) && data.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-4'>
          {data.map((cred, idx) => (
            <div
              key={idx}
              className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col gap-2 border border-gray-200 dark:border-gray-700'
            >
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-semibold text-gray-500 dark:text-gray-400'>
                  {cred.credential_type || 'Credential'}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    cred.status?.toLowerCase() === 'issued'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {t(cred.status?.toLowerCase())}
                </span>
              </div>
              <div>
                <span className='font-medium text-gray-700 dark:text-gray-200'>
                  {t('issuer')}:
                </span>
                <span className='ml-2 text-gray-900 dark:text-white'>
                  {cred.issuer}
                </span>
              </div>
              <div>
                <span className='font-medium text-gray-700 dark:text-gray-200'>
                  {t('issuance_date')}:
                </span>
                <span className='ml-2 text-gray-900 dark:text-white'>
                  {dayjs(cred.issuance_date).format('DD/MM/YYYY')}
                </span>
              </div>
              {/* format */}
              <div>
                <span className='font-medium text-gray-700 dark:text-gray-200'>
                  {t('format')}:
                </span>
                <span className='ml-2 text-gray-900 dark:text-white'>
                  {cred.format}
                </span>
              </div>
              <div>
                <span className='font-medium text-gray-700 dark:text-gray-200'>
                  Credential Subject:
                </span>
                <pre className='bg-gray-50 dark:bg-gray-900 rounded p-2 mt-1 text-xs text-gray-800 dark:text-gray-100 overflow-x-auto'>
                  {JSON.stringify(
                    cred.credential_payload.credentialSubject,
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='mt-4 text-gray-500'>
          {t('no_credentials_found') || 'No credentials found.'}
        </p>
      )}
    </section>
  )
}
