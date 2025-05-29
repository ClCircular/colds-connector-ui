import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { PolicyRow } from '../../interfaces/policies/policies.interface'
import { useMemo } from 'react'
import { filterFnDate } from '../../utils/FilterFnDate'
import dayjs from 'dayjs'
import { useGetPolicies } from '../../api/policies/useGetPolicies'

export const usePoliciesTable = () => {
  const { t } = useTranslation()

  const policiesData = useGetPolicies()

  const columnHelper = createColumnHelper<PolicyRow>()

  const columns = useMemo(
    () => [
      //name
      columnHelper.accessor('name', {
        header: t('name'),
        cell: (info) => info.getValue()
      }),
      //createdAt
      columnHelper.accessor('createdAt', {
        header: t('created_at'),
        cell: (info) => {
          const dateValue = info.getValue()
          if (dayjs(dateValue).year() < 2000) return '—'
          return dayjs(dateValue).format('YYYY/MM/DD HH:mm:ss')
        },
        filterFn: filterFnDate
      })
    ],
    [columnHelper, t]
  )

  const rows = useMemo(() => {
    if (policiesData.isLoading || policiesData.isError || !policiesData.data)
      return []
    return policiesData.data.map((policy) => ({
      name: policy.name,
      createdAt:
        !policy.created_at || !dayjs(policy.created_at).isValid()
          ? dayjs('0001-01-01T00:00:00.000Z').toDate()
          : dayjs(policy.created_at).toDate()
    }))
  }, [policiesData.data, policiesData.isLoading, policiesData.isError])

  return { columns, rows }
}
