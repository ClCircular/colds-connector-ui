import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import esTranslations from './assets/translations/es.json'
import enTranslations from './assets/translations/en.json'

const resources = {
  es: {
    translation: esTranslations
  },
  en: {
    translation: enTranslations
  }
}

const fallbackLng = ['es-ES']

i18n
  // .use(HttpBackend) // load translations using http (default                                               public/assets/locals/en/translations)
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({
    resources,
    fallbackLng, // fallback language is english.
    debug: false,
    interpolation: {
      escapeValue: false // no need for react. it escapes by default
    }
  })

export default i18n
