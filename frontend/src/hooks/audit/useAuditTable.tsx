import { useMemo } from 'react'
import { useGetAuditByUser } from '../../api/audit/useGetAuditByUser'
import { useTranslation } from 'react-i18next'
import { createColumnHelper } from '@tanstack/react-table'
import { AuditRow } from '../../interfaces/audit/audit.interface'
import dayjs from 'dayjs'
import { filterFnDate } from '../../utils/FilterFnDate'

export const useAuditTable = () => {
  const { t } = useTranslation()
  const auditData = useGetAuditByUser()

  const columnHelper = createColumnHelper<AuditRow>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('action', {
        header: t('action'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor('timestamp', {
        header: t('timestamp'),
        cell: (info) => {
          const dateValue = info.getValue()
          if (dayjs(dateValue).year() < 2000) return '—'
          return dayjs(dateValue).format('YYYY/MM/DD HH:mm:ss')
        },
        filterFn: filterFnDate
      }),
      columnHelper.accessor('details', {
        header: t('details'),
        cell: (info) => info.getValue() || '-'
      })
    ],
    [t]
  )

  const rows = useMemo(() => {
    return (auditData.data || []).map((entry) => ({
      action: entry.action,
      timestamp:
        !entry.ts || !dayjs(entry.ts).isValid()
          ? dayjs('0001-01-01T00:00:00.000Z').toDate()
          : dayjs(entry.ts).toDate(),
      details: entry.metadata ? JSON.stringify(entry.metadata) : '-'
    }))
  }, [auditData.data])

  return {
    columns,
    rows,
    isLoading: auditData.isLoading
  }
}
