interface ForgotPasswordProps {
  login: ReturnType<typeof import('../../hooks/login/useLogin').useLogin>
}

export const ForgotPassword = ({ login }: ForgotPasswordProps) => {
  const {
    t,
    email,
    setEmail,
    handleForgotPassword,
    loading,
    forgotPasswordError,
    forgotPasswordSent
  } = login

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleForgotPassword()
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold mb-4 text-center'>
        {t('login.forgot_your_password', 'Forgot your password?')}
      </h2>
      <div className='flex flex-col gap-1'>
        <label
          htmlFor='forgot-email'
          className='text-sm font-medium text-gray-700'
        >
          {t('login.email')}
        </label>
        <input
          id='forgot-email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={t('login.emailPlaceholder')}
          className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      {forgotPasswordError && (
        <div className='text-red-600 text-sm text-center'>
          {forgotPasswordError}
        </div>
      )}
      {forgotPasswordSent && (
        <div className='text-green-600 text-sm text-center'>
          {t('login.forgot_password_sent', 'Password reset instructions sent!')}
        </div>
      )}
      <button
        type='submit'
        className='mt-2 bg-[#94bf43] text-white font-semibold py-2 rounded hover:bg-[#829e4d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:cursor-pointer'
        disabled={loading || !email.trim()}
      >
        {loading
          ? t('login.sending', 'Sending...')
          : t('login.send_reset_link', 'Send Reset Link')}
      </button>
    </form>
  )
}
