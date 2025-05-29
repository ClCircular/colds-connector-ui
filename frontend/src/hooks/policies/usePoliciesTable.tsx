import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { PolicyRow } from '../../interfaces/policies/policies.interface'
import { useMemo } from 'react'
import { filterFnDate } from '../../utils/FilterFnDate'
import dayjs from 'dayjs'
import { useGetPolicies } from '../../api/policies/useGetPolicies'
import { IoTrash } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { useDeletePolicy } from '../../api/policies/useDeletePolicy'

export const usePoliciesTable = () => {
  const { t } = useTranslation()

  const policiesData = useGetPolicies()

  const columnHelper = createColumnHelper<PolicyRow>()

  const { mutate } = useDeletePolicy()

  const handleDeletePolicy = (policyId: string) => {
    const response = confirm(
      `Are you sure you want to delete the policy with ID: ${policyId}?`
    )
    if (response) {
      mutate({ policyId })
    }
  }

  const columns = useMemo(
    () => [
      //name
      columnHelper.accessor('name', {
        header: t('name'),
        cell: (info) => info.getValue()
      }),
      //action
      columnHelper.accessor('action', {
        header: t('action'),
        cell: (info) => {
          const action = info.getValue()
          return t(`policy_action.${action}`, action)
        }
      }),
      //restriction
      columnHelper.accessor('restriction', {
        header: t('restriction'),
        cell: (info) => {
          const restriction = info.getValue()
          return restriction
        }
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
      }),
      //actions
      columnHelper.display({
        id: 'actions',
        header: t('actions'),
        cell: (info) => {
          const id = info.row.original.id
          console.log({ id })
          if (!id) return '—'
          return (
            <div className='flex space-x-2 items-center justify-center'>
              {/* Add action buttons here, e.g., Edit, Delete */}
              <button className='text-blue-500 hover:bg-slate-100 transition-colors rounded-full p-3 cursor-pointer'>
                <MdEdit className='size-6' />
              </button>
              <button
                className='text-red-500 hover:bg-slate-100 transition-colors rounded-full p-3 cursor-pointer'
                onClick={() => handleDeletePolicy(id)}
              >
                <IoTrash className='size-6' />
              </button>
            </div>
          )
        }
      })
    ],
    [columnHelper, t]
  )

  const rows = useMemo(() => {
    if (policiesData.isLoading || policiesData.isError || !policiesData.data)
      return []
    return policiesData.data.map((policy) => ({
      id: policy.policy_id,
      name: policy.name,
      createdAt:
        !policy.created_at || !dayjs(policy.created_at).isValid()
          ? dayjs('0001-01-01T00:00:00.000Z').toDate()
          : dayjs(policy.created_at).toDate(),
      action: policy.action,
      restriction: policy.policy_constraints
        ? `${t(policy.policy_constraints.type.toLocaleLowerCase())} ${t(
            policy.policy_constraints.operator
          )} ${t(policy.policy_constraints.value)}`
        : '—'
    }))
  }, [policiesData.data, policiesData.isLoading, policiesData.isError])

  return { columns, rows }
}
