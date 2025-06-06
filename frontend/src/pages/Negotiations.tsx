import { useGetNegotiations } from '../api/negotiations/useGetNegotiations'
import { Loader } from '../components'

export const Negotiations = () => {
  const { data, isLoading } = useGetNegotiations()
  if (isLoading) {
    return <Loader />
  }
  return <div>Negotiations data: {JSON.stringify(data)}</div>
}
