import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types pour les langues supportées
export type Language = 'fr' | 'en' | 'pt' | 'es' | 'de' | 'it';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

// Langues disponibles
export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

interface TranslationContextType {
  currentLanguage: Language;
  isTranslating: boolean;
  translations: Record<string, string>;
  setLanguage: (language: Language) => void;
  translateText: (text: string) => string;
  isTranslationEnabled: boolean;
  toggleTranslation: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Service de traduction avec OpenRouter
class OpenRouterTranslationService {
  private apiKey = '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';
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private cache = new Map<string, string>();

  async translateText(text: string, targetLanguage: Language): Promise<string> {
    const cacheKey = `${text}_${targetLanguage}`;
    
    // Vérifier le cache d'abord
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const languageNames: Record<Language, string> = {
        fr: 'French',
        en: 'English',
        pt: 'Portuguese',
        es: 'Spanish',
        de: 'German',
        it: 'Italian'
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the given text to ${languageNames[targetLanguage]}. Return ONLY the translated text, nothing else. Preserve any HTML tags and formatting exactly as they are.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.1,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.choices[0]?.message?.content?.trim() || text;
      
      // Mettre en cache
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Retourner le texte original en cas d'erreur
    }
  }

  async translateMultipleTexts(texts: string[], targetLanguage: Language): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    
    // Traiter par batch pour éviter de surcharger l'API
    const batchSize = 5;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const promises = batch.map(async (text) => {
        const translated = await this.translateText(text, targetLanguage);
        return { original: text, translated };
      });
      
      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ original, translated }) => {
        results[original] = translated;
      });
      
      // Petite pause entre les batches
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }
}

const translationService = new OpenRouterTranslationService();

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false);

  // Charger les préférences depuis localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    const savedEnabled = localStorage.getItem('translation-enabled') === 'true';
    
    if (savedLanguage && AVAILABLE_LANGUAGES.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
    setIsTranslationEnabled(savedEnabled);
  }, []);

  const setLanguage = async (language: Language) => {
    if (language === currentLanguage) return;
    
    setCurrentLanguage(language);
    localStorage.setItem('app-language', language);
    
    if (isTranslationEnabled && language !== 'fr') {
      await translatePageContent(language);
    }
  };

  const translatePageContent = async (targetLanguage: Language) => {
    if (targetLanguage === 'fr') {
      setTranslations({});
      return;
    }

    setIsTranslating(true);
    
    try {
      // Collecter tous les textes à traduire
      const textNodes = document.querySelectorAll('*:not(script):not(style)');
      const textsToTranslate: string[] = [];
      
      textNodes.forEach(node => {
        if (node.childNodes) {
          node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
              const text = child.textContent.trim();
              if (text.length > 1 && !textsToTranslate.includes(text)) {
                textsToTranslate.push(text);
              }
            }
          });
        }
      });

      // Traduire les textes
      const newTranslations = await translationService.translateMultipleTexts(
        textsToTranslate,
        targetLanguage
      );
      
      setTranslations(prev => ({ ...prev, ...newTranslations }));
    } catch (error) {
      console.error('Failed to translate page content:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const translateText = (text: string): string => {
    if (!isTranslationEnabled || currentLanguage === 'fr') {
      return text;
    }
    return translations[text] || text;
  };

  const toggleTranslation = () => {
    const newEnabled = !isTranslationEnabled;
    setIsTranslationEnabled(newEnabled);
    localStorage.setItem('translation-enabled', newEnabled.toString());
    
    if (newEnabled && currentLanguage !== 'fr') {
      translatePageContent(currentLanguage);
    } else if (!newEnabled) {
      setTranslations({});
    }
  };

  const value: TranslationContextType = {
    currentLanguage,
    isTranslating,
    translations,
    setLanguage,
    translateText,
    isTranslationEnabled,
    toggleTranslation,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export default TranslationContext;
