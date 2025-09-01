import { useTranslation } from 'react-i18next'

export const Credentials = () => {
  const { t } = useTranslation()
  return (
    <section className='flex flex-col items-center justify-center h-full p-8'>
      <h1 className='text-2xl font-bold mb-4'>{t('credentials')}</h1>
      <p className='text-gray-600 dark:text-gray-300'>
        {/* Aquí puedes mostrar información, formularios o gestión de credenciales */}
        {t('credentials')} page
      </p>
    </section>
  )
}
