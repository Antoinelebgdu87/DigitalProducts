import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLanguage = "fr" | "en" | "pt" | "ja" | "es" | "de" | "it" | "zh";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  languages: { code: SupportedLanguage; name: string; flag: string }[];
}

const translations: Record<SupportedLanguage, Record<string, string>> = {
  fr: {
    // Navigation & UI
    "nav.home": "Accueil",
    "nav.admin": "Administration",
    "nav.settings": "Paramètres",
    "nav.logout": "Déconnexion",
    
    // Authentication
    "auth.login": "Se connecter",
    "auth.logout": "Se déconnecter",
    "auth.username": "Nom d'utilisateur",
    "auth.password": "Mot de passe",
    "auth.login.success": "Connexion réussie",
    "auth.login.error": "Identifiants incorrects",
    "auth.quick.access": "Accès rapide administrateur",
    "auth.connecting": "Connexion...",
    
    // Settings
    "settings.title": "Paramètres",
    "settings.theme": "Thème",
    "settings.language": "Langue",
    "settings.save": "Enregistrer",
    "settings.cancel": "Annuler",
    "settings.reset": "Réinitialiser",
    
    // Themes
    "theme.system": "Système",
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.blue": "Bleu",
    "theme.purple": "Violet",
    "theme.green": "Vert",
    "theme.red": "Rouge",
    "theme.orange": "Orange",
    
    // Common
    "common.close": "Fermer",
    "common.open": "Ouvrir",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    
    // Admin
    "admin.dashboard": "Tableau de bord",
    "admin.users": "Utilisateurs",
    "admin.settings": "Paramètres admin",
    "admin.maintenance": "Maintenance",

    // Homepage
    "home.title": "DigitalHub",
    "home.subtitle": "Votre plateforme numérique",
    "home.description": "Découvrez notre collection de produits numériques premium",
    "home.featured": "Produits en vedette",
    "home.shop": "Boutique",
    "home.all_products": "Tous les produits",
    "home.no_products": "Aucun produit disponible",
    "home.loading": "Chargement des produits...",
    "home.footer": "Tous droits réservés",
  },
  en: {
    // Navigation & UI
    "nav.home": "Home",
    "nav.admin": "Administration",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    
    // Authentication
    "auth.login": "Login",
    "auth.logout": "Logout",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.login.success": "Login successful",
    "auth.login.error": "Invalid credentials",
    "auth.quick.access": "Quick admin access",
    "auth.connecting": "Connecting...",
    
    // Settings
    "settings.title": "Settings",
    "settings.theme": "Theme",
    "settings.language": "Language",
    "settings.save": "Save",
    "settings.cancel": "Cancel",
    "settings.reset": "Reset",
    
    // Themes
    "theme.system": "System",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.blue": "Blue",
    "theme.purple": "Purple",
    "theme.green": "Green",
    "theme.red": "Red",
    "theme.orange": "Orange",
    
    // Common
    "common.close": "Close",
    "common.open": "Open",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    
    // Admin
    "admin.dashboard": "Dashboard",
    "admin.users": "Users",
    "admin.settings": "Admin Settings",
    "admin.maintenance": "Maintenance",

    // Homepage
    "home.title": "DigitalHub",
    "home.subtitle": "Your digital platform",
    "home.description": "Discover our premium digital products collection",
    "home.featured": "Featured Products",
    "home.shop": "Shop",
    "home.all_products": "All Products",
    "home.no_products": "No products available",
    "home.loading": "Loading products...",
    "home.footer": "All rights reserved",
  },
  pt: {
    // Navigation & UI
    "nav.home": "Início",
    "nav.admin": "Administração",
    "nav.settings": "Configurações",
    "nav.logout": "Sair",
    
    // Authentication
    "auth.login": "Entrar",
    "auth.logout": "Sair",
    "auth.username": "Nome de usuário",
    "auth.password": "Senha",
    "auth.login.success": "Login realizado com sucesso",
    "auth.login.error": "Credenciais inválidas",
    "auth.quick.access": "Acesso rápido do administrador",
    "auth.connecting": "Conectando...",
    
    // Settings
    "settings.title": "Configurações",
    "settings.theme": "Tema",
    "settings.language": "Idioma",
    "settings.save": "Salvar",
    "settings.cancel": "Cancelar",
    "settings.reset": "Redefinir",
    
    // Themes
    "theme.system": "Sistema",
    "theme.light": "Claro",
    "theme.dark": "Escuro",
    "theme.blue": "Azul",
    "theme.purple": "Roxo",
    "theme.green": "Verde",
    "theme.red": "Vermelho",
    "theme.orange": "Laranja",
    
    // Common
    "common.close": "Fechar",
    "common.open": "Abrir",
    "common.edit": "Editar",
    "common.delete": "Excluir",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.success": "Sucesso",
    
    // Admin
    "admin.dashboard": "Painel",
    "admin.users": "Usuários",
    "admin.settings": "Configurações Admin",
    "admin.maintenance": "Manutenção",

    // Homepage
    "home.title": "DigitalHub",
    "home.subtitle": "Sua plataforma digital",
    "home.description": "Descubra nossa coleç��o de produtos digitais premium",
    "home.featured": "Produtos em Destaque",
    "home.shop": "Loja",
    "home.all_products": "Todos os Produtos",
    "home.no_products": "Nenhum produto disponível",
    "home.loading": "Carregando produtos...",
    "home.footer": "Todos os direitos reservados",
  },
  ja: {
    // Navigation & UI
    "nav.home": "ホーム",
    "nav.admin": "管理",
    "nav.settings": "設定",
    "nav.logout": "ログアウト",
    
    // Authentication
    "auth.login": "ログイン",
    "auth.logout": "ログアウト",
    "auth.username": "ユーザー名",
    "auth.password": "パスワード",
    "auth.login.success": "ログイン成功",
    "auth.login.error": "認証情報が正しくありません",
    "auth.quick.access": "管理者クイックアクセス",
    "auth.connecting": "接続中...",
    
    // Settings
    "settings.title": "設定",
    "settings.theme": "テーマ",
    "settings.language": "言語",
    "settings.save": "保存",
    "settings.cancel": "キャンセル",
    "settings.reset": "リセット",
    
    // Themes
    "theme.system": "システム",
    "theme.light": "ライト",
    "theme.dark": "ダー���",
    "theme.blue": "青",
    "theme.purple": "紫",
    "theme.green": "緑",
    "theme.red": "赤",
    "theme.orange": "オレンジ",
    
    // Common
    "common.close": "閉じる",
    "common.open": "開く",
    "common.edit": "編集",
    "common.delete": "削除",
    "common.save": "保存",
    "common.cancel": "キャンセル",
    "common.loading": "読み込み中...",
    "common.error": "エラー",
    "common.success": "成功",
    
    // Admin
    "admin.dashboard": "ダッシュボード",
    "admin.users": "ユーザー",
    "admin.settings": "管理設定",
    "admin.maintenance": "メンテナンス",

    // Homepage
    "home.title": "DigitalHub",
    "home.subtitle": "あなたのデジタルプラットフォーム",
    "home.description": "プレミアムデジタル製品コレクションを発見",
    "home.featured": "注目商品",
    "home.shop": "ショップ",
    "home.all_products": "全商品",
    "home.no_products": "利用可能な商品がありません",
    "home.loading": "商品を読み込み中...",
    "home.footer": "全著作権所有",
  },
  es: {
    // Navigation & UI
    "nav.home": "Inicio",
    "nav.admin": "Administración",
    "nav.settings": "Configuración",
    "nav.logout": "Cerrar sesión",
    
    // Authentication
    "auth.login": "Iniciar sesión",
    "auth.logout": "Cerrar sesión",
    "auth.username": "Nombre de usuario",
    "auth.password": "Contraseña",
    "auth.login.success": "Inicio de sesión exitoso",
    "auth.login.error": "Credenciales inválidas",
    "auth.quick.access": "Acceso rápido de administrador",
    "auth.connecting": "Conectando...",
    
    // Settings
    "settings.title": "Configuración",
    "settings.theme": "Tema",
    "settings.language": "Idioma",
    "settings.save": "Guardar",
    "settings.cancel": "Cancelar",
    "settings.reset": "Restablecer",
    
    // Themes
    "theme.system": "Sistema",
    "theme.light": "Claro",
    "theme.dark": "Oscuro",
    "theme.blue": "Azul",
    "theme.purple": "Morado",
    "theme.green": "Verde",
    "theme.red": "Rojo",
    "theme.orange": "Naranja",
    
    // Common
    "common.close": "Cerrar",
    "common.open": "Abrir",
    "common.edit": "Editar",
    "common.delete": "Eliminar",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    
    // Admin
    "admin.dashboard": "Panel",
    "admin.users": "Usuarios",
    "admin.settings": "Configuración Admin",
    "admin.maintenance": "Mantenimiento",
  },
  de: {
    // Navigation & UI
    "nav.home": "Startseite",
    "nav.admin": "Verwaltung",
    "nav.settings": "Einstellungen",
    "nav.logout": "Abmelden",
    
    // Authentication
    "auth.login": "Anmelden",
    "auth.logout": "Abmelden",
    "auth.username": "Benutzername",
    "auth.password": "Passwort",
    "auth.login.success": "Anmeldung erfolgreich",
    "auth.login.error": "Ungültige Anmeldedaten",
    "auth.quick.access": "Schneller Admin-Zugriff",
    "auth.connecting": "Verbinden...",
    
    // Settings
    "settings.title": "Einstellungen",
    "settings.theme": "Design",
    "settings.language": "Sprache",
    "settings.save": "Speichern",
    "settings.cancel": "Abbrechen",
    "settings.reset": "Zurücksetzen",
    
    // Themes
    "theme.system": "System",
    "theme.light": "Hell",
    "theme.dark": "Dunkel",
    "theme.blue": "Blau",
    "theme.purple": "Lila",
    "theme.green": "Gr��n",
    "theme.red": "Rot",
    "theme.orange": "Orange",
    
    // Common
    "common.close": "Schließen",
    "common.open": "Öffnen",
    "common.edit": "Bearbeiten",
    "common.delete": "Löschen",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.loading": "Laden...",
    "common.error": "Fehler",
    "common.success": "Erfolg",
    
    // Admin
    "admin.dashboard": "Dashboard",
    "admin.users": "Benutzer",
    "admin.settings": "Admin-Einstellungen",
    "admin.maintenance": "Wartung",
  },
  it: {
    // Navigation & UI
    "nav.home": "Home",
    "nav.admin": "Amministrazione",
    "nav.settings": "Impostazioni",
    "nav.logout": "Disconnetti",
    
    // Authentication
    "auth.login": "Accedi",
    "auth.logout": "Disconnetti",
    "auth.username": "Nome utente",
    "auth.password": "Password",
    "auth.login.success": "Accesso riuscito",
    "auth.login.error": "Credenziali non valide",
    "auth.quick.access": "Accesso rapido amministratore",
    "auth.connecting": "Connessione...",
    
    // Settings
    "settings.title": "Impostazioni",
    "settings.theme": "Tema",
    "settings.language": "Lingua",
    "settings.save": "Salva",
    "settings.cancel": "Annulla",
    "settings.reset": "Ripristina",
    
    // Themes
    "theme.system": "Sistema",
    "theme.light": "Chiaro",
    "theme.dark": "Scuro",
    "theme.blue": "Blu",
    "theme.purple": "Viola",
    "theme.green": "Verde",
    "theme.red": "Rosso",
    "theme.orange": "Arancione",
    
    // Common
    "common.close": "Chiudi",
    "common.open": "Apri",
    "common.edit": "Modifica",
    "common.delete": "Elimina",
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.loading": "Caricamento...",
    "common.error": "Errore",
    "common.success": "Successo",
    
    // Admin
    "admin.dashboard": "Dashboard",
    "admin.users": "Utenti",
    "admin.settings": "Impostazioni Admin",
    "admin.maintenance": "Manutenzione",
  },
  zh: {
    // Navigation & UI
    "nav.home": "首页",
    "nav.admin": "管理",
    "nav.settings": "设置",
    "nav.logout": "登出",
    
    // Authentication
    "auth.login": "登录",
    "auth.logout": "登出",
    "auth.username": "用户名",
    "auth.password": "密码",
    "auth.login.success": "登录成功",
    "auth.login.error": "凭据无效",
    "auth.quick.access": "管理员快速访问",
    "auth.connecting": "连接中...",
    
    // Settings
    "settings.title": "设置",
    "settings.theme": "主题",
    "settings.language": "语言",
    "settings.save": "保存",
    "settings.cancel": "取消",
    "settings.reset": "重置",
    
    // Themes
    "theme.system": "系统",
    "theme.light": "浅色",
    "theme.dark": "深色",
    "theme.blue": "蓝色",
    "theme.purple": "紫色",
    "theme.green": "绿色",
    "theme.red": "红色",
    "theme.orange": "橙色",
    
    // Common
    "common.close": "关闭",
    "common.open": "打开",
    "common.edit": "编辑",
    "common.delete": "删除",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.loading": "加载中...",
    "common.error": "错误",
    "common.success": "成功",
    
    // Admin
    "admin.dashboard": "仪表板",
    "admin.users": "用户",
    "admin.settings": "管理设置",
    "admin.maintenance": "维护",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>("fr");

  const languages = [
    { code: "fr" as SupportedLanguage, name: "Français", flag: "🇫🇷" },
    { code: "en" as SupportedLanguage, name: "English", flag: "🇺🇸" },
    { code: "pt" as SupportedLanguage, name: "Português", flag: "🇵🇹" },
    { code: "ja" as SupportedLanguage, name: "日本語", flag: "🇯🇵" },
    { code: "es" as SupportedLanguage, name: "Español", flag: "🇪🇸" },
    { code: "de" as SupportedLanguage, name: "Deutsch", flag: "🇩🇪" },
    { code: "it" as SupportedLanguage, name: "Italiano", flag: "🇮🇹" },
    { code: "zh" as SupportedLanguage, name: "中文", flag: "🇨🇳" },
  ];

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("app_language") as SupportedLanguage;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
