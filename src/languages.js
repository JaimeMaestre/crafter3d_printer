import { createI18n } from 'vue-i18n'

// Import translation files
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import pt from './locales/pt.json'
import it from './locales/it.json'
import de from './locales/de.json'

// Define translations
const messages = {
  en,
  es,
  fr,
  pt,
  it,
  de,
}

// Create i18n instance
const i18n = createI18n({
  locale: 'en', // Default language
  fallbackLocale: 'en', // Fallback if translation is missing
  messages,
})

export default i18n
