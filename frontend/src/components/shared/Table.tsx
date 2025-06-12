import { FC, useEffect, useState } from 'react'
import {
  Column,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  IoChevronBackOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoChevronUpOutline,
  IoClose,
  IoSearch
} from 'react-icons/io5'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { DateRangeInput } from './DateRangeInput'
import { filterFnDate } from '../../utils/FilterFnDate'

interface TableProps {
  rows: any[]
  columns: any[]
  initialFilters?: ColumnFiltersState
}

export const Table: FC<TableProps> = ({ columns, rows, initialFilters }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialFilters || []
  )
  const [globalFilter, setGlobalFilter] = useState('')
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      date: filterFnDate
    },
    state: {
      columnFilters,
      globalFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false
  })

  const { t } = useTranslation()

  return (
    <div className='flex-1 min-h-0 h-full overflow-x-auto px-0.5 w-full border border-gray-300 rounded-lg! shadow-md!'>
      <table className='table-auto w-full h-full'>
        <thead className='bg-gray-100 border-b border-gray-300 sticky top-0 z-10'>
          {/* Fila de búsqueda general */}
          <tr className='border-b border-slate-300'>
            <th colSpan={columns.length} className='p-2'>
              <div className='flex justify-end'>
                <div className='relative'>
                  <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                    <IoSearch className='size-5 text-gray-500 dark:text-gray-400' />
                  </div>
                  <input
                    type='search'
                    id='default-search'
                    className='block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    required
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder={t('search_in_table')}
                  />
                </div>
              </div>
            </th>
          </tr>
          {/* Primera fila: nombres de columnas y orden */}
          <tr className='border-b border-slate-300'>
            {table.getHeaderGroups()[0].headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className='text-gray-600 py-4 px-2'
              >
                {header.isPlaceholder ? null : (
                  <div
                    className={
                      header.column.getCanSort()
                        ? 'cursor-pointer select-none flex items-center justify-start'
                        : 'flex items-center justify-center'
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: <IoChevronUpOutline className='inline ml-1' />,
                      desc: <IoChevronDownOutline className='inline ml-1' />
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                )}
              </th>
            ))}
          </tr>
          {/* Segunda fila: filtros */}
          <tr className='border-b border-slate-300'>
            {table.getHeaderGroups()[0].headers.map((header) => (
              <th
                key={header.id + '-filter'}
                colSpan={header.colSpan}
                className='text-gray-700 py-4 px-2'
              >
                {header.isPlaceholder ? null : header.column.getCanFilter() ? (
                  <Filter column={header.column} />
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white align-middle' style={{ height: '100%' }}>
          {table.getRowModel().rows.map((row, index) => {
            return (
              <tr
                key={row.id}
                className={` ${index % 2 !== 0 ? 'bg-gray-50' : ''}`}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className='py-2 text-start px-2 text-sm text-gray-700 border-b border-gray-200'
                      style={{ verticalAlign: 'middle' }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
          {/* Fila fantasma para empujar el footer abajo si hay pocas filas */}
          <tr
            style={{ height: '100%', pointerEvents: 'none' }}
            aria-hidden='true'
          >
            <td
              colSpan={columns.length}
              style={{ padding: 0, border: 'none', background: 'transparent' }}
            ></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            {/* Un solo td que ocupe todas las columnas */}
            <td colSpan={columns.length}>
              <div className='flex flex-wrap items-center gap-4 px-4 py-3 bg-gray-50 border-t border-gray-300 rounded-b-lg'>
                {/* Botones de navegación */}
                <div className='flex items-center gap-1'>
                  <button
                    className='flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    aria-label={t('first_page')}
                  >
                    <FiChevronsLeft size={18} />
                  </button>
                  <button
                    className='flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label={t('previous_page')}
                  >
                    <IoChevronBackOutline size={18} />
                  </button>
                  <button
                    className='flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label={t('next_page')}
                  >
                    <IoChevronForwardOutline size={18} />
                  </button>
                  <button
                    className='flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    aria-label={t('last_page')}
                  >
                    <FiChevronsRight size={18} />
                  </button>
                </div>

                {/* Información de página */}
                <div className='text-sm'>
                  {t('page')}{' '}
                  <strong>
                    {table.getState().pagination.pageIndex + 1} de{' '}
                    {table.getPageCount()}
                  </strong>
                </div>

                {/* Ir a página */}
                <div className='flex items-center space-x-2 text-sm'>
                  <label htmlFor='goto-page' className='whitespace-nowrap'>
                    {t('go_to')}:
                  </label>
                  <input
                    id='goto-page'
                    type='number'
                    min={1}
                    max={table.getPageCount()}
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0
                      table.setPageIndex(page)
                    }}
                    className='w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-gray-400 transition'
                  />
                </div>

                {/* Selección de tamaño de página */}
                <div>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className='px-2 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition'
                  >
                    {[10, 20, 30, 40, 50].map((size) => (
                      <option key={size} value={size}>
                        {t('show')} {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()
  //@ts-ignore
  const { filterVariant, filterOptions } = column.columnDef.meta ?? {}

  // Range (number min/max)
  if (filterVariant === 'range') {
    return (
      <div>
        <div className='flex space-x-2'>
          <DebouncedInput
            type='number'
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                value,
                old?.[1]
              ])
            }
            placeholder={`Min`}
            className='w-24 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-gray-400 font-normal'
          />
          <DebouncedInput
            type='number'
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                value
              ])
            }
            placeholder={`Max`}
            className='w-24 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-gray-400 font-normal'
          />
        </div>
        <div className='h-1' />
      </div>
    )
  }

  // Select (dropdown)
  if (filterVariant === 'select') {
    // filterOptions puede venir en meta para opciones dinámicas
    const options = filterOptions || [{ value: '', label: 'All' }]
    return (
      <select
        onChange={(e) => column.setFilterValue(e.target.value)}
        value={columnFilterValue?.toString()}
        className='w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-normal bg-white'
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }

  // Date
  if (filterVariant === 'date') {
    return <DateRangeInput onChange={(range) => column.setFilterValue(range)} />
  }

  if (filterVariant === 'number') {
    return (
      <DebouncedInput
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Buscar...`}
        type='number'
        value={(columnFilterValue ?? '') as string | number}
        className='w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-normal'
      />
    )
  }

  // Text (default)
  return (
    <DebouncedInput
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Buscar...`}
      type='text'
      value={(columnFilterValue ?? '') as string}
      className='w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-normal'
    />
  )
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)
    return () => clearTimeout(timeout)
  }, [value])

  return (
    <div className='relative w-full flex justify-start'>
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button
          className='absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors hover:bg-slate-200 p-2 rounded-full cursor-pointer'
          onClick={() => setValue('')}
        >
          <span className='sr-only'>Clear</span>
          <IoClose />
        </button>
      )}
    </div>
  )
}
