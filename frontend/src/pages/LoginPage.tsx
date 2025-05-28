import { LangSwitch } from '../components/shared/LangSwitch'
import { LoginCard } from '../components/login/LoginCard'
import { ConfirmNewPassword } from '../components/login/ConfirmNewPassword'
import { useLogin } from '../hooks/login/useLogin'
import { useAuthUser } from '../contexts/UserContext'
import { useLocation } from 'wouter'
import { useTranslation } from 'react-i18next'
import { ForgotPassword } from '../components/login/ForgotPassword'
import { ResetPasswordCode } from '../components/login/ResetPasswordCode'

export const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const login = useLogin()
  const [, setLocation] = useLocation()
  // redirect if user is already logged in
  const user = useAuthUser()
  if (user.user) {
    setLocation('/') // Redirect to home page if user is logged in
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
      <article className='bg-white p-8 rounded-lg shadow-md flex flex-col gap-4 w-full max-w-md'>
        {login.nextStep &&
        login.nextStep.signInStep ===
          'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED' ? (
          <ConfirmNewPassword setNextStep={login.setNextStep} />
        ) : login.isInComponentSendCode ? (
          <ForgotPassword login={login} />
        ) : login.forgotPasswordSent ? (
          <ResetPasswordCode login={login} />
        ) : (
          <LoginCard login={login} />
        )}{' '}
        {/* Divider */}
        <div
          className={`flex items-center my-2 ${
            login.forgotPasswordSent ? 'hidden' : ''
          }`}
        >
          <div className='flex-grow h-px bg-gray-200' />
          <span className='mx-2 text-gray-400 text-xs'>{t('or')}</span>
          <div className='flex-grow h-px bg-gray-200' />
        </div>
        {/* Forgot Password Button */}
        <button
          type='button'
          className={`text-sm text-[#94bf43] hover:underline focus:outline-none cursor-pointer ${
            login.forgotPasswordSent ? 'hidden' : ''
          }`}
          onClick={() =>
            login.setIsInComponentSendCode(!login.isInComponentSendCode)
          }
        >
          {login.isInComponentSendCode
            ? t('login.back_to_login', 'Back to Login')
            : t('login.forgot_your_password', 'Forgot your password?')}
        </button>
      </article>
    </div>
  )
}
