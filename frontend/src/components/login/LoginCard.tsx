import React from 'react'
import { useLogin } from '../../hooks/login/useLogin'

export const LoginCard: React.FC = () => {
  const { t, email, setEmail, password, setPassword, handleSubmit } = useLogin()

  return (
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
        <label htmlFor='password' className='text-sm font-medium text-gray-700'>
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
  )
}
