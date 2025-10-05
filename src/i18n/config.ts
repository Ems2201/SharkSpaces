import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ar from './locales/ar.json';

import questionsEn from './questions/en.json';
import questionsPt from './questions/pt.json';
import questionsEs from './questions/es.json';
import questionsFr from './questions/fr.json';
import questionsDe from './questions/de.json';
import questionsZh from './questions/zh.json';
import questionsJa from './questions/ja.json';
import questionsAr from './questions/ar.json';

import speciesEn from './species/en.json';
import speciesPt from './species/pt.json';
import speciesEs from './species/es.json';
import speciesFr from './species/fr.json';
import speciesDe from './species/de.json';
import speciesZh from './species/zh.json';
import speciesJa from './species/ja.json';
import speciesAr from './species/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        translation: en,
        questions: questionsEn,
        species: speciesEn
      },
      pt: { 
        translation: pt,
        questions: questionsPt,
        species: speciesPt
      },
      es: { translation: es, questions: questionsEs, species: speciesEs },
      fr: { translation: fr, questions: questionsFr, species: speciesFr },
      de: { translation: de, questions: questionsDe, species: speciesDe },
      zh: { translation: zh, questions: questionsZh, species: speciesZh },
      ja: { translation: ja, questions: questionsJa, species: speciesJa },
      ar: { translation: ar, questions: questionsAr, species: speciesAr },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
