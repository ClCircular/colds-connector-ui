import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
interface LoginCardProps {
  login: ReturnType<typeof import('../../hooks/login/useLogin').useLogin>
}

export const LoginCard = ({ login }: LoginCardProps) => {
  const { t, email, setEmail, password, setPassword, handleSignIn, loading } =
    login
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={(e) => handleSignIn(e)} className='flex flex-col gap-4'>
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
        <div className='relative'>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t('login.passwordPlaceholder')}
            className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full pr-10'
          />
          <button
            type='button'
            tabIndex={-1}
            className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer p-2 hover:bg-slate-50 rounded-full transition-colors'
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword
                ? t('login.hide_password', 'Hide password')
                : t('login.show_password', 'Show password')
            }
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>
      <button
        type='submit'
        className='mt-2 bg-[#94bf43] text-white font-semibold py-2 rounded hover:bg-[#829e4d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:cursor-pointer'
        disabled={!email || !password || loading}
      >
        {t('login.button')}
      </button>
    </form>
  )
}
