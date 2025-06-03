import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Contract,
  CreateContractBody,
  CreateContractResponse
} from '../../interfaces/contracts/contracts.interface'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import dayjs from 'dayjs'
import { toast } from 'sonner'

const handleCreateContract = async ({
  contractData
}: {
  contractData: CreateContractBody
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'POST',
      url: '/v1/contracts',
      body: JSON.stringify(contractData)
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
  return data as CreateContractResponse
}

export const useCreateContract = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation() // Ensure the translation function is initialized

  const { user } = useAuthUser() // Ensure the user context is initialized

  const mutation = useMutation({
    mutationFn: handleCreateContract,
    mutationKey: ['createContract'],
    onMutate: async ({ contractData }) => {
      await queryClient.cancelQueries({ queryKey: ['contracts', user?.userId] })
      const previousContracts = queryClient.getQueryData<Contract[]>([
        'contracts',
        user?.userId
      ])

      // Generamos una "fake" contract para mostrar inmediatamente
      const now = dayjs().toDate()
      const optimisticContract = {
        contract_id: 'temp-id-' + Date.now(),
        created_at: now,
        updated_at: now,
        ...contractData
      }

      queryClient.setQueryData<Contract[]>(
        ['contracts', user?.userId],
        (oldData) => [...(oldData ?? []), optimisticContract]
      )

      return { previousContracts, optimisticContract }
    },
    onError: (error, _, context) => {
      console.log({ error })
      if (context?.previousContracts) {
        queryClient.setQueryData(
          ['contracts', user?.userId],
          context?.previousContracts
        )
      }
      toast.error(t('contract_creation_error'))
    },
    // onSuccess: () => {
    //   toast.success(t('asset_created_successfully'))
    //   queryClient.invalidateQueries({ queryKey: ['assets', user?.userId] })
    // }

    onSuccess: (data, _, context) => {
      // data es tu PolicyCreateResponse
      // Actualiza la caché con la política real que vino de la API
      queryClient.setQueryData<Contract[]>(
        ['contracts', user?.userId],
        (old) => {
          return (
            old
              // quitamos la temporal
              ?.filter(
                (p) => p.contract_id !== context?.optimisticContract.contract_id
              )
              // añadimos la real
              .concat(data.data)
          )
        }
      )
      toast.success(
        t('contract_created_successfully', 'Contract created successfully')
      )
    },
    // 4) Opcional: invalidar para sincronizar
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts', user?.userId] })
    }
  })
  return mutation
}
