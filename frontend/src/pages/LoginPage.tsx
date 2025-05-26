import { LangSwitch } from '../components/shared/LangSwitch'
import { LoginCard } from '../components/login/LoginCard'
import { ConfirmNewPassword } from '../components/login/ConfirmNewPassword'
import { useLogin } from '../hooks/login/useLogin'
import { useAuthUser } from '../contexts/UserContext'
import { useLocation } from 'wouter'

export const LoginPage: React.FC = () => {
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
      {login.nextStep &&
      login.nextStep.signInStep ===
        'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED' ? (
        <ConfirmNewPassword setNextStep={login.setNextStep} />
      ) : (
        <LoginCard login={login} />
      )}
    </div>
  )
}
