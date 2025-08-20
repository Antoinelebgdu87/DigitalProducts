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

// Service de traduction hybride avec fallback gratuit
class HybridTranslationService {
  private cache = new Map<string, string>();

  // Dictionnaire de traductions communes pour un fallback rapide
  private staticTranslations: Record<Language, Record<string, string>> = {
    en: {
      'Paramètres de traduction': 'Translation Settings',
      'Traduction IA': 'AI Translation',
      'Langue d\'affichage': 'Display Language',
      'Service de traduction': 'Translation Service',
      'Textes traduits': 'Translated texts',
      'Mode actuel': 'Current mode',
      'Original': 'Original',
      'Traduit': 'Translated',
      'Fermer': 'Close',
      'DigitalHub': 'DigitalHub',
      'Digital Products': 'Digital Products',
      'Discover exceptional digital products with instant access.': 'Discover exceptional digital products with instant access.',
      'No accounts, no hassle.': 'No accounts, no hassle.',
      'Just pure digital excellence.': 'Just pure digital excellence.',
      'Explore Products': 'Explore Products',
      'Learn More': 'Learn More',
      '100% Anonymous': '100% Anonymous',
      'No registration required': 'No registration required',
      'Instant Access': 'Instant Access',
      'Download immediately': 'Download immediately',
      'Premium Quality': 'Premium Quality',
      'Curated digital products': 'Curated digital products',
      'Secure Delivery': 'Secure Delivery',
      'Safe & reliable downloads': 'Safe & reliable downloads',
      'Featured Products': 'Featured Products',
      'Handpicked collection of premium digital assets, tools, and resources for creators and professionals.': 'Handpicked collection of premium digital assets, tools, and resources for creators and professionals.',
      'Loading Products': 'Loading Products',
      'Fetching the latest digital products...': 'Fetching the latest digital products...',
      'Coming Soon': 'Coming Soon',
      'Amazing products are being curated for you. Stay tuned for something incredible!': 'Amazing products are being curated for you. Stay tuned for something incredible!',
      'All rights reserved': 'All rights reserved'
    },
    pt: {
      'Paramètres de traduction': 'Configurações de Tradução',
      'Traduction IA': 'Tradução IA',
      'Langue d\'affichage': 'Idioma de Exibição',
      'Service de traduction': 'Serviço de Tradução',
      'Textes traduits': 'Textos traduzidos',
      'Mode actuel': 'Modo atual',
      'Original': 'Original',
      'Traduit': 'Traduzido',
      'Fermer': 'Fechar',
      'DigitalHub': 'DigitalHub',
      'Digital Products': 'Produtos Digitais',
      'Discover exceptional digital products with instant access.': 'Descubra produtos digitais excepcionais com acesso instantâneo.',
      'No accounts, no hassle.': 'Sem contas, sem complicações.',
      'Just pure digital excellence.': 'Apenas excelência digital pura.',
      'Explore Products': 'Explorar Produtos',
      'Learn More': 'Saiba Mais',
      '100% Anonymous': '100% Anônimo',
      'No registration required': 'Não requer registro',
      'Instant Access': 'Acesso Instantâneo',
      'Download immediately': 'Download imediato',
      'Premium Quality': 'Qualidade Premium',
      'Curated digital products': 'Produtos digitais selecionados',
      'Secure Delivery': 'Entrega Segura',
      'Safe & reliable downloads': 'Downloads seguros e confiáveis',
      'Featured Products': 'Produtos em Destaque',
      'Loading Products': 'Carregando Produtos',
      'Coming Soon': 'Em Breve',
      'All rights reserved': 'Todos os direitos reservados'
    },
    es: {
      'Paramètres de traduction': 'Configuración de Traducción',
      'Traduction IA': 'Traducción IA',
      'Langue d\'affichage': 'Idioma de Visualización',
      'Service de traduction': 'Servicio de Traducción',
      'Textes traduits': 'Textos traducidos',
      'Mode actuel': 'Modo actual',
      'Original': 'Original',
      'Traduit': 'Traducido',
      'Fermer': 'Cerrar',
      'DigitalHub': 'DigitalHub',
      'Digital Products': 'Productos Digitales',
      'Discover exceptional digital products with instant access.': 'Descubre productos digitales excepcionales con acceso instantáneo.',
      'No accounts, no hassle.': 'Sin cuentas, sin complicaciones.',
      'Just pure digital excellence.': 'Solo excelencia digital pura.',
      'Explore Products': 'Explorar Productos',
      'Learn More': 'Saber Más',
      '100% Anonymous': '100% Anónimo',
      'No registration required': 'No se requiere registro',
      'Instant Access': 'Acceso Instantáneo',
      'Download immediately': 'Descarga inmediata',
      'Premium Quality': 'Calidad Premium',
      'Curated digital products': 'Productos digitales seleccionados',
      'Secure Delivery': 'Entrega Segura',
      'Safe & reliable downloads': 'Descargas seguras y confiables',
      'Featured Products': 'Productos Destacados',
      'Loading Products': 'Cargando Productos',
      'Coming Soon': 'Próximamente',
      'All rights reserved': 'Todos los derechos reservados'
    },
    de: {
      'Paramètres de traduction': 'Übersetzungseinstellungen',
      'Traduction IA': 'KI-Übersetzung',
      'Langue d\'affichage': 'Anzeigesprache',
      'Service de traduction': 'Übersetzungsdienst',
      'Textes traduits': 'Übersetzte Texte',
      'Mode actuel': 'Aktueller Modus',
      'Original': 'Original',
      'Traduit': 'Übersetzt',
      'Fermer': 'Schließen',
      'DigitalHub': 'DigitalHub',
      'Digital Products': 'Digitale Produkte',
      'Discover exceptional digital products with instant access.': 'Entdecken Sie außergewöhnliche digitale Produkte mit sofortigem Zugang.',
      'No accounts, no hassle.': 'Keine Konten, keine Umstände.',
      'Just pure digital excellence.': 'Nur reine digitale Exzellenz.',
      'Explore Products': 'Produkte Erkunden',
      'Learn More': 'Mehr Erfahren',
      '100% Anonymous': '100% Anonym',
      'No registration required': 'Keine Registrierung erforderlich',
      'Instant Access': 'Sofortiger Zugang',
      'Download immediately': 'Sofort herunterladen',
      'Premium Quality': 'Premium-Qualität',
      'Curated digital products': 'Kuratierte digitale Produkte',
      'Secure Delivery': 'Sichere Lieferung',
      'Safe & reliable downloads': 'Sichere und zuverlässige Downloads',
      'Featured Products': 'Ausgewählte Produkte',
      'Loading Products': 'Produkte Werden Geladen',
      'Coming Soon': 'Bald Verfügbar',
      'All rights reserved': 'Alle Rechte vorbehalten'
    },
    it: {
      'Paramètres de traduction': 'Impostazioni di Traduzione',
      'Traduction IA': 'Traduzione IA',
      'Langue d\'affichage': 'Lingua di Visualizzazione',
      'Service de traduction': 'Servizio di Traduzione',
      'Textes traduits': 'Testi tradotti',
      'Mode actuel': 'Modalità attuale',
      'Original': 'Originale',
      'Traduit': 'Tradotto',
      'Fermer': 'Chiudi',
      'DigitalHub': 'DigitalHub',
      'Digital Products': 'Prodotti Digitali',
      'Discover exceptional digital products with instant access.': 'Scopri prodotti digitali eccezionali con accesso istantaneo.',
      'No accounts, no hassle.': 'Nessun account, nessun problema.',
      'Just pure digital excellence.': 'Solo pura eccellenza digitale.',
      'Explore Products': 'Esplora Prodotti',
      'Learn More': 'Scopri di Più',
      '100% Anonymous': '100% Anonimo',
      'No registration required': 'Nessuna registrazione richiesta',
      'Instant Access': 'Accesso Istantaneo',
      'Download immediately': 'Scarica immediatamente',
      'Premium Quality': 'Qualità Premium',
      'Curated digital products': 'Prodotti digitali selezionati',
      'Secure Delivery': 'Consegna Sicura',
      'Safe & reliable downloads': 'Download sicuri e affidabili',
      'Featured Products': 'Prodotti in Evidenza',
      'Loading Products': 'Caricamento Prodotti',
      'Coming Soon': 'Prossimamente',
      'All rights reserved': 'Tutti i diritti riservati'
    },
    fr: {} // Pas besoin de traductions pour le français
  };

