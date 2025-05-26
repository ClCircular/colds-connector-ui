import { useEffect, useState } from 'react'
import { useLogin } from '../../hooks/login/useLogin'

interface ConfirmNewPasswordProps {
  setNextStep: (step: any) => void
}

export const ConfirmNewPassword: React.FC<ConfirmNewPasswordProps> = ({
  setNextStep
}) => {
  const { t, handleForceResetPassword, loading, isError } = useLogin()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (isError) setLocalError(isError)
  }, [isError])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError(null)
    if (!newPassword || !confirmPassword) {
      setLocalError(t('login.password_required', 'Password is required'))
      return
    }
    if (newPassword !== confirmPassword) {
      setLocalError(t('login.passwords_do_not_match', 'Passwords do not match'))
      return
    }
    handleForceResetPassword(e, newPassword, setNextStep)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white p-8 rounded-lg shadow-md flex flex-col gap-4 w-full max-w-md'
    >
      <h2 className='text-2xl font-bold mb-4 text-center'>
        {t('login.set_new_password', 'Set New Password')}
      </h2>
      <div className='flex flex-col gap-1'>
        <label
          htmlFor='new-password'
          className='text-sm font-medium text-gray-700'
        >
          {t('login.new_password', 'New Password')}
        </label>
        <input
          id='new-password'
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
          htmlFor='confirm-password'
          className='text-sm font-medium text-gray-700'
        >
          {t('login.confirm_password', 'Confirm Password')}
        </label>
        <input
          id='confirm-password'
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
      {localError && (
        <div className='text-red-600 text-sm text-center'>{localError}</div>
      )}
      <button
        type='submit'
        className='mt-2 bg-[#94bf43] text-white font-semibold py-2 rounded hover:bg-[#829e4d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:cursor-pointer'
        disabled={loading}
      >
        {loading
          ? t('login.saving', 'Saving...')
          : t('login.save_new_password', 'Save New Password')}
      </button>
    </form>
  )
}
