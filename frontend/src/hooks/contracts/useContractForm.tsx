import { useForm } from 'react-hook-form'
import { useCreateContract } from '../../api/contracts/useCreateContract'
import { useUpdateContract } from '../../api/contracts/useUpdateContract'
import { CreateContractBody } from '../../interfaces/contracts/contracts.interface'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo } from 'react'
import { useGetContracts } from '../../api/contracts/useGetContracts'
import { useGetPolicies } from '../../api/policies/useGetPolicies'
import { useGetAssets } from '../../api/assets/useGetAssets'

export const useContractForm = ({
  onClose,
  contractId
}: {
  contractId?: string
  onClose: () => void
}) => {
  const contractsData = useGetContracts()
  const policiesData = useGetPolicies()
  const assetsData = useGetAssets()
  const { mutateAsync: createContract } = useCreateContract()
  const { mutateAsync: updateContract } = useUpdateContract()

  const { t } = useTranslation()

  const schema = yup.object().shape({
    name: yup.string().required(t('name_required')),
    access_policy_id: yup.string().required(t('access_policy_required')),
    contract_policy_id: yup.string().required(t('contract_policy_required')),
    asset_id: yup.string().required(t('asset_required'))
  })

  const createContractForm = useForm<CreateContractBody>({
    defaultValues: {
      name: '',
      access_policy_id: '',
      contract_policy_id: '',
      asset_id: ''
    },
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (contractId) {
      const existingContract = contractsData.data?.find(
        (contract) => contract.contract_id === contractId
      )
      if (existingContract) {
        createContractForm.reset({
          name: existingContract.name,
          access_policy_id: existingContract.access_policy_id,
          contract_policy_id: existingContract.contract_policy_id,
          asset_id: existingContract.asset_id
        })
      }
    } else {
      createContractForm.reset({
        name: '',
        access_policy_id: '',
        contract_policy_id: '',
        asset_id: ''
      })
    }
  }, [contractId, contractsData.data])

  const onSubmit = async (
    data: CreateContractBody,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.stopPropagation()
    if (contractId) {
      await updateContract({ contractId, newContractData: data })
    } else {
      await createContract({ contractData: data })
    }
    onClose()
  }

  const assetsOptionsForSelect = useMemo(() => {
    return assetsData.data?.map((asset) => ({
      value: asset.asset_id,
      label: asset.name
    }))
  }, [assetsData.data])

  const policiesOptionsForSelect = useMemo(() => {
    return policiesData.data?.map((policy) => ({
      value: policy.policy_id,
      label: policy.name
    }))
  }, [policiesData.data])

  return {
    createContractForm,
    onSubmit,
    assetsOptionsForSelect,
    policiesOptionsForSelect
  }
}
