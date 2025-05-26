import { useState } from 'react'
import { signIn, confirmSignIn } from 'aws-amplify/auth'
import { useTranslation } from 'react-i18next'

export function useLogin() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isError, setIsError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [nextStep, setNextStep] = useState<any>(null)

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
      console.log('signInNextStep', signInNextStep)
      if (isSignedIn) {
        setIsSignedIn(true)
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
