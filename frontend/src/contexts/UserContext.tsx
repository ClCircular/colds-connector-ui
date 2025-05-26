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
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  userInfo: undefined,
  refreshUser: async () => {}
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null)
  const [userInfo, setUserInfo] = useState<FetchUserAttributesOutput>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const [currentUser, userAttributes] = await Promise.all([
  //         getCurrentUser(),
  //         fetchUserAttributes()
  //       ])
  //       setUser(currentUser)
  //       setUserInfo(userAttributes)
  //     } catch (err) {
  //       setUser(null)
  //       setUserInfo(undefined)
  //       setError(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchUser()
  // }, [])

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

  useEffect(() => {
    void fetchUser()
  }, [])

  return (
    <UserContext.Provider
      value={{ user, loading, error, userInfo, refreshUser: fetchUser }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useAuthUser = () => useContext(UserContext)
