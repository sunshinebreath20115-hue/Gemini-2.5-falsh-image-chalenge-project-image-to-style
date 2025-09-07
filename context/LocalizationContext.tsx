import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';

// Define a general type for translations, as we won't have a static type from an import.
type Translations = { [key: string]: string };

interface LocalizationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, fallback?: string) => string;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('ar');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  // Effect to fetch translations when the language changes
  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        // Fetch from the 'locales' directory, which is relative to the root index.html file.
        const response = await fetch(`./locales/${language}.json`);
        if (!response.ok) {
          throw new Error(`Could not load translations for language: ${language}`);
        }
        const data: Translations = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Translation loading error:", error);
        // In case of an error, fall back to an empty object to prevent the app from crashing.
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [language]);

  // Effect to update the document's language and direction attributes for accessibility and styling.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  // A memoized translation function that looks up a key in the current language's dictionary.
  const t = useCallback((key: string, fallback?: string): string => {
    // Use the key as a fallback if the translation is not found and no other fallback is provided.
    return translations[key] || fallback || key;
  }, [translations]);

  // Prevent rendering the rest of the app until the initial translations are loaded to avoid UI flickering.
  if (isLoading) {
    return null; // Or render a global loading spinner component.
  }

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};
