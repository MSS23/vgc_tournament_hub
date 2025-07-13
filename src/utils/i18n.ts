import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language files
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import ja from '../locales/ja.json';
import ko from '../locales/ko.json';
import zh from '../locales/zh.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  ja: { translation: ja },
  ko: { translation: ko },
  zh: { translation: zh },
};

// Initialize i18n with better configuration
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    // Add these options for better performance and reliability
    keySeparator: '.',
    nsSeparator: ':',
    debug: false,
    // Ensure language changes are properly detected
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    // Add these for better language change handling
    saveMissing: false,
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`Missing translation key: ${key} for language: ${lng}`);
    },
  });

export default i18n;

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export const changeLanguage = async (languageCode: string) => {
  try {
    // Force language change and ensure it's properly applied
    await i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    document.documentElement.lang = languageCode;
    
    // Force a re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }));
    
    // Also trigger a window resize event to force re-renders
    window.dispatchEvent(new Event('resize'));
    
    return true;
  } catch (error) {
    console.error('Failed to change language:', error);
    return false;
  }
};

// Helper function to get current language
export const getCurrentLanguage = () => {
  return i18n.language || 'en';
};

// Helper function to check if language is loaded
export const isLanguageLoaded = (languageCode: string) => {
  return i18n.hasResourceBundle(languageCode, 'translation');
};

// Helper function to force re-render of components
export const forceRerender = () => {
  window.dispatchEvent(new Event('resize'));
}; 