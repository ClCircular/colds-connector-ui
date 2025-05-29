import { useForm } from 'react-hook-form'
import { CreatePolicyBody } from '../../interfaces/policies/policies.interface'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

export const useCreatePolicyForm = () => {
  //   const { mutate } = useCreateContractWithRule()

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

  const onSubmit = async (
    data: CreatePolicyBody,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.stopPropagation()
    console.log({ data }, { event })
    // mutate(data)
  }

  return { createPolicyForm, onSubmit }
}
