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
  IoChevronUpOutline
} from 'react-icons/io5'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

interface TableProps {
  rows: any[]
  columns: any[]
}

export const Table: FC<TableProps> = ({ columns, rows }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {},
    state: {
      columnFilters
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false
  })

  const { t } = useTranslation()

  return (
    <div className='flex-1 overflow-x-auto px-0.5 w-full border border-gray-300 rounded-lg! shadow-md!'>
      <table className='table-auto w-full h-full p-2'>
        <thead className='bg-gray-100  border-b border-gray-300 sticky top-0 z-10 pb-2'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className='text-gray-700'
                  >
                    {header.isPlaceholder ? null : (
                      <div className='flex flex-col gap-2 py-2 items-center'>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler()
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <IoChevronUpOutline className='inline ml-1' />,
                            desc: (
                              <IoChevronDownOutline className='inline ml-1' />
                            )
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => {
            return (
              <tr
                key={row.id}
                className={` ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className='py-2 text-center'>
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
        </tbody>
        <tfoot>
          <tr>
            {/* Un solo td que ocupe todas las columnas */}
            <td colSpan={columns.length}>
              <div className='flex flex-wrap items-center gap-4 px-4 py-3 bg-gray-50 border-t border-gray-300 rounded-b-lg'>
                {/* Botones de navegación */}
                <div className='flex items-center space-x-2'>
                  <button
                    className='p-2 border cursor-pointer rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <FiChevronsLeft size={16} />
                  </button>
                  <button
                    className='p-2 border cursor-pointer rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <IoChevronBackOutline size={16} />
                  </button>
                  <button
                    className='p-2 border cursor-pointer rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <IoChevronForwardOutline size={16} />
                  </button>
                  <button
                    className='p-2 border cursor-pointer rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <FiChevronsRight size={16} />
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
                    className='w-16 p-1 border rounded text-center border-gray-400 placeholder:text-gray-400'
                  />
                </div>

                {/* Selección de tamaño de página */}
                <div>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className='p-1 border rounded border-gray-400'
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
  const { filterVariant } = column.columnDef.meta ?? {}

  return filterVariant === 'range' ? (
    <div>
      <div className='flex space-x-2'>
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type='number'
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className='w-24 border shadow rounded  px-2 py-1 border-gray-400 placeholder:text-gray-400'
        />
        <DebouncedInput
          type='number'
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className='w-24 border shadow rounded  px-2 py-1 border-gray-400 placeholder:text-gray-400'
        />
      </div>
      <div className='h-1' />
    </div>
  ) : filterVariant === 'select' ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value=''>All</option>
      <option value='complicated'>complicated</option>
      <option value='relationship'>relationship</option>
      <option value='single'>single</option>
    </select>
  ) : (
    <DebouncedInput
      className='w-36 border shadow rounded  px-2 py-1 border-gray-400 placeholder:text-gray-400 placeholder:font-normal'
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Buscar...`}
      type='text'
      value={(columnFilterValue ?? '') as string}
    />
    // See faceted column filters example for datalist search suggestions
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
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
