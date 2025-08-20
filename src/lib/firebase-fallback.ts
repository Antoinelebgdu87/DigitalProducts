// Système de fallback pour gérer les erreurs Firebase
export class FirebaseFallback {
  private static isOffline = false;
  private static fallbackData: Map<string, any> = new Map();
  
  // Détecter si Firebase est accessible
  static async checkFirebaseConnection(): Promise<boolean> {
    try {
      // Essayer une opération simple pour tester la connexion
      const { db } = await import('./firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      
      // Test avec un document qui n'existe probablement pas
      await getDoc(doc(db, 'test', 'connectivity'));
      return true;
    } catch (error: any) {
      console.warn('Firebase connection test failed:', error);
      
      // Vérifier si c'est une erreur réseau
      if (
        error?.message?.includes('Failed to fetch') ||
        error?.message?.includes('network') ||
        error?.code === 'unavailable' ||
        error?.code === 'deadline-exceeded'
      ) {
        this.isOffline = true;
        return false;
      }
      
      // Si ce n'est pas une erreur réseau, Firebase fonctionne probablement
      return true;
    }
  }
  
  // Sauvegarder des données en fallback
  static saveToFallback(key: string, data: any): void {
    this.fallbackData.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Sauvegarder aussi dans localStorage pour la persistance
    try {
      localStorage.setItem(`firebase_fallback_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }
  
  // Récupérer des données de fallback
  static getFromFallback(key: string): any | null {
    // D'abord essayer la mémoire
    let fallbackItem = this.fallbackData.get(key);
    
    // Puis essayer localStorage
    if (!fallbackItem) {
      try {
        const stored = localStorage.getItem(`firebase_fallback_${key}`);
        if (stored) {
          fallbackItem = JSON.parse(stored);
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
      }
    }
    
    if (fallbackItem) {
      // Vérifier si les données ne sont pas trop anciennes (1 heure max)
      const maxAge = 60 * 60 * 1000; // 1 heure
      if (Date.now() - fallbackItem.timestamp < maxAge) {
        return fallbackItem.data;
      }
    }
    
    return null;
  }
  
  // Créer des données par défaut pour différents types de collections
  static getDefaultData(collectionName: string): any[] {
    switch (collectionName) {
      case 'products':
        return [
          {
            id: 'default-1',
            title: 'Produit d\'exemple',
            description: 'Description du produit d\'exemple',
            price: 0,
            type: 'free',
            actionType: 'download',
            imageUrl: '/placeholder.svg',
            downloadUrl: '#',
            lives: 1,
            createdAt: new Date().toISOString()
          }
        ];
      
      case 'users':
        return [];
        
      case 'comments':
        return [];
        
      case 'licenses':
        return [];
        
      default:
        return [];
    }
  }
  
  // Wrapper pour les opérations Firebase avec fallback automatique
  static async safeOperation<T>(
    operation: () => Promise<T>,
    fallbackKey: string,
    defaultValue: T
  ): Promise<T> {
    try {
      // Essayer l'opération Firebase
      const result = await operation();
      
      // Si réussie, sauvegarder en fallback
      this.saveToFallback(fallbackKey, result);
      this.isOffline = false;
      
      return result;
    } catch (error: any) {
      console.warn(`Firebase operation failed for ${fallbackKey}:`, error);
      
      // Vérifier si c'est une erreur réseau
      if (
        error?.message?.includes('Failed to fetch') ||
        error?.message?.includes('network') ||
        error?.code === 'unavailable' ||
        error?.code === 'deadline-exceeded'
      ) {
        this.isOffline = true;
        
        // Essayer de récupérer depuis le fallback
        const fallbackData = this.getFromFallback(fallbackKey);
        if (fallbackData !== null) {
          console.info(`Using fallback data for ${fallbackKey}`);
          return fallbackData;
        }
      }
      
      // Si pas de fallback disponible, retourner la valeur par défaut
      console.info(`Using default value for ${fallbackKey}`);
      return defaultValue;
    }
  }
  
  // Vérifier le statut de connexion
  static isFirebaseOffline(): boolean {
    return this.isOffline;
  }
  
  // Nettoyer les données anciennes du fallback
  static cleanupOldFallbackData(): void {
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures
    const now = Date.now();
    
    // Nettoyer la mémoire
    for (const [key, value] of this.fallbackData.entries()) {
      if (now - value.timestamp > maxAge) {
        this.fallbackData.delete(key);
      }
    }
    
    // Nettoyer localStorage
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith('firebase_fallback_')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const data = JSON.parse(stored);
            if (now - data.timestamp > maxAge) {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error cleaning localStorage:', error);
    }
  }
}

// Initialiser le nettoyage automatique
if (typeof window !== 'undefined') {
  // Nettoyer au démarrage
  FirebaseFallback.cleanupOldFallbackData();
  
  // Nettoyer périodiquement (toutes les heures)
  setInterval(() => {
    FirebaseFallback.cleanupOldFallbackData();
  }, 60 * 60 * 1000);
}

export default FirebaseFallback;
