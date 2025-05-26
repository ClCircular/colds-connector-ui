import { useState } from 'react'
import { signIn, confirmSignIn } from 'aws-amplify/auth'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import { useAuthUser } from '../../contexts/UserContext'

export function useLogin() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isError, setIsError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [nextStep, setNextStep] = useState<any>(null)

  const [, setLocation] = useLocation()
  const { refreshUser } = useAuthUser() // Ensure the user context is initialized

  const handleSignIn = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    setLoading(true)
    setIsError(null)
    const emailPattern = '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
    if (!email.match(emailPattern)) {
      setIsError('Invalid email')
      setLoading(false)
      return
    }
    try {
      const { isSignedIn, nextStep: signInNextStep } = await signIn({
        username: email,
        password
      })
      console.log({ isSignedIn, signInNextStep })
      if (isSignedIn) {
        await refreshUser() // Refresh user context after sign-in
        console.log('User signed in successfully')
        setIsSignedIn(true)
        setLocation('/')
        console.log('Aqui deberia navegar a /')
        setLoading(false)
        setNextStep(null)
      } else if (
        signInNextStep &&
        signInNextStep.signInStep ===
          'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
      ) {
        setNextStep(signInNextStep)
        setLoading(false)
      } else {
        setIsError('Unknown sign-in step')
        setLoading(false)
      }
    } catch (error) {
      setIsError((error as { message: string }).message)
      setLoading(false)
    }
  }

  const handleForceResetPassword = async (
    e: React.FormEvent<HTMLFormElement>,
    newPassword: string,
    setNextStepCb: (step: any) => void
  ) => {
    e.preventDefault()
    setLoading(true)
    setIsError(null)
    try {
      const { isSignedIn, nextStep: signInNextStep } = await confirmSignIn({
        challengeResponse: newPassword
      })
      if (isSignedIn) {
        setIsSignedIn(true)
        setNextStepCb(null)
      } else if (signInNextStep) {
        setNextStepCb(signInNextStep)
      }
    } catch (error) {
      setIsError((error as { message: string }).message)
    } finally {
      setLoading(false)
    }
  }

  return {
    t,
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
    handleForceResetPassword,
    loading,
    isSignedIn,
    isError,
    nextStep,
    setNextStep
  }
}
