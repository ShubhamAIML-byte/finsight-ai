import { LanguageConfig, SupportedLanguage } from "@/types/chat";
import { StressTestPreset } from "@/types/scenario";

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    welcomeGreeting: "Hello! I am FinSight AI, your institutional financial intelligence assistant. How can I assist your financial analysis or strategic decision-making today?",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    welcomeGreeting: "नमस्ते! मैं FinSight AI हूँ, आपका वित्तीय विश्लेषण और रणनीतिक सलाहकार। आज मैं आपकी किस वित्तीय रिपोर्ट या रणनीति में मदद कर सकता हूँ?",
  },
  bn: {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    flag: "🇮🇳",
    welcomeGreeting: "নমস্কার! আমি FinSight AI, আপনার প্রাতিষ্ঠানিক আর্থিক বুদ্ধিমত্তা সহায়ক। আজ আপনার আর্থিক বিশ্লেষণ বা কৌশলগত সিদ্ধান্তে কীভাবে সাহায্য করতে পারি?",
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    welcomeGreeting: "¡Hola! Soy FinSight AI, su asistente institucional de inteligencia financiera. ¿Cómo puedo ayudarle hoy con su análisis financiero o toma de decisiones?",
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    welcomeGreeting: "Bonjour ! Je suis FinSight AI, votre assistant institutionnel d'intelligence financière. Comment puis-je vous aider aujourd'hui dans vos analyses financières ?",
  },
};

export const STRESS_TEST_PRESETS: StressTestPreset[] = [
  {
    id: "trade_war",
    name: "Global Trade War Escalation",
    description: "Surge in cross-border tariffs and supply chain disruption across tech and hardware components.",
    icon: "ShieldAlert",
    params: {
      currencyMovement: 6.5,
      tariffIncrease: 22.0,
      interestRateChange: 1.0,
      supplyChainCostIncrease: 18.0,
      revenueDecline: -8.0,
      marketDownturn: -15.0,
    },
  },
  {
    id: "stagflation",
    name: "Stagflationary Shock",
    description: "Persistent input inflation combined with central bank rate hikes and softening consumer demand.",
    icon: "TrendingDown",
    params: {
      currencyMovement: -4.0,
      tariffIncrease: 5.0,
      interestRateChange: 2.5,
      supplyChainCostIncrease: 14.0,
      revenueDecline: -12.0,
      marketDownturn: -22.0,
    },
  },
  {
    id: "fx_volatility",
    name: "Emerging Market FX Crash",
    description: "Rapid strengthening of USD putting extreme translation and margin pressure on international revenues.",
    icon: "Coins",
    params: {
      currencyMovement: 15.0,
      tariffIncrease: 4.0,
      interestRateChange: 0.5,
      supplyChainCostIncrease: 6.0,
      revenueDecline: -5.0,
      marketDownturn: -8.0,
    },
  },
  {
    id: "severe_recession",
    name: "Severe Global Recession",
    description: "Broad-based enterprise spending contraction, liquidity freeze, and deep equity market drawdown.",
    icon: "AlertOctagon",
    params: {
      currencyMovement: -2.0,
      tariffIncrease: 10.0,
      interestRateChange: -1.5,
      supplyChainCostIncrease: 5.0,
      revenueDecline: -24.0,
      marketDownturn: -35.0,
    },
  },
];