  async translateText(text: string, targetLanguage: Language): Promise<string> {
    const cacheKey = `${text}_${targetLanguage}`;

    // Vérifier le cache d'abord
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Vérifier les traductions statiques
    const staticTranslation = this.staticTranslations[targetLanguage]?.[text];
    if (staticTranslation) {
      this.cache.set(cacheKey, staticTranslation);
      return staticTranslation;
    }

    // Pour les textes non traduits statiquement, essayer une API gratuite ou retourner le texte original
    try {
      // Utiliser l'API LibreTranslate gratuite comme fallback
      const libreTranslateResult = await this.tryLibreTranslate(text, targetLanguage);
      if (libreTranslateResult) {
        this.cache.set(cacheKey, libreTranslateResult);
        return libreTranslateResult;
      }
    } catch (error) {
      console.warn('LibreTranslate failed, using fallback:', error);
    }

    // Fallback final : retourner le texte original
    return text;
  }

  private async tryLibreTranslate(text: string, targetLanguage: Language): Promise<string | null> {
    try {
      const langCodes: Record<Language, string> = {
        fr: 'fr',
        en: 'en',
        pt: 'pt',
        es: 'es',
        de: 'de',
        it: 'it'
      };

      // Utiliser l'API publique LibreTranslate (gratuite avec limitations)
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'fr',
          target: langCodes[targetLanguage],
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`LibreTranslate API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translatedText || null;
    } catch (error) {
      console.warn('LibreTranslate error:', error);
      return null;
    }
  }

  async translateMultipleTexts(texts: string[], targetLanguage: Language): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    // Traiter par batch pour éviter de surcharger l'API
    const batchSize = 3;
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

      // Pause plus longue entre les batches pour l'API gratuite
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results;
  }
}

const translationService = new HybridTranslationService();

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
