import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreatePolicyBody,
  Policy
} from '../../interfaces/policies/policies.interface'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'

const handleUpdatePolicy = async ({
  newPolicyData,
  policyId,
  userEmail
}: {
  policyId: string
  newPolicyData: CreatePolicyBody
  userEmail: string
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'PUT',
      url: `/v1/policies/${policyId}`,
      body: {
        ...newPolicyData,
        policy_constraints: [newPolicyData.policy_constraints]
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-User-Email': userEmail
    }
  }
  const url = `https://0bfzsz9z0c.execute-api.us-east-1.amazonaws.com`
  await fetch(url, requestOptions)
  return { policyId, newPolicyData }
}

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { user, userInfo } = useAuthUser()

  const mutation = useMutation({
    mutationFn: ({
      policyId,
      newPolicyData
    }: {
      policyId: string
      newPolicyData: CreatePolicyBody
    }) =>
      handleUpdatePolicy({
        policyId,
        newPolicyData,
        userEmail: userInfo?.email || ''
      }),
    mutationKey: ['updatePolicy'],
    onMutate: async ({ policyId, newPolicyData }) => {
      await queryClient.cancelQueries({ queryKey: ['policies', user?.userId] })
      const previousPolicies = queryClient.getQueryData<CreatePolicyBody[]>([
        'policies',
        user?.userId
      ])
      queryClient.setQueryData<Policy[]>(['policies', user?.userId], (old) =>
        (old ?? []).map((p) =>
          p.policy_id === policyId
            ? {
                ...p,
                ...newPolicyData,
                policy_constraints: [newPolicyData.policy_constraints]
              }
            : p
        )
      )
      return { previousPolicies }
    },
    onError: (err, _, context) => {
      console.error('Error updating policy:', err)
      if (context?.previousPolicies) {
        queryClient.setQueryData(
          ['policies', user?.userId],
          context.previousPolicies
        )
      }
      toast.error(t('policy_update_error', 'Policy update failed'))
    },
    onSuccess: () => {
      toast.success(
        t('policy_updated_successfully', 'Policy updated successfully')
      )
    }
  })
  return mutation
}
