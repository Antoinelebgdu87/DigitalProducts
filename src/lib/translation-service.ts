export type SupportedLanguage = "fr" | "en" | "pt" | "ja" | "es" | "de" | "it" | "zh";

interface TranslationCache {
  [key: string]: {
    [language: string]: string;
  };
}

class TranslationService {
  private cache: TranslationCache = {};
  private apiKey = "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";
  private baseUrl = "https://openrouter.ai/api/v1/chat/completions";
  
  // Utilisation d'un modèle gratuit et performant
  private model = "google/gemma-2-9b-it:free";

  // Mappings des codes de langues vers noms complets
  private languageNames: Record<SupportedLanguage, string> = {
    fr: "French",
    en: "English", 
    pt: "Portuguese",
    ja: "Japanese",
    es: "Spanish",
    de: "German",
    it: "Italian",
    zh: "Chinese"
  };

  private getCacheKey(text: string, targetLanguage: SupportedLanguage): string {
    return `${text}_${targetLanguage}`;
  }

  async translate(text: string, targetLanguage: SupportedLanguage = "fr"): Promise<string> {
    // Si c'est déjà en anglais et on veut de l'anglais, retourner tel quel
    if (targetLanguage === "en") {
      return text;
    }

    const cacheKey = this.getCacheKey(text, targetLanguage);
    
    // Vérifier le cache d'abord
    if (this.cache[text] && this.cache[text][targetLanguage]) {
      return this.cache[text][targetLanguage];
    }

    try {
      const targetLanguageName = this.languageNames[targetLanguage];
      
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "DigitalHub Translation Service"
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the given text to ${targetLanguageName}. Return ONLY the translated text, no explanations or additional content. Maintain the original formatting and tone.`
            },
            {
              role: "user", 
              content: text
            }
          ],
          max_tokens: 200,
          temperature: 0.1,
          stream: false
        })
      });

      if (!response.ok) {
        console.warn(`Translation API error: ${response.status}`);
        return text; // Fallback au texte original
      }

      const data = await response.json();
      const translatedText = data.choices?.[0]?.message?.content?.trim() || text;

      // Mettre en cache la traduction
      if (!this.cache[text]) {
        this.cache[text] = {};
      }
      this.cache[text][targetLanguage] = translatedText;

      return translatedText;
    } catch (error) {
      console.warn("Translation failed:", error);
      return text; // Fallback au texte original
    }
  }

  // Méthode pour traduire plusieurs textes en lot
  async translateBatch(texts: string[], targetLanguage: SupportedLanguage = "fr"): Promise<string[]> {
    const promises = texts.map(text => this.translate(text, targetLanguage));
    return Promise.all(promises);
  }

  // Méthode pour précharger des traductions communes
  async preloadCommonTranslations(targetLanguage: SupportedLanguage = "fr") {
    const commonTexts = [
      "Home",
      "Settings", 
      "Login",
      "Logout",
      "Admin",
      "User",
      "Products",
      "Download",
      "Preview",
      "Comments",
      "Loading...",
      "Save",
      "Cancel",
      "Close",
      "Open",
      "Join Discord",
      "Learn More",
      "Explore Products",
      "Featured Products",
      "All Products",
      "No products available",
      "DigitalHub",
      "Welcome",
      "Language",
      "Theme"
    ];

    await this.translateBatch(commonTexts, targetLanguage);
  }

  // Méthode pour vider le cache
  clearCache() {
    this.cache = {};
  }
}

// Instance singleton
export const translationService = new TranslationService();
