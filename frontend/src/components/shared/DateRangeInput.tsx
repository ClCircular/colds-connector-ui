// DateRangeInput.tsx
import { FC, useState, useRef, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { DayPicker } from 'react-day-picker'
import dayjs from 'dayjs'
import 'react-day-picker/dist/style.css'

interface DateRangeInputProps {
  /** Rango inicial (puede ser { from: undefined, to: undefined }) */
  initialRange?: { from: Date | undefined; to: Date | undefined }
  /** Callback que recibe el nuevo rango cada vez que cambia */
  onChange: (range: { from: Date | undefined; to: Date | undefined }) => void
}

export const DateRangeInput: FC<DateRangeInputProps> = ({
  initialRange,
  onChange
}) => {
  // 'to' es opcional para ser compatible con react-day-picker
  const [range, setRange] = useState<{
    from: Date | undefined
    to?: Date | undefined
  }>(initialRange || { from: undefined, to: undefined })

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Nuevo: modo rango o individual
  const [isRange, setIsRange] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleSelect = (
    dateRange:
      | { from: Date | undefined; to?: Date | undefined }
      | Date
      | undefined
  ) => {
    if (isRange) {
      const safeRange = (dateRange as {
        from: Date | undefined
        to?: Date | undefined
      }) || { from: undefined, to: undefined }
      setRange(safeRange)
      onChange({ from: safeRange.from, to: safeRange.to ?? undefined })
    } else {
      // Individual: solo un date
      const date = dateRange as Date | undefined
      setRange({ from: date, to: undefined })
      onChange({ from: date, to: undefined })
    }
  }

  const formatOrPlaceholder = (date: Date | undefined, placeholder: string) =>
    date ? dayjs(date).format('YYYY-MM-DD') : placeholder

  // Si el usuario hace clic fuera, cerramos el calendario
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setShowTooltip(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Si cambia el modo, limpiar el valor de to si pasa a individual
  useEffect(() => {
    if (!isRange && range.to) {
      setRange({ from: range.from, to: undefined })
      onChange({ from: range.from, to: undefined })
    }
  }, [isRange])

  return (
    <div className='relative inline-block w-full' ref={ref}>
      {/* Checkbox e inputs en la misma línea */}
      <div className='flex flex-row items-center gap-2 w-full'>
        {/* Checkbox para alternar modo rango/individual */}
        <div className='flex items-center'>
          <label className='flex items-center cursor-pointer text-xs text-gray-600 dark:text-gray-300'>
            <input
              type='checkbox'
              checked={isRange}
              onChange={(e) => setIsRange(e.target.checked)}
              className='accent-blue-500 mr-1'
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
            />
            Rango
          </label>
          <div className='relative ml-2'>
            {showTooltip && (
              <div className='absolute left-0 top-6 z-30 px-2 py-1 rounded bg-gray-800 text-white text-xs shadow-lg whitespace-nowrap'>
                {isRange
                  ? 'Modo rango: puedes seleccionar un rango de fechas'
                  : 'Modo fecha individual: solo una fecha'}
              </div>
            )}
          </div>
        </div>
        {/* Inputs */}
        <div className={`flex flex-row space-x-1 w-full`}>
          {/* Input Desde */}
          <div className='relative w-full'>
            <input
              type='text'
              readOnly
              className='w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-normal'
              onClick={() => setOpen(true)}
              placeholder={isRange ? 'Desde' : 'Fecha'}
              value={formatOrPlaceholder(range.from, '')}
            />
            {range.from && (
              <button
                type='button'
                className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors hover:bg-slate-200 p-1 rounded-full cursor-pointer'
                onClick={() => {
                  const newRange = { ...range, from: undefined }
                  setRange(newRange)
                  onChange({ from: undefined, to: newRange.to ?? undefined })
                }}
                tabIndex={-1}
              >
                <span className='sr-only'>Clear</span>
                <IoClose />
              </button>
            )}
          </div>
          {/* Input Hasta (solo si es rango) */}
          {isRange && (
            <div className='relative w-full'>
              <input
                type='text'
                readOnly
                className='w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-normal'
                onClick={() => setOpen(true)}
                placeholder='Hasta'
                value={formatOrPlaceholder(range.to, '')}
              />
              {range.to && (
                <button
                  type='button'
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors hover:bg-slate-200 p-1 rounded-full cursor-pointer'
                  onClick={() => {
                    const newRange = { ...range, to: undefined }
                    setRange(newRange)
                    onChange({ from: newRange.from, to: undefined })
                  }}
                  tabIndex={-1}
                >
                  <span className='sr-only'>Clear</span>
                  <IoClose />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Calendario desplegable */}
      {open && (
        <div className='absolute z-20 mt-2 bg-white border rounded shadow-lg'>
          {isRange ? (
            <DayPicker
              mode='range'
              selected={range}
              onSelect={handleSelect}
              footer={
                range.from && range.to ? (
                  <p className='p-2 text-sm'>
                    Rango: {dayjs(range.from).format('YYYY-MM-DD')} —{' '}
                    {dayjs(range.to).format('YYYY-MM-DD')}
                  </p>
                ) : (
                  <p className='p-2 text-sm text-gray-500'>
                    Selecciona un rango en el calendario
                  </p>
                )
              }
            />
          ) : (
            <DayPicker
              mode='single'
              selected={range.from}
              onSelect={handleSelect}
              footer={
                range.from ? (
                  <p className='p-2 text-sm'>
                    Fecha: {dayjs(range.from).format('YYYY-MM-DD')}
                  </p>
                ) : (
                  <p className='p-2 text-sm text-gray-500'>
                    Selecciona una fecha en el calendario
                  </p>
                )
              }
            />
          )}
        </div>
      )}
    </div>
  )
}
