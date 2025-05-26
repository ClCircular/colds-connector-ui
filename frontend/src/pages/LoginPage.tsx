import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LangSwitch } from '../components/shared/LangSwitch'

export const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    alert(`${t('login.email')}: ${email}\n${t('login.password')}: ${password}`)
  }

  return (
    <div className='flex flex-col items-center justify-center relative min-h-screen bg-gray-100 background-login'>
      <img
        src='/assets/Logo-clcircular.svg'
        className='h-15 absolute top-7 left-7'
      />
      <div className='absolute top-7 right-7 bg-white px-2 py-4 rounded-lg shadow-md'>
        <LangSwitch />
      </div>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-md flex flex-col gap-4 w-full max-w-md'
      >
        <h2 className='text-2xl font-bold mb-4 text-center'>
          {t('login.title')}
        </h2>
        <div className='flex flex-col gap-1'>
          <label htmlFor='email' className='text-sm font-medium text-gray-700'>
            {t('login.email')}
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t('login.emailPlaceholder')}
            className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label
            htmlFor='password'
            className='text-sm font-medium text-gray-700'
          >
            {t('login.password')}
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t('login.passwordPlaceholder')}
            className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button
          type='submit'
          className='mt-2 bg-[#94bf43] text-white font-semibold py-2 rounded hover:bg-[#829e4d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:cursor-pointer'
          disabled={!email || !password}
        >
          {t('login.button')}
        </button>
        {/* Divider */}
        <div className='flex items-center my-2'>
          <div className='flex-grow h-px bg-gray-200' />
          <span className='mx-2 text-gray-400 text-xs'>{t('or')}</span>
          <div className='flex-grow h-px bg-gray-200' />
        </div>
        {/* Forgot Password Button */}
        <button
          type='button'
          className='text-sm text-[#94bf43] hover:underline focus:outline-none cursor-pointer'
          onClick={() => alert('Forgot password functionality coming soon!')}
        >
          {t('login.forgot_your_password', 'Forgot your password?')}
        </button>
      </form>
    </div>
  )
}
