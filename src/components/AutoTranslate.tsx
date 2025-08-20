import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface AutoTranslateProps {
  children: string;
}

// Service de traduction simple avec OpenRouter
const translateText = async (
  text: string,
  targetLanguage: string,
): Promise<string> => {
  if (targetLanguage === "en") return text;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
          "HTTP-Referer": window.location.origin,
          "X-Title": "DigitalHub Translation",
        },
        body: JSON.stringify({
          model: "google/gemma-2-9b-it:free",
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the given text to ${getLanguageName(targetLanguage)}. Return ONLY the translated text, no explanations. Maintain the original tone and formatting.`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          max_tokens: 200,
          temperature: 0.1,
        }),
      },
    );

    if (!response.ok) {
      console.warn("Translation API error:", response.status);
      return text;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.warn("Translation failed:", error);
    return text;
  }
};

const getLanguageName = (code: string): string => {
  const names: Record<string, string> = {
    fr: "French",
    pt: "Portuguese",
    ja: "Japanese",
    es: "Spanish",
    de: "German",
    it: "Italian",
    zh: "Chinese",
  };
  return names[code] || "English";
};

const AutoTranslate: React.FC<AutoTranslateProps> = ({ children }) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (language === "en") {
      setTranslatedText(children);
      return;
    }

    setIsTranslating(true);
    translateText(children, language)
      .then((translated) => {
        setTranslatedText(translated);
      })
      .finally(() => {
        setIsTranslating(false);
      });
  }, [children, language]);

  return (
    <span className={isTranslating ? "opacity-75 transition-opacity" : ""}>
      {translatedText}
    </span>
  );
};

export default AutoTranslate;
