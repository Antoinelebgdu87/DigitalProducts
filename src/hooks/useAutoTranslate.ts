import { useEffect, useRef } from "react";
import { useTranslation } from "@/context/TranslationContext";

/**
 * Hook pour traduire automatiquement le contenu du DOM
 */
export const useAutoTranslate = () => {
  const { currentLanguage, isTranslationEnabled, translations } =
    useTranslation();
  const originalTexts = useRef<Map<Node, string>>(new Map());

  useEffect(() => {
    if (!isTranslationEnabled || currentLanguage === "fr") {
      // Restaurer les textes originaux
      originalTexts.current.forEach((originalText, node) => {
        if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent !== originalText
        ) {
          node.textContent = originalText;
        }
      });
      return;
    }

    const translateDOMNodes = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Ignorer les scripts, styles et éléments cachés
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;

            const tagName = parent.tagName?.toLowerCase();
            if (["script", "style", "noscript"].includes(tagName)) {
              return NodeFilter.FILTER_REJECT;
            }

            // Ignorer les éléments avec des attributs spéciaux
            if (
              parent.hasAttribute("data-no-translate") ||
              parent.classList.contains("no-translate")
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            const text = node.textContent?.trim();
            if (!text || text.length < 2) {
              return NodeFilter.FILTER_REJECT;
            }

            return NodeFilter.FILTER_ACCEPT;
          },
        },
      );

      const nodesToTranslate: Node[] = [];
      let node;

      while ((node = walker.nextNode())) {
        nodesToTranslate.push(node);

        // Sauvegarder le texte original
        if (!originalTexts.current.has(node)) {
          originalTexts.current.set(node, node.textContent || "");
        }
      }

      // Appliquer les traductions
      nodesToTranslate.forEach((textNode) => {
        const originalText = originalTexts.current.get(textNode);
        if (originalText && translations[originalText]) {
          textNode.textContent = translations[originalText];
        }
      });
    };

    // Traduire immédiatement
    translateDOMNodes();

    // Observer les changements du DOM pour traduire le nouveau contenu
    const observer = new MutationObserver((mutations) => {
      let shouldTranslate = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE ||
              node.nodeType === Node.TEXT_NODE
            ) {
              shouldTranslate = true;
            }
          });
        }
      });

      if (shouldTranslate) {
        // Délai pour permettre au DOM de se stabiliser
        setTimeout(translateDOMNodes, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [currentLanguage, isTranslationEnabled, translations]);

  return {
    isTranslating:
      Object.keys(translations).length === 0 &&
      isTranslationEnabled &&
      currentLanguage !== "fr",
  };
};

/**
 * Hook pour marquer des éléments comme non-traduisibles
 */
export const useNoTranslate = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute("data-no-translate", "true");
    }
  }, [ref]);
};

export default useAutoTranslate;
