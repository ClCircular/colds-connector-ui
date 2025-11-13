import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Policy } from '../../interfaces/policies/policies.interface'

const handleDeletePolicy = async ({
  policyId,
  userEmail
}: {
  policyId: string
  userEmail: string
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'DELETE',
      url: `/v1/policies/${policyId}`
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `https://0bfzsz9z0c.execute-api.us-east-1.amazonaws.com/v1/`
  await fetch(url, requestOptions)
  return { policyId }
}

export const useDeletePolicy = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { user, userInfo } = useAuthUser()

  return useMutation({
    mutationFn: ({ policyId }: { policyId: string }) =>
      handleDeletePolicy({ policyId, userEmail: userInfo?.email || '' }),
    mutationKey: ['deletePolicy'],
    onMutate: async ({ policyId }) => {
      await queryClient.cancelQueries({ queryKey: ['policies', user?.userId] })
      const previousPolicies = queryClient.getQueryData<Policy[]>([
        'policies',
        user?.userId
      ])
      queryClient.setQueryData<Policy[]>(['policies', user?.userId], (old) =>
        (old ?? []).filter((p) => p.policy_id !== policyId)
      )
      return { previousPolicies }
    },
    onError: (err, _, context) => {
      console.error('Error deleting policy:', err)
      if (context?.previousPolicies) {
        queryClient.setQueryData(
          ['policies', user?.userId],
          context.previousPolicies
        )
      }
      toast.error(t('policy_deletion_error', 'Policy deletion failed'))
    },
    onSuccess: () => {
      toast.success(
        t('policy_deleted_successfully', 'Policy deleted successfully')
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['policies', user?.userId] })
    }
  })
}
