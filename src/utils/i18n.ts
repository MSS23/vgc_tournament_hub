import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: { translation: { 'Profile Settings': 'Profile Settings', 'Play! Pokémon Player ID': 'Play! Pokémon Player ID', 'Name': 'Name', 'Country': 'Country', 'Date of Birth': 'Date of Birth', 'Notification Preferences': 'Notification Preferences', 'Email': 'Email', 'Push': 'Push', 'SMS': 'SMS', 'Tournament Updates': 'Tournament Updates', 'Pairing Notifications': 'Pairing Notifications', 'Round Start Reminders': 'Round Start Reminders', 'Social Interactions': 'Social Interactions', 'Achievement Unlocks': 'Achievement Unlocks', 'Close': 'Close', 'Language': 'Language' } },
  es: { translation: { 'Profile Settings': 'Configuración de Perfil', 'Play! Pokémon Player ID': 'ID de Jugador Play! Pokémon', 'Name': 'Nombre', 'Country': 'País', 'Date of Birth': 'Fecha de Nacimiento', 'Notification Preferences': 'Preferencias de Notificación', 'Email': 'Correo', 'Push': 'Push', 'SMS': 'SMS', 'Tournament Updates': 'Actualizaciones de Torneo', 'Pairing Notifications': 'Notificaciones de Emparejamiento', 'Round Start Reminders': 'Recordatorios de Ronda', 'Social Interactions': 'Interacciones Sociales', 'Achievement Unlocks': 'Desbloqueo de Logros', 'Close': 'Cerrar', 'Language': 'Idioma' } },
  fr: { translation: { 'Profile Settings': 'Paramètres du Profil', 'Play! Pokémon Player ID': 'ID Joueur Play! Pokémon', 'Name': 'Nom', 'Country': 'Pays', 'Date of Birth': 'Date de Naissance', 'Notification Preferences': 'Préférences de Notification', 'Email': 'Email', 'Push': 'Push', 'SMS': 'SMS', 'Tournament Updates': 'Mises à jour du Tournoi', 'Pairing Notifications': 'Notifications de Pairage', 'Round Start Reminders': 'Rappels de Début de Manche', 'Social Interactions': 'Interactions Sociales', 'Achievement Unlocks': 'Déblocage de Succès', 'Close': 'Fermer', 'Language': 'Langue' } },
  de: { translation: { 'Profile Settings': 'Profileinstellungen', 'Play! Pokémon Player ID': 'Play! Pokémon Spieler-ID', 'Name': 'Name', 'Country': 'Land', 'Date of Birth': 'Geburtsdatum', 'Notification Preferences': 'Benachrichtigungseinstellungen', 'Email': 'E-Mail', 'Push': 'Push', 'SMS': 'SMS', 'Tournament Updates': 'Turnier-Updates', 'Pairing Notifications': 'Paarungsbenachrichtigungen', 'Round Start Reminders': 'Rundenstart-Erinnerungen', 'Social Interactions': 'Soziale Interaktionen', 'Achievement Unlocks': 'Erfolge Freischalten', 'Close': 'Schließen', 'Language': 'Sprache' } },
  it: { translation: { 'Profile Settings': 'Impostazioni Profilo', 'Play! Pokémon Player ID': 'ID Giocatore Play! Pokémon', 'Name': 'Nome', 'Country': 'Paese', 'Date of Birth': 'Data di Nascita', 'Notification Preferences': 'Preferenze di Notifica', 'Email': 'Email', 'Push': 'Push', 'SMS': 'SMS', 'Tournament Updates': 'Aggiornamenti Torneo', 'Pairing Notifications': 'Notifiche Abbinamento', 'Round Start Reminders': 'Promemoria Inizio Round', 'Social Interactions': 'Interazioni Sociali', 'Achievement Unlocks': 'Sblocchi Obiettivi', 'Close': 'Chiudi', 'Language': 'Lingua' } },
  ja: { translation: { 'Profile Settings': 'プロフィール設定', 'Play! Pokémon Player ID': 'プレイヤーID', 'Name': '名前', 'Country': '国', 'Date of Birth': '生年月日', 'Notification Preferences': '通知設定', 'Email': 'メール', 'Push': 'プッシュ', 'SMS': 'SMS', 'Tournament Updates': '大会アップデート', 'Pairing Notifications': '対戦通知', 'Round Start Reminders': 'ラウンド開始リマインダー', 'Social Interactions': 'ソーシャルインタラクション', 'Achievement Unlocks': '実績解除', 'Close': '閉じる', 'Language': '言語' } },
  ko: { translation: { 'Profile Settings': '프로필 설정', 'Play! Pokémon Player ID': '플레이어 ID', 'Name': '이름', 'Country': '국가', 'Date of Birth': '생년월일', 'Notification Preferences': '알림 설정', 'Email': '이메일', 'Push': '푸시', 'SMS': 'SMS', 'Tournament Updates': '토너먼트 업데이트', 'Pairing Notifications': '매칭 알림', 'Round Start Reminders': '라운드 시작 알림', 'Social Interactions': '소셜 상호작용', 'Achievement Unlocks': '업적 해제', 'Close': '닫기', 'Language': '언어' } },
  zh: { translation: { 'Profile Settings': '个人资料设置', 'Play! Pokémon Player ID': '玩家ID', 'Name': '姓名', 'Country': '国家', 'Date of Birth': '出生日期', 'Notification Preferences': '通知偏好', 'Email': '电子邮件', 'Push': '推送', 'SMS': '短信', 'Tournament Updates': '锦标赛更新', 'Pairing Notifications': '配对通知', 'Round Start Reminders': '回合开始提醒', 'Social Interactions': '社交互动', 'Achievement Unlocks': '成就解锁', 'Close': '关闭', 'Language': '语言' } },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  });

export default i18n; 