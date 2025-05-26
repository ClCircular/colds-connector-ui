import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function useLogin() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    alert(`${t('login.email')}: ${email}\n${t('login.password')}: ${password}`)
  }

  return {
    t,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit
  }
}
