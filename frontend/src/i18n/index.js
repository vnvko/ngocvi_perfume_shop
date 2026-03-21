// Cấu hình i18next — khởi tạo song ngữ Việt / English
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './vi';
import en from './en';

const savedLang = localStorage.getItem('ngocvi_lang') || 'vi';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
    },
    lng: savedLang,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // React tự escape
    },
  });

// Lưu ngôn ngữ khi thay đổi
i18n.on('languageChanged', (lang) => {
  localStorage.setItem('ngocvi_lang', lang);
});

export default i18n;
