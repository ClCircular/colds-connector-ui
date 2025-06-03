import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Contract,
  CreateContractBody
} from '../../interfaces/contracts/contracts.interface'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import { toast } from 'sonner'

const handleUpdateContract = async ({
  newContractData,
  contractId
}: {
  contractId: string
  newContractData: CreateContractBody
}) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'PUT',
      url: `/v1/contracts/${contractId}`,
      body: newContractData
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:8083`
  await fetch(url, requestOptions)
  return { contractId, newContractData }
}

export const useUpdateContract = () => {
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { user } = useAuthUser()

  const mutation = useMutation({
    mutationFn: handleUpdateContract,
    mutationKey: ['updateContract'],
    onMutate: async ({ contractId, newContractData }) => {
      await queryClient.cancelQueries({ queryKey: ['contracts', user?.userId] })
      const previousContracts = queryClient.getQueryData<CreateContractBody[]>([
        'contracts',
        user?.userId
      ])
      queryClient.setQueryData<Contract[]>(['contracts', user?.userId], (old) =>
        (old ?? []).map((p) =>
          p.contract_id === contractId ? { ...p, ...newContractData } : p
        )
      )
      return { previousContracts }
    },
    onError: (err, _, context) => {
      console.error('Error updating contract:', err)
      if (context?.previousContracts) {
        queryClient.setQueryData(
          ['contracts', user?.userId],
          context.previousContracts
        )
      }
      toast.error(t('contract_update_error', 'Contract update failed'))
    },
    onSuccess: () => {
      toast.success(
        t('contract_updated_successfully', 'Contract updated successfully')
      )
    }
  })
  return mutation
}
