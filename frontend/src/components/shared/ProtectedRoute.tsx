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
  const [location, setLocation] = useLocation()

  // Only redirect from /login to / if authenticated and not loading
  useEffect(() => {
    if (!loading && user && location === '/login') {
      setLocation('/')
    }
  }, [loading, user, location, setLocation])

  if (loading) {
    // Evita el "flash" de login
    return (
      <div className='flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-[100]'>
        <Loader />
      </div>
    )
  }

  // If not authenticated and not loading, redirect to /login (unless already there)
  if (!user && location !== '/login') {
    setLocation('/login')
    return null
  }

  // If on /login and not authenticated, don't render the protected content
  if (!user && location === '/login') {
    return null
  }

  return (
    <MainLayout>
      <Component {...props} />
    </MainLayout>
  )
}
