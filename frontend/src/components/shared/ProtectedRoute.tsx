// components/ProtectedRoute.tsx
import { ComponentType } from 'react'
import { MainLayout } from '../../layout/MainLayout'
import { useLocation } from 'wouter'
import { useAuthUser } from '../../contexts/UserContext'

interface ProtectedRouteProps {
  Component: ComponentType<any>
  props?: any
}

export const ProtectedRoute = ({ Component, props }: ProtectedRouteProps) => {
  const { user } = useAuthUser()

  if (!user) {
    const [, navigate] = useLocation()
    navigate('/login')
    return null
  }
  return (
    <MainLayout>
      <Component {...props} />
    </MainLayout>
  )
}
