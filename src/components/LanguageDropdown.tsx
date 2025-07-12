import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const LanguageDropdown: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" tabIndex={0} onBlur={() => setOpen(false)}>
      <button
        className="flex items-center px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        aria-label="Select language"
      >
        <span className="text-xl mr-1">{LANGUAGES.find(l => l.code === i18n.language)?.flag || '🌐'}</span>
        <span className="text-sm font-medium">{LANGUAGES.find(l => l.code === i18n.language)?.label || 'Language'}</span>
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50" role="listbox">
          {LANGUAGES.map(lang => (
            <li
              key={lang.code}
              role="option"
              aria-selected={i18n.language === lang.code}
              tabIndex={0}
              className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${i18n.language === lang.code ? 'font-bold bg-gray-50' : ''}`}
              onClick={() => handleSelect(lang.code)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelect(lang.code); }}
            >
              <span className="text-xl mr-2">{lang.flag}</span>
              <span>{lang.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageDropdown; 