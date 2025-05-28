import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
  getCurrentUser
} from '@aws-amplify/auth'

type User = Awaited<ReturnType<typeof getCurrentUser>> | null

interface UserContextType {
  user: User
  userInfo: FetchUserAttributesOutput | undefined
  loading: boolean
  error: any
  refreshUser: () => Promise<void>
  resetContext: () => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  userInfo: undefined,
  refreshUser: async () => {},
  resetContext: () => {}
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null)
  const [userInfo, setUserInfo] = useState<FetchUserAttributesOutput>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const [currentUser, attributes] = await Promise.all([
        getCurrentUser(),
        fetchUserAttributes()
      ])
      console.log('Current User:', currentUser)
      setUser(currentUser)
      setUserInfo(attributes)
    } catch (err) {
      setUser(null)
      setUserInfo(undefined)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const resetContext = () => {
    setUser(null)
    setUserInfo(undefined)
    setLoading(true)
    setError(null)
  }

  useEffect(() => {
    void fetchUser()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        userInfo,
        refreshUser: fetchUser,
        resetContext
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useAuthUser = () => useContext(UserContext)
