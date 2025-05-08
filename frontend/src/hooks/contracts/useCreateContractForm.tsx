import { useForm } from 'react-hook-form'

interface ContractBody {
  title: string
  description: string
}
export const useCreateContractForm = () => {
  const createContractForm = useForm<ContractBody>({
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const onSubmit = async (
    data: ContractBody,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.stopPropagation()
    console.log({ data }, { event })
    // Call the API to create the contract here
  }

  return { createContractForm, onSubmit }
}
