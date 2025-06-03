import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreatePolicyBody,
  Policy,
  PolicyCreateResponse
} from '../../interfaces/policies/policies.interface'
import { useAuthUser } from '../../contexts/UserContext'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const handleCreatePolicy = async ({
  policyData
}: {
  policyData: CreatePolicyBody
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: '/v1/policies',
      body: JSON.stringify(policyData)
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:8083`

  console.log({ url, requestOptions })
  const response = await fetch(url, requestOptions)
  console.log({ response })
  const data = (await response.json()) || {}
  console.log({ data })
  return data as PolicyCreateResponse
}

export const useCreatePolicy = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation() // Ensure the translation function is initialized

  const { user } = useAuthUser() // Ensure the user context is initialized

  const mutation = useMutation({
    mutationFn: handleCreatePolicy,
    mutationKey: ['createPolicy'],
    onMutate: async ({ policyData }) => {
      await queryClient.cancelQueries({ queryKey: ['policies', user?.userId] })
      const previousPolicies = queryClient.getQueryData([
        'policies',
        user?.userId
      ])

      // Generamos una "fake" policy para mostrar inmediatamente
      const optimisticPolicy: Policy = {
        policy_id: 'temp-id-' + Date.now(),
        created_at: dayjs().toDate(),
        ...policyData
      }

      queryClient.setQueryData<Policy[]>(['policies', user?.userId], (old) => [
        ...(old ?? []),
        optimisticPolicy
      ])

      return { previous: previousPolicies, optimisticPolicy }
    },
    onError: (err, __, context) => {
      console.error({ err })
      if (context?.previous) {
        queryClient.setQueryData(['policies', user?.userId], context.previous)
      }
      toast.error(t('policy_creation_error', 'Policy creation failed'))
    },
    // 3) Al terminar (OK), reemplazamos el optimistic con el real
    onSuccess: (data, _, context) => {
      // data es tu PolicyCreateResponse
      // Actualiza la caché con la política real que vino de la API
      queryClient.setQueryData<Policy[]>(['policies', user?.userId], (old) => {
        return (
          old
            // quitamos la temporal
            ?.filter((p) => p.policy_id !== context?.optimisticPolicy.policy_id)
            // añadimos la real
            .concat(data.data)
        )
      })
      toast.success(
        t('policy_created_successfully', 'Policy created successfully')
      )
    },
    // 4) Opcional: invalidar para sincronizar
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['policies', user?.userId] })
    }
  })

  return mutation
}
