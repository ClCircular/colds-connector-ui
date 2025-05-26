import { LangSwitch } from '../components/shared/LangSwitch'
import { LoginCard } from '../components/login/LoginCard'

export const LoginPage: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center relative min-h-screen bg-gray-100 background-login'>
      <img
        src='/assets/Logo-clcircular.svg'
        className='h-15 absolute top-7 left-7'
      />
      <div className='absolute top-7 right-7 bg-white px-2 py-4 rounded-lg shadow-md'>
        <LangSwitch />
      </div>
      <LoginCard />
    </div>
  )
}
