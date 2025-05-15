import { useForm } from 'react-hook-form'
import { useCreateContractWithRule } from '../../api/contracts/useCreateContractWithRule'

interface ContractBody {
  title: string
  description: string
  startDate: string
  endDate: string
  accessPolicy: string
}
export const useCreateContractForm = () => {
  const { mutate } = useCreateContractWithRule()

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
    mutate(data)
  }

  return { createContractForm, onSubmit }
}
