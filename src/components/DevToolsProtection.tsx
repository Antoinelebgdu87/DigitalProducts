import { useEffect } from "react";

const DevToolsProtection = () => {
  useEffect(() => {
    // Bloquer le clic droit
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Bloquer F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
    const blockDevTools = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }

      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }

      // Ctrl+A (Select All)
      if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();
        return false;
      }

      // Ctrl+P (Print)
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
      }
    };

    // Bloquer la sélection de texte
    const blockTextSelection = () => {
      return false;
    };

    // Bloquer le glisser-déposer
    const blockDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Détecter l'ouverture des DevTools (désactivé temporairement)
    const detectDevTools = () => {
      // Fonction désactivée pour éviter les redirections non voulues
      // const threshold = 160;
      // ... code original commenté
    };

    // Désactiver le menu contextuel du navigateur
    const disableRightClick = (e: MouseEvent) => {
      if (e.button === 2) {
        e.preventDefault();
        return false;
      }
    };

    // Ajouter les event listeners
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockDevTools);
    document.addEventListener("selectstart", blockTextSelection);
    document.addEventListener("dragstart", blockDragStart);
    document.addEventListener("mousedown", disableRightClick);
    
    // Vérification DevTools désactivée temporairement
    // const interval = setInterval(detectDevTools, 500);

    // Bloquer la console
    try {
      (window as any).console.log = () => {};
      (window as any).console.warn = () => {};
      (window as any).console.error = () => {};
      (window as any).console.info = () => {};
      (window as any).console.debug = () => {};
      (window as any).console.trace = () => {};
    } catch (e) {
      // Ignore errors
    }

    // Message d'avertissement pour la console
    setTimeout(() => {
      try {
        console.clear();
        console.log("%cATTENTION!", "color: red; font-size: 50px; font-weight: bold;");
        console.log("%cL'utilisation des outils de développement est interdite sur ce site.", "color: red; font-size: 16px;");
        console.log("%cToute tentative de manipulation pourra être signalée.", "color: red; font-size: 16px;");
      } catch (e) {
        // Ignore errors
      }
    }, 1000);

    // Cleanup function
    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockDevTools);
      document.removeEventListener("selectstart", blockTextSelection);
      document.removeEventListener("dragstart", blockDragStart);
      document.removeEventListener("mousedown", disableRightClick);
      // clearInterval(interval); // Désactivé car interval n'est plus défini
    };
  }, []);

  return null; // Ce composant n'affiche rien
};

export default DevToolsProtection;
