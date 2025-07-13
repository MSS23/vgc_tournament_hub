import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, languages } from '../utils/i18n';
import { CheckCircle, Check } from 'lucide-react';

const LanguageDropdown: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isChanging, setIsChanging] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Listen for language change events
  React.useEffect(() => {
    const handleLanguageChange = () => {
      // Force re-render when language changes
      setOpen(false);
      setIsChanging(false);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSelect = async (code: string) => {
    if (code === i18n.language || isChanging) {
      setOpen(false);
      return;
    }

    setIsChanging(true);
    setOpen(false);
    
    try {
      const success = await changeLanguage(code);
      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        // Show error feedback
        console.error('Language change failed');
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef} style={{ minWidth: 120 }}>
      <button
        className="flex items-center px-3 py-2 rounded-xl bg-white shadow border border-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 gap-2 min-w-[120px] disabled:opacity-50"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        aria-label="Select language"
        type="button"
        disabled={isChanging}
      >
        <span className="text-xl mr-1">{currentLanguage.flag}</span>
        <span className="text-sm font-medium truncate max-w-[80px]">{currentLanguage.name}</span>
        <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      
      {showSuccess && (
        <div className="absolute right-0 mt-2 w-56 bg-green-50 border border-green-200 rounded-xl p-3 shadow-2xl z-50 backdrop-blur-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800 font-medium">
              {t('common.language.saved', 'Language saved successfully!')}
            </span>
          </div>
        </div>
      )}
      
      {open && (
        <ul
          className="absolute right-0 mt-2 min-w-[180px] max-w-[90vw] max-h-72 overflow-y-auto bg-white/90 border border-gray-200 rounded-xl shadow-2xl z-50 backdrop-blur-lg animate-fade-in"
          role="listbox"
          style={{
            WebkitOverflowScrolling: 'touch',
            transition: 'opacity 0.2s',
          }}
        >
          {languages.map(lang => (
            <li
              key={lang.code}
              role="option"
              aria-selected={i18n.language === lang.code}
              tabIndex={0}
              className={`flex items-center px-4 py-3 cursor-pointer gap-2 hover:bg-blue-50 focus:bg-blue-100 transition-all duration-100 rounded-xl text-base ${
                i18n.language === lang.code ? 'font-bold bg-blue-100 text-blue-900' : 'text-gray-800'
              } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
              onMouseDown={() => !isChanging && handleSelect(lang.code)}
              onKeyDown={e => { 
                if (!isChanging && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleSelect(lang.code);
                }
              }}
              style={{ minHeight: 44 }}
            >
              <span className="text-xl mr-2">{lang.flag}</span>
              <span className="truncate max-w-[80px]">{lang.name}</span>
              {i18n.language === lang.code && (
                <Check className="ml-auto h-5 w-5 text-blue-600" />
              )}
            </li>
          ))}
        </ul>
      )}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.18s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  );
};

export default LanguageDropdown; 