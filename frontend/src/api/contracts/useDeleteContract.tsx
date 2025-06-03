import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuthUser } from '../../contexts/UserContext'
import { Contract } from '../../interfaces/contracts/contracts.interface'
import { toast } from 'sonner'

const handleDeleteContract = async ({ contractId }: { contractId: string }) => {
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({
      type: 'DELETE',
      url: `/v1/contracts/${contractId}`
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const url = `http://localhost:8083`
  await fetch(url, requestOptions)
  return { contractId }
}

export const useDeleteContract = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { user } = useAuthUser()

  const mutation = useMutation({
    mutationFn: handleDeleteContract,
    mutationKey: ['deleteContract'],
    onMutate: async ({ contractId }) => {
      await queryClient.cancelQueries({ queryKey: ['contracts', user?.userId] })
      const previousContracts = queryClient.getQueryData<Contract[]>([
        'contracts',
        user?.userId
      ])
      queryClient.setQueryData<Contract[]>(['contracts', user?.userId], (old) =>
        (old ?? []).filter((a) => a.contract_id !== contractId)
      )
      return { previousContracts }
    },
    onError: (err, _, context) => {
      console.error('Error deleting contract:', err)
      if (context?.previousContracts) {
        queryClient.setQueryData(
          ['contracts', user?.userId],
          context.previousContracts
        )
      }
      toast.error(t('contract_deletion_error', 'Contract deletion failed'))
    },
    onSuccess: () => {
      toast.success(
        t('contract_deleted_successfully', 'Contract deleted successfully')
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts', user?.userId] })
    }
  })

  return mutation
}
