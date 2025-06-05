import { useForm } from 'react-hook-form'
import { CreatePolicyBody } from '../../interfaces/policies/policies.interface'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCreatePolicy } from '../../api/policies/useCreatePolicy'
import { useEffect } from 'react'
import { useGetPolicies } from '../../api/policies/useGetPolicies'
import { useUpdatePolicy } from '../../api/policies/useUpdatePolicy'

export const usePolicyForm = ({
  onClose,
  policyId
}: {
  policyId?: string
  onClose: () => void
}) => {
  const policiesData = useGetPolicies()
  const { mutateAsync: mutateCreate } = useCreatePolicy()
  const { mutateAsync: mutateEdit } = useUpdatePolicy()

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    action: yup.string().required('Action is required'),
    policy_constraints: yup.object().shape({
      type: yup.string().required('Type is required'),
      value: yup.string().required('Value is required'),
      operator: yup.string().required('Operator is required')
    })
  })

  const createPolicyForm = useForm<CreatePolicyBody>({
    defaultValues: {
      name: '',
      action: '',
      policy_constraints: {
        type: '',
        value: '',
        operator: ''
      }
    },
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (policyId) {
      const existingPolicy = policiesData.data?.find(
        (policy) => policy.policy_id === policyId
      )
      if (existingPolicy) {
        createPolicyForm.reset({
          name: existingPolicy.name,
          action: existingPolicy.action,
          policy_constraints: {
            type: existingPolicy.policy_constraints[0]?.type,
            value: existingPolicy.policy_constraints[0]?.value,
            operator: existingPolicy.policy_constraints[0]?.operator
          }
        })
        // return {
        //   name: existingPolicy.name,
        //   action: existingPolicy.action,
        //   policy_constraints: {
        //     type: existingPolicy.policy_constraints.type,
        //     value: existingPolicy.policy_constraints.value,
        //     operator: existingPolicy.policy_constraints.operator
        //   }
        // }
      }
      console.warn(`Policy with id ${policyId} not found`)
    } else {
      createPolicyForm.reset({
        name: '',
        action: '',
        policy_constraints: {
          type: '',
          value: '',
          operator: ''
        }
      })
    }
  }, [policyId, policiesData.data])

  const onSubmit = async (
    data: CreatePolicyBody,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.stopPropagation()
    console.log({ data }, { event })
    if (policyId) {
      // If policyId is provided, update the existing policy
      await mutateEdit({ policyId: policyId, newPolicyData: data })
    } else {
      await mutateCreate({ policyData: data })
    }
    onClose() // Close the modal after submission
  }

  return { createPolicyForm, onSubmit }
}
