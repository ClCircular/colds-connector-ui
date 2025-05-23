// components/ProtectedRoute.tsx
import { ComponentType } from 'react'
import { MainLayout } from '../../layout/MainLayout'
import { useLocation } from 'wouter'

interface ProtectedRouteProps {
  Component: ComponentType<any>
  props?: any
}

export const ProtectedRoute = ({ Component, props }: ProtectedRouteProps) => {
  const isAuthenticated = false /* tu lógica */

  if (!isAuthenticated) {
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
