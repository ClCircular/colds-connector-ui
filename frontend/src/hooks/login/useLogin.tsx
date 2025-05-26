import { useState } from 'react'
import { toast } from 'sonner'
import { signIn, confirmSignIn, resetPassword } from 'aws-amplify/auth'
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
  const [isInComponentSendCode, setIsInComponentSendCode] = useState(false)
  const [isInComponentConfirmNewPassword, setIsInComponentConfirmNewPassword] =
    useState(false)
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(
    null
  )
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)

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
        toast.success(t('login.toast_signin_success', 'Signed in successfully'))
        setLoading(false)
        setNextStep(null)
      } else if (
        signInNextStep &&
        signInNextStep.signInStep ===
          'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
      ) {
        setNextStep(signInNextStep)
        setLoading(false)
        toast.info(t('login.toast_force_reset', 'You must set a new password'))
      } else {
        setIsError('Unknown sign-in step')
        setLoading(false)
        toast.error(t('login.toast_unknown_step', 'Unknown sign-in step'))
      }
    } catch (error) {
      setIsError((error as { message: string }).message)
      setLoading(false)
      toast.error(
        (error as { message: string }).message ||
          t('login.toast_signin_error', 'Error signing in')
      )
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
        toast.success(
          t('login.toast_password_changed', 'Password changed successfully')
        )
      } else if (signInNextStep) {
        setNextStepCb(signInNextStep)
        toast.info(t('login.toast_next_step', 'Continue with the next step'))
      }
    } catch (error) {
      setIsError((error as { message: string }).message)
      toast.error(
        (error as { message: string }).message ||
          t('login.toast_password_change_error', 'Error changing password')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setLoading(true)
    setForgotPasswordSent(false)
    setForgotPasswordError(null)
    try {
      await resetPassword({
        username: email
      })
      setForgotPasswordSent(true)
      setLoading(false)
      setIsInComponentSendCode(false)
      toast.success(
        t(
          'login.toast_forgot_password_sent',
          'Password reset code sent to your email'
        )
      )
    } catch (error) {
      setForgotPasswordError((error as { message: string }).message)
      setLoading(false)
      toast.error(
        (error as { message: string }).message ||
          t(
            'login.toast_forgot_password_error',
            'Error sending password reset code'
          )
      )
    }
  }

  const resetStates = () => {
    setEmail('')
    setPassword('')
    setIsSignedIn(false)
    setIsError(null)
    setLoading(false)
    setNextStep(null)
    setIsInComponentSendCode(false)
    setIsInComponentConfirmNewPassword(false)
    setForgotPasswordError(null)
    setForgotPasswordSent(false)
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
    setLoading,
    isSignedIn,
    isError,
    nextStep,
    setNextStep,
    handleForgotPassword,
    forgotPasswordError,
    forgotPasswordSent,
    isInComponentSendCode,
    setIsInComponentSendCode,
    isInComponentConfirmNewPassword,
    setIsInComponentConfirmNewPassword,
    setIsError,
    resetStates
  }
}
