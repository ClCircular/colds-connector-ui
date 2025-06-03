import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useGetContracts } from '../../api/contracts/useGetContracts'
import { useGetAssets } from '../../api/assets/useGetAssets'
import { useGetPolicies } from '../../api/policies/useGetPolicies'
import { useTranslation } from 'react-i18next'
import { createColumnHelper } from '@tanstack/react-table'
import { ContractRow } from '../../interfaces/contracts/contracts.interface'
import { MdEdit } from 'react-icons/md'
import { IoTrash } from 'react-icons/io5'
import { useDeleteContract } from '../../api/contracts/useDeleteContract'

export const useContractsTable = (
  setOpen: Dispatch<SetStateAction<boolean>>
) => {
  const [contractId, setContractId] = useState('')
  const contractsData = useGetContracts()
  const assetsData = useGetAssets()
  const policiesData = useGetPolicies()

  const { mutate } = useDeleteContract()

  const { t } = useTranslation()

  const handleDeleteContract = (contractId: string) => {
    const contractName = contractsData.data?.find(
      (contract) => contract.contract_id === contractId
    )?.name

    const response = confirm(
      `Are you sure you want to delete the contract with name: ${contractName}?`
    )
    if (response) {
      // Call the delete contract mutation here
      mutate({ contractId })
      console.log(`Contract with ID ${contractId} deleted.`)
    }
  }

  const columnHelper = createColumnHelper<ContractRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('name'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('accessPolicyName', {
        header: t('access_policy'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('contractPolicyName', {
        header: t('contract_policy'),
        cell: (info) => info.getValue()
      }),

      columnHelper.accessor('assetName', {
        header: t('asset'),
        cell: (info) => info.getValue()
      }),
      columnHelper.display({
        id: 'actions',
        header: t('actions'),
        cell: (info) => {
          const id = info.row.original.id
          console.log({ id })
          return (
            <div className='flex space-x-2 items-center justify-center'>
              {/* Add action buttons here, e.g., Edit, Delete */}
              <button
                className='text-blue-500 hover:bg-slate-100 transition-colors rounded-full p-3 cursor-pointer'
                onClick={() => {
                  setOpen(true)
                  setContractId(id)
                }}
              >
                <MdEdit className='size-6' />
              </button>
              <button
                className='text-red-500 hover:bg-slate-100 transition-colors rounded-full p-3 cursor-pointer'
                onClick={() => handleDeleteContract(id)}
              >
                <IoTrash className='size-6' />
              </button>
            </div>
          )
        }
      })
    ],
    [t]
  )

  const rows = useMemo(() => {
    return (
      contractsData.data?.map((contract) => {
        const policyName = policiesData.data?.find(
          (policy) => policy.policy_id === contract.access_policy_id
        )?.name
        const assetName = assetsData.data?.find(
          (asset) => asset.asset_id === contract.asset_id
        )?.name
        return {
          id: contract.contract_id,
          name: contract.name,
          accessPolicyName: policyName || 'N/A',
          contractPolicyName: policyName || 'N/A',
          assetName: assetName || 'N/A'
        }
      }) || []
    )
  }, [contractsData.data, assetsData.data, policiesData.data])

  return {
    columns,
    rows,
    contractId,
    setContractId,
    isLoading:
      contractsData.isLoading || assetsData.isLoading || policiesData.isLoading
  }
}
