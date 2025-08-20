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
      // Interface de traduction
      'Paramètres de traduction': 'Translation Settings',
      'Configurez la langue d\'affichage et activez la traduction automatique avec IA.': 'Configure display language and enable automatic AI translation.',
      'Traduction IA': 'AI Translation',
      'Gratuit': 'Free',
      'Activez la traduction automatique de tous les textes avec OpenRouter AI': 'Enable automatic translation of all texts with OpenRouter AI',
      'Traduction en cours...': 'Translating...',
      'Langue d\'affichage': 'Display Language',
      'Service de traduction': 'Translation Service',
      'Traduction hybride avec dictionnaire intégré et API LibreTranslate gratuite.': 'Hybrid translation with integrated dictionary and free LibreTranslate API.',
      'Les traductions sont mises en cache pour des performances optimales.': 'Translations are cached for optimal performance.',
      'Textes traduits': 'Translated texts',
      'Mode actuel': 'Current mode',
      'Original': 'Original',
      'Traduit': 'Translated',
      'Fermer': 'Close',
      'Langue: ': 'Language: ',
      'IA activée': 'AI enabled',
      'Langues': 'Languages',
      'Paramètres avancés': 'Advanced settings',

      // Page d'accueil
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
      'All rights reserved': 'All rights reserved',

      // Conditions d'utilisation
      'Conditions d\'Utilisation': 'Terms of Service',
      'Accord Légal et Directives d\'Usage': 'Legal Agreement and Usage Guidelines',
      'Date d\'entrée en vigueur :': 'Effective Date:',
      'Retour à l\'accueil': 'Back to Home',
      'Imprimer les conditions': 'Print Terms',
      'Tous droits réservés.': 'All rights reserved.',
      'En utilisant DigitalHub, vous reconnaissez avoir lu, compris et accepté d\'être lié par ces Conditions d\'Utilisation.': 'By using DigitalHub, you acknowledge that you have read, understood and agreed to be bound by these Terms of Service.',
      'Accord aux Conditions': 'Agreement to Terms',
      'Description du Service': 'Service Description',
      'Politique de Non-Remboursement': 'No Refund Policy',
      'TOUTES LES VENTES SONT FINALES - AUCUN REMBOURSEMENT': 'ALL SALES ARE FINAL - NO REFUNDS',
      'Changement d\'avis après achat': 'Change of mind after purchase',
      'Incompatibilité technique avec les systèmes utilisateur': 'Technical incompatibility with user systems',
      'Comptes Utilisateur et Responsabilités': 'User Accounts and Responsibilities',
      'Droits de Propriété Intellectuelle': 'Intellectual Property Rights',
      'Vous ne pouvez PAS :': 'You may NOT:',
      'Revendre, redistribuer ou partager les produits achetés': 'Resell, redistribute or share purchased products',
      'Avertissements et Limitation de Responsabilité': 'Warnings and Limitation of Liability',
      'Résiliation de Compte': 'Account Termination',
      'Politique de Confidentialité': 'Privacy Policy',
      'Modifications des Conditions': 'Terms Modifications',
      'Loi Applicable et Juridiction': 'Applicable Law and Jurisdiction',
      'Ces Conditions seront interprétées et régies par les lois de la France': 'These Terms shall be interpreted and governed by the laws of France',
      'Divisibilité': 'Severability',
      'Informations de Contact': 'Contact Information',
      'Avis Important': 'Important Notice',
      'Veuillez ne pas nous contacter concernant des demandes de remboursement, car toutes les ventes sont finales.': 'Please do not contact us regarding refund requests, as all sales are final.',

      // Modales utilisateur
      'Bienvenue !': 'Welcome!',
      'Créez votre nom d\'utilisateur pour accéder à la plateforme': 'Create your username to access the platform',
      'Nom d\'utilisateur': 'Username',
      'Entrez votre pseudo': 'Enter your username',
      'Générer un nouveau pseudo': 'Generate new username',
      'Ou utilisez le pseudo généré automatiquement': 'Or use the automatically generated username',
      'Création...': 'Creating...',
      'Créer mon compte': 'Create my account',
      'Votre pseudo sera visible par les autres utilisateurs': 'Your username will be visible to other users',

      // Avertissements
      'Nouvel avertissement': 'New Warning',
      'Nouveaux avertissements': 'New Warnings',
      'Avertissement :': 'Warning:',
      'Veuillez respecter les règles de la plateforme pour éviter de futurs avertissements.': 'Please respect platform rules to avoid future warnings.',
      'Les avertissements répétés peuvent conduire à un bannissement.': 'Repeated warnings may lead to a ban.',
      'J\'ai compris': 'I understand',

      // ToS Modal
      'Veuillez accepter nos Conditions pour continuer': 'Please accept our Terms to continue',
      'Accepter': 'Accept',
      'Refuser': 'Decline',
      'Lire les Conditions': 'Read Terms',
      'Ventes finales - AUCUN REMBOURSEMENT': 'Final sales - NO REFUNDS',
      'Produits fournis \'en l\'état\'': 'Products provided \'as is\'',
      'Licence personnelle uniquement': 'Personal license only',
      'En acceptant, vous acceptez nos Conditions d\'Utilisation complètes.': 'By accepting, you agree to our complete Terms of Service.',

      // Administration
      'Administration': 'Administration',
      'Secure access to admin panel': 'Secure access to admin panel',
      'Username': 'Username',
      'Password': 'Password',
      'Sign In': 'Sign In',
      'Connecting...': 'Connecting...',
      '← Back to Home': '← Back to Home'
    },
    pt: {
      // Interface de tradução
      'Paramètres de traduction': 'Configurações de Tradução',
      'Configurez la langue d\'affichage et activez la traduction automatique avec IA.': 'Configure o idioma de exibição e ative a tradução automática com IA.',
      'Traduction IA': 'Tradução IA',
      'Gratuit': 'Grátis',
      'Activez la traduction automatique de tous les textes avec OpenRouter AI': 'Ative a tradução automática de todos os textos com OpenRouter AI',
      'Traduction en cours...': 'Traduzindo...',
      'Langue d\'affichage': 'Idioma de Exibição',
      'Service de traduction': 'Serviço de Tradução',
      'Traduction hybride avec dictionnaire intégré et API LibreTranslate gratuite.': 'Tradução híbrida com dicionário integrado e API LibreTranslate gratuita.',
      'Les traductions sont mises en cache pour des performances optimales.': 'As traduções são armazenadas em cache para desempenho ideal.',
      'Textes traduits': 'Textos traduzidos',
      'Mode actuel': 'Modo atual',
      'Original': 'Original',
      'Traduit': 'Traduzido',
      'Fermer': 'Fechar',
      'Langue: ': 'Idioma: ',
      'IA activée': 'IA ativada',
      'Langues': 'Idiomas',
      'Paramètres avancés': 'Configurações avançadas',

      // Página inicial
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
      'Handpicked collection of premium digital assets, tools, and resources for creators and professionals.': 'Coleção selecionada de ativos digitais premium, ferramentas e recursos para criadores e profissionais.',
      'Loading Products': 'Carregando Produtos',
      'Fetching the latest digital products...': 'Buscando os produtos digitais mais recentes...',
      'Coming Soon': 'Em Breve',
      'Amazing products are being curated for you. Stay tuned for something incredible!': 'Produtos incríveis estão sendo selecionados para você. Fique ligado para algo incrível!',
      'All rights reserved': 'Todos os direitos reservados',

      // Termos de serviço
      'Conditions d\'Utilisation': 'Termos de Serviço',
      'Accord Légal et Directives d\'Usage': 'Acordo Legal e Diretrizes de Uso',
      'Date d\'entrée en vigueur :': 'Data de entrada em vigor:',
      'Retour à l\'accueil': 'Voltar ao início',
      'Imprimer les conditions': 'Imprimir termos',
      'Tous droits réservés.': 'Todos os direitos reservados.',
      'En utilisant DigitalHub, vous reconnaissez avoir lu, compris et accepté d\'être lié par ces Conditions d\'Utilisation.': 'Ao usar o DigitalHub, você reconhece ter lido, compreendido e concordado em estar vinculado a estes Termos de Serviço.',
      'Accord aux Conditions': 'Acordo com os Termos',
      'Description du Service': 'Descrição do Serviço',
      'Politique de Non-Remboursement': 'Política de Não Reembolso',
      'TOUTES LES VENTES SONT FINALES - AUCUN REMBOURSEMENT': 'TODAS AS VENDAS SÃO FINAIS - SEM REEMBOLSO',
      'Changement d\'avis après achat': 'Mudança de opinião após compra',
      'Incompatibilité technique avec les systèmes utilisateur': 'Incompatibilidade técnica com sistemas do usuário',
      'Comptes Utilisateur et Responsabilités': 'Contas de Usuário e Responsabilidades',
      'Droits de Propriété Intellectuelle': 'Direitos de Propriedade Intelectual',
      'Vous ne pouvez PAS :': 'Você NÃO pode:',
      'Revendre, redistribuer ou partager les produits achetés': 'Revender, redistribuir ou compartilhar produtos comprados',
      'Avertissements et Limitation de Responsabilité': 'Avisos e Limitação de Responsabilidade',
      'Résiliation de Compte': 'Encerramento de Conta',
      'Politique de Confidentialité': 'Política de Privacidade',
      'Modifications des Conditions': 'Modificações dos Termos',
      'Loi Applicable et Juridiction': 'Lei Aplicável e Jurisdição',
      'Ces Conditions seront interprétées et régies par les lois de la France': 'Estes Termos serão interpretados e regidos pelas leis da França',
      'Divisibilité': 'Divisibilidade',
      'Informations de Contact': 'Informações de Contato',
      'Avis Important': 'Aviso Importante',
      'Veuillez ne pas nous contacter concernant des demandes de remboursement, car toutes les ventes sont finales.': 'Por favor, não nos contate sobre solicitações de reembolso, pois todas as vendas são finais.',

      // Modais de usuário
      'Bienvenue !': 'Bem-vindo!',
      'Créez votre nom d\'utilisateur pour accéder à la plateforme': 'Crie seu nome de usuário para acessar a plataforma',
      'Nom d\'utilisateur': 'Nome de usuário',
      'Entrez votre pseudo': 'Digite seu apelido',
      'Générer un nouveau pseudo': 'Gerar novo apelido',
      'Ou utilisez le pseudo généré automatiquement': 'Ou use o apelido gerado automaticamente',
      'Création...': 'Criando...',
      'Créer mon compte': 'Criar minha conta',
      'Votre pseudo sera visible par les autres utilisateurs': 'Seu apelido será visível para outros usuários',

      // Avisos
      'Nouvel avertissement': 'Novo Aviso',
      'Nouveaux avertissements': 'Novos Avisos',
      'Avertissement :': 'Aviso:',
      'Veuillez respecter les règles de la plateforme pour éviter de futurs avertissements.': 'Por favor, respeite as regras da plataforma para evitar futuros avisos.',
      'Les avertissements répétés peuvent conduire à un bannissement.': 'Avisos repetidos podem levar a um banimento.',
      'J\'ai compris': 'Entendi',

      // Modal ToS
      'Veuillez accepter nos Conditions pour continuer': 'Por favor, aceite nossos Termos para continuar',
      'Accepter': 'Aceitar',
      'Refuser': 'Recusar',
      'Lire les Conditions': 'Ler Termos',
      'Ventes finales - AUCUN REMBOURSEMENT': 'Vendas finais - SEM REEMBOLSO',
      'Produits fournis \'en l\'état\'': 'Produtos fornecidos \'como estão\'',
      'Licence personnelle uniquement': 'Licença pessoal apenas',
      'En acceptant, vous acceptez nos Conditions d\'Utilisation complètes.': 'Ao aceitar, você concorda com nossos Termos de Serviço completos.',

      // Administração
      'Administration': 'Administração',
      'Secure access to admin panel': 'Acesso seguro ao painel de administração',
      'Username': 'Nome de usuário',
      'Password': 'Senha',
      'Sign In': 'Entrar',
      'Connecting...': 'Conectando...',
      '← Back to Home': '← Voltar ao Início'
    },
    es: {
      // Interfaz de traducción
      'Paramètres de traduction': 'Configuración de Traducción',
      'Configurez la langue d\'affichage et activez la traduction automatique avec IA.': 'Configure el idioma de visualización y active la traducción automática con IA.',
      'Traduction IA': 'Traducción IA',
      'Gratuit': 'Gratis',
      'Activez la traduction automatique de tous les textes avec OpenRouter AI': 'Active la traducción automática de todos los textos con OpenRouter AI',
      'Traduction en cours...': 'Traduciendo...',
      'Langue d\'affichage': 'Idioma de Visualización',
      'Service de traduction': 'Servicio de Traducción',
      'Traduction hybride avec dictionnaire intégré et API LibreTranslate gratuite.': 'Traducción híbrida con diccionario integrado y API LibreTranslate gratuita.',
      'Les traductions sont mises en cache pour des performances optimales.': 'Las traducciones se almacenan en caché para un rendimiento óptimo.',
      'Textes traduits': 'Textos traducidos',
      'Mode actuel': 'Modo actual',
      'Original': 'Original',
      'Traduit': 'Traducido',
      'Fermer': 'Cerrar',
      'Langue: ': 'Idioma: ',
      'IA activée': 'IA activada',
      'Langues': 'Idiomas',
      'Paramètres avancés': 'Configuración avanzada',

      // Página de inicio
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
      'Handpicked collection of premium digital assets, tools, and resources for creators and professionals.': 'Colección seleccionada de activos digitales premium, herramientas y recursos para creadores y profesionales.',
      'Loading Products': 'Cargando Productos',
      'Fetching the latest digital products...': 'Obteniendo los productos digitales más recientes...',
      'Coming Soon': 'Próximamente',
      'Amazing products are being curated for you. Stay tuned for something incredible!': '¡Productos increíbles están siendo seleccionados para ti. ¡Mantente atento para algo increíble!',
      'All rights reserved': 'Todos los derechos reservados',

      // Términos de servicio
      'Conditions d\'Utilisation': 'Términos de Servicio',
      'Accord Légal et Directives d\'Usage': 'Acuerdo Legal y Directrices de Uso',
      'Date d\'entrée en vigueur :': 'Fecha de entrada en vigor:',
      'Retour à l\'accueil': 'Volver al inicio',
      'Imprimer les conditions': 'Imprimir términos',
      'Tous droits réservés.': 'Todos los derechos reservados.',
      'En utilisant DigitalHub, vous reconnaissez avoir lu, compris et accepté d\'être lié par ces Conditions d\'Utilisation.': 'Al usar DigitalHub, reconoces haber leído, entendido y aceptado estar sujeto a estos Términos de Servicio.',

      // Modales de usuario
      'Bienvenue !': '¡Bienvenido!',
      'Créez votre nom d\'utilisateur pour accéder à la plateforme': 'Crea tu nombre de usuario para acceder a la plataforma',
      'Nom d\'utilisateur': 'Nombre de usuario',
      'Entrez votre pseudo': 'Ingresa tu apodo',
      'Générer un nouveau pseudo': 'Generar nuevo apodo',
      'Ou utilisez le pseudo généré automatiquement': 'O usa el apodo generado automáticamente',
      'Création...': 'Creando...',
      'Créer mon compte': 'Crear mi cuenta',
      'Votre pseudo sera visible par les autres utilisateurs': 'Tu apodo será visible para otros usuarios',

      // Avisos
      'Nouvel avertissement': 'Nueva Advertencia',
      'Nouveaux avertissements': 'Nuevas Advertencias',
      'Avertissement :': 'Advertencia:',
      'Veuillez respecter les règles de la plateforme pour éviter de futurs avertissements.': 'Por favor, respeta las reglas de la plataforma para evitar futuras advertencias.',
      'Les avertissements répétés peuvent conduire à un bannissement.': 'Las advertencias repetidas pueden llevar a un baneo.',
      'J\'ai compris': 'Entendido',

      // Modal ToS
      'Veuillez accepter nos Conditions pour continuer': 'Por favor acepta nuestros Términos para continuar',
      'Accepter': 'Aceptar',
      'Refuser': 'Rechazar',
      'Lire les Conditions': 'Leer Términos',
      'Ventes finales - AUCUN REMBOURSEMENT': 'Ventas finales - SIN REEMBOLSO',
      'Produits fournis \'en l\'état\'': 'Productos proporcionados \'tal como están\'',
      'Licence personnelle uniquement': 'Licencia personal únicamente',
      'En acceptant, vous acceptez nos Conditions d\'Utilisation complètes.': 'Al aceptar, aceptas nuestros Términos de Servicio completos.',

      // Administración
      'Administration': 'Administración',
      'Secure access to admin panel': 'Acceso seguro al panel de administración',
      'Username': 'Nombre de usuario',
      'Password': 'Contraseña',
      'Sign In': 'Iniciar sesión',
      'Connecting...': 'Conectando...',
      '← Back to Home': '← Volver al Inicio'
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
