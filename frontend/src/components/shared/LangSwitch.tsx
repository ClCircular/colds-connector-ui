import i18next from 'i18next'
import { useEffect, useState } from 'react'

export const LangSwitch = () => {
  // 🔹 Usa `i18next.language` directamente en lugar de `localStorage`

  console.log('i18next.language', i18next.language)
  const [selected, setSelected] = useState<string>(
    i18next.language.includes('es') ? 'es-ES' : 'en'
  )

  // 🔹 Sincronizar el estado con cambios externos (por ejemplo, cambio de idioma en otra pestaña)
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setSelected(lng)
    }
    i18next.on('languageChanged', handleLanguageChange)
    return () => {
      i18next.off('languageChanged', handleLanguageChange)
    }
  }, [])

  const changeLanguage = (item: string) => {
    i18next.changeLanguage(item, () => {
      localStorage.setItem('i18nextLng', item) // 🔹 Se guarda en localStorage si quieres mantener persistencia
    })
  }
  return (
    <div className='flex items-center gap-2'>
      <span
        className={`text-sm text-gray-500 ${
          selected === 'en' ? 'underline' : ''
        }`}
      >
        EN
      </span>
      <button
        className='bg-slate-300 rounded-2xl h-4 w-10 flex items-center justify-center cursor-pointer hover:bg-slate-400 transition-colors duration-200 ease-in-out relative'
        onClick={() => changeLanguage(selected === 'es-ES' ? 'en' : 'es-ES')}
      >
        <div
          className={`
             size-5 rounded-full absolute transition-all left-0 ${
               selected === 'en'
                 ? 'left-0 bg-slate-500'
                 : 'left-full -translate-x-full bg-[#94bf43]'
             }
            `}
        />
      </button>
      <span
        className={`text-sm ${
          selected === 'es-ES' ? 'text-[#94bf43] underline' : 'text-gray-500'
        }`}
      >
        ES
      </span>
    </div>
  )
}
