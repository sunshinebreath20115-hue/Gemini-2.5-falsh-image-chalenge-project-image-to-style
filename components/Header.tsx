import React, { useContext } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { LocalizationContext } from '../context/LocalizationContext';

const Header: React.FC = () => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error("Header must be used within a LocalizationProvider");
    }
    const { language, setLanguage, t } = context;

    const toggleLanguage = () => {
        const newLang = language === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
    };

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="text-cyan-400">
                    <SparklesIcon className="w-8 h-8" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                    {t('appTitle')}
                </h1>
            </div>
            <button
                onClick={toggleLanguage}
                className="px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
                {t('toggleLanguage')}
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;