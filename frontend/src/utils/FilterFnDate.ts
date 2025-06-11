import { Row } from '@tanstack/react-table'
import dayjs from 'dayjs'

export const filterFnDate = (
  row: Row<any>,
  columnId: string,
  filterValue: any
) => {
  if (!filterValue) return true // No se aplica ningún filtro
  const rowValue = dayjs(row.getValue(columnId))

  if (!rowValue.isValid()) return false // No hay ningún valor en la fila

  if (!filterValue.from && !filterValue.to) {
    return true // No se aplica ningún filtro (rango vacío)
  }

  if (filterValue.from && filterValue.to) {
    // Manejo de rango: filterValue es un array [startDate, endDate]
    // const [startDate, endDate] = filterValue
    const startDate = filterValue.from
    const endDate = filterValue.to

    if (!startDate && !endDate) return true // No se aplica ningún filtro (rango vacío)
    // si no hay fecha de inicio, se toma como fecha mínima el 1 de enero de 1970
    const startDateValue = dayjs(startDate ?? new Date(0))
    const endDateValue = dayjs(endDate ?? new Date())
    return rowValue.isBetween(startDateValue, endDateValue, 'day', '[]')
  } else {
    // Manejo de fecha única
    const filterValueDate = dayjs(filterValue)
    return rowValue.isSame(filterValueDate, 'day')
  }
}
