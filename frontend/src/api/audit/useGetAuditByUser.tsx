import { useQuery } from '@tanstack/react-query'
import { useAuthUser } from '../../contexts/UserContext'
import { AuditEntry } from '../../interfaces/audit/audit.interface'

const handleGetAuditByUser = async (
  userEmail: string
): Promise<AuditEntry[]> => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'GET',
      url: `/v1/audit/user/${userEmail}`
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `https://0bfzsz9z0c.execute-api.us-east-1.amazonaws.com`
  const response = await fetch(url, requestOptions)
  const data = await response.json()
  return data as AuditEntry[]
}

export const useGetAuditByUser = () => {
  const { user, userInfo } = useAuthUser()
  return useQuery({
    queryKey: ['audit', user?.userId],
    queryFn: () => handleGetAuditByUser(userInfo?.email ?? ''),
    enabled: !!user?.userId,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60
  })
}
