import { confirmResetPassword } from 'aws-amplify/auth'
import { FC, useState } from 'react'

interface ResetPasswordCodeProps {
  login: ReturnType<typeof import('../../hooks/login/useLogin').useLogin>
}

export const ResetPasswordCode: FC<ResetPasswordCodeProps> = ({ login }) => {
  const { t, loading, email, setLoading, setIsError, isError, resetStates } =
    login
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)

  // Placeholder for actual confirmResetPassword logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsError(null)
    setSuccess(false)
    setLoading(true)
    if (!code || !newPassword || !confirmPassword) {
      setIsError(t('login.all_fields_required', 'All fields are required'))
      return
    }
    if (newPassword !== confirmPassword) {
      setIsError(t('login.passwords_do_not_match', 'Passwords do not match'))
      return
    }
    try {
      // await confirmResetPassword({ username: email, confirmationCode: code, newPassword })
      await confirmResetPassword({
        username: email,
        confirmationCode: code.trim(),
        newPassword: newPassword.trim()
      })
      setSuccess(true)
      resetStates() // Reset states after successful password reset
    } catch (err: any) {
      setIsError(err.message || 'Error resetting password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold mb-4 text-center'>
        {t('login.reset_password', 'Reset Password')}
      </h2>
      <div className='flex flex-col gap-1'>
        <label
          htmlFor='reset-code'
          className='text-sm font-medium text-gray-700'
        >
          {t('login.reset_code', 'Reset Code')}
        </label>
        <input
          id='reset-code'
          type='text'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          placeholder={t(
            'login.reset_code_placeholder',
            'Enter the code sent to your email'
          )}
          className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      <div className='flex flex-col gap-1'>
        <label
          htmlFor='reset-new-password'
          className='text-sm font-medium text-gray-700'
        >
          {t('login.new_password', 'New Password')}
        </label>
        <input
          id='reset-new-password'
          type='password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder={t(
            'login.new_password_placeholder',
            'Enter new password'
          )}
          className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      <div className='flex flex-col gap-1'>
        <label
          htmlFor='reset-confirm-password'
          className='text-sm font-medium text-gray-700'
        >
          {t('login.confirm_password', 'Confirm Password')}
        </label>
        <input
          id='reset-confirm-password'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder={t(
            'login.confirm_password_placeholder',
            'Confirm new password'
          )}
          className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      {isError && (
        <div className='text-red-600 text-sm text-center'>{isError}</div>
      )}
      {success && (
        <div className='text-green-600 text-sm text-center'>
          {t('login.password_reset_success', 'Password reset successfully!')}
        </div>
      )}
      <button
        type='submit'
        className='mt-2 bg-[#94bf43] text-white font-semibold py-2 rounded hover:bg-[#829e4d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:cursor-pointer'
        disabled={
          loading ||
          !code.trim() ||
          !newPassword.trim() ||
          !confirmPassword.trim()
        }
      >
        {loading
          ? t('login.saving', 'Saving...')
          : t('login.save_new_password', 'Save New Password')}
      </button>
    </form>
  )
}
