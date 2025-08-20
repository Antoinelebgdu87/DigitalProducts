import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/context/TranslationContext';

interface TranslatedTextProps {
  children: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

/**
 * Composant qui traduit automatiquement le texte selon la langue sélectionnée
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  children, 
  className,
  tag: Tag = 'span'
}) => {
  const { translateText, isTranslationEnabled, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (isTranslationEnabled && currentLanguage !== 'fr') {
      // La traduction se fait via le contexte
      setTranslatedText(translateText(children));
    } else {
      setTranslatedText(children);
    }
  }, [children, translateText, isTranslationEnabled, currentLanguage]);

  return (
    <Tag className={className}>
      {translatedText}
    </Tag>
  );
};

export default TranslatedText;

/**
 * Hook pour traduire du texte à la volée
 */
export const useTranslatedText = (text: string): string => {
  const { translateText, isTranslationEnabled, currentLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    if (isTranslationEnabled && currentLanguage !== 'fr') {
      setTranslatedText(translateText(text));
    } else {
      setTranslatedText(text);
    }
  }, [text, translateText, isTranslationEnabled, currentLanguage]);

  return translatedText;
};

/**
 * Fonction utilitaire pour traduire du texte simple
 */
export const t = (text: string): string => {
  // Cette fonction peut être utilisée dans les composants qui utilisent le hook useTranslation
  return text;
};
