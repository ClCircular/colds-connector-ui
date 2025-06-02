import { useForm } from 'react-hook-form'

interface ContractBody {
  title: string
  description: string
  startDate: string
  endDate: string
  accessPolicy: string
}
export const useCreateContractForm = () => {
  const createContractForm = useForm<ContractBody>({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      accessPolicy: ''
    }
  })

  const onSubmit = async (
    data: ContractBody,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.stopPropagation()
    console.log({ data }, { event })
  }

  return { createContractForm, onSubmit }
}
