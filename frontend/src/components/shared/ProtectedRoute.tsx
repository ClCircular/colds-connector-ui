// components/ProtectedRoute.tsx
import { ComponentType, useEffect } from 'react'
import { MainLayout } from '../../layout/MainLayout'
import { useLocation } from 'wouter'
import { useAuthUser } from '../../contexts/UserContext'
import { Loader } from './Loader'

interface ProtectedRouteProps {
  Component: ComponentType<any>
  props?: any
}

export const ProtectedRoute = ({ Component, props }: ProtectedRouteProps) => {
  const { user, loading } = useAuthUser()
  const [, setLocation] = useLocation()
  // Solo intentamos redirigir una vez que sepamos que ya cargó el user
  useEffect(() => {
    if (!loading && user) {
      setLocation('/')
    }
  }, [loading, user, setLocation])

  if (loading) {
    // Evita el "flash" de login
    return (
      <div className='flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-[100]'>
        <Loader />
      </div>
    )
  }

  if (!user) {
    setLocation('/login')
    return null
  }
  return (
    <MainLayout>
      <Component {...props} />
    </MainLayout>
  )
}
