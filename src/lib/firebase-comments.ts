import { Comment } from "@/types";

// Service de commentaires en mode local/fallback
class LocalCommentsService {
  private comments: Comment[] = [];
  private listeners: ((comments: Comment[]) => void)[] = [];

  constructor() {
    // Charger les commentaires depuis localStorage si disponibles
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem("offline_comments");
      if (stored) {
        this.comments = JSON.parse(stored).map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }));
      }
    } catch (error) {
      console.warn("Erreur lors du chargement des commentaires locaux:", error);
      this.comments = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem("offline_comments", JSON.stringify(this.comments));
    } catch (error) {
      console.warn(
        "Erreur lors de la sauvegarde des commentaires locaux:",
        error,
      );
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener([...this.comments]);
      } catch (error) {
        console.error("Erreur dans un listener de commentaires:", error);
      }
    });
  }

  getComments(productId: string): Comment[] {
    return this.comments
      .filter((c) => c.productId === productId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  addComment(comment: Omit<Comment, "id">): Comment {
    const newComment: Comment = {
      ...comment,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    this.comments.push(newComment);
    this.saveToStorage();
    this.notifyListeners();

    return newComment;
  }

  deleteComment(commentId: string): boolean {
    const index = this.comments.findIndex((c) => c.id === commentId);
    if (index !== -1) {
      this.comments.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  subscribe(
    productId: string,
    callback: (comments: Comment[]) => void,
  ): () => void {
    // Appeler immédiatement avec les commentaires actuels
    const filteredComments = this.getComments(productId);
    callback(filteredComments);

    // Créer un listener spécifique pour ce produit
    const listener = (allComments: Comment[]) => {
      const productComments = allComments
        .filter((c) => c.productId === productId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      callback(productComments);
    };

    this.listeners.push(listener);

    // Retourner la fonction de désabonnement
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  clear() {
    this.comments = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  // Méthode pour synchroniser avec Firebase quand la connexion revient
  async syncWithFirebase() {
    // Cette méthode pourrait être utilisée plus tard pour synchroniser
    // les commentaires locaux avec Firebase quand la connexion revient
    console.log(
      "🔄 Synchronisation avec Firebase (à implémenter si nécessaire)",
    );
  }
}

// Instance singleton du service local
export const localCommentsService = new LocalCommentsService();

// Fonction pour vérifier si nous devons utiliser le mode offline
export const shouldUseOfflineMode = (): boolean => {
  // Vérifier la connectivité réseau
  if (!navigator.onLine) {
    return true;
  }

  // Vérifier si Firebase a eu des erreurs récentes
  const lastFirebaseError = localStorage.getItem("last_firebase_error");
  if (lastFirebaseError) {
    const errorTime = parseInt(lastFirebaseError);
    const now = Date.now();
    // Si l'erreur est récente (moins de 5 minutes), utiliser le mode offline
    if (now - errorTime < 5 * 60 * 1000) {
      return true;
    }
  }

  return false;
};

// Fonction pour marquer une erreur Firebase
export const markFirebaseError = () => {
  localStorage.setItem("last_firebase_error", Date.now().toString());
};

// Fonction pour marquer Firebase comme fonctionnel
export const markFirebaseWorking = () => {
  localStorage.removeItem("last_firebase_error");
};
