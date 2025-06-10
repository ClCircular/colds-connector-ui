import { useGetTransfers } from '../api/transfers/useGetTransfers'

export const TransfersHistory = () => {
  const data = useGetTransfers()
  return <div>TransfersHistory</div>
}
