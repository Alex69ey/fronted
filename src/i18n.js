import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "title": "AlphaMarketMakerAi",
      "subtitle": "Next-Gen AI-Driven Market Making",
      "choosePlan": "Select Your AI-Optimized Plan",
      "projectName": "Project Name *",
      "exchange": "Exchange *",
      "apiKey": "API Key *",
      "volume": "Target Volume *",
      "priceMovement": "Price Movement (%) *",
      "dex": "DEX (optional)",
      "payButton": "Initiate Transaction",
      "connectWallet": "Connect Wallet",
      "disconnectWallet": "Disconnect Wallet",
      "footer": "Powered by AlphaMarketMakerAi © 2025",
      "status": {
        "fillFields": "Please complete all required fields for AI processing.",
        "connecting": "Initializing neural network connection...",
        "encrypting": "Processing data through AI encryption...",
        "approving": "Synchronizing with blockchain ledger...",
        "processing": "Executing transaction via quantum relay...",
        "success": "Transaction confirmed. Welcome to AlphaMarketMakerAi."
      }
    }
  },
  zh: {
    translation: {
      "title": "AlphaMarketMakerAi",
      "subtitle": "下一代人工智能驱动的市场做市",
      "choosePlan": "选择您的AI优化计划",
      "projectName": "项目名称 *",
      "exchange": "交易所 *",
      "apiKey": "API密钥 *",
      "volume": "目标交易量 *",
      "priceMovement": "价格变动 (%) *",
      "dex": "去中心化交易所 (可选)",
      "payButton": "启动交易",
      "connectWallet": "连接钱包",
      "disconnectWallet": "断开钱包",
      "footer": "由 AlphaMarketMakerAi 提供支持 © 2025",
      "status": {
        "fillFields": "请填写所有必填字段以进行AI处理。",
        "connecting": "初始化神经网络连接...",
        "encrypting": "通过AI加密处理数据...",
        "approving": "与区块链账本同步...",
        "processing": "通过量子中继执行交易...",
        "success": "交易已确认。欢迎使用 AlphaMarketMakerAi。"
      }
    }
  },
  ru: {
    translation: {
      "title": "AlphaMarketMakerAi",
      "subtitle": "Маркет-мейкинг нового поколения на основе ИИ",
      "choosePlan": "Выберите ваш AI-оптимизированный тариф",
      "projectName": "Название проекта *",
      "exchange": "Биржа *",
      "apiKey": "API-ключ *",
      "volume": "Целевой объем *",
      "priceMovement": "Движение цены (%) *",
      "dex": "DEX (опционально)",
      "payButton": "Запустить транзакцию",
      "connectWallet": "Подключить кошелёк",
      "disconnectWallet": "Отключить кошелёк",
      "footer": "Создано AlphaMarketMakerAi © 2025",
      "status": {
        "fillFields": "Пожалуйста, заполните все обязательные поля для обработки ИИ.",
        "connecting": "Инициализация нейронной сети...",
        "encrypting": "Шифрование данных через ИИ...",
        "approving": "Синхронизация с блокчейн-реестром...",
        "processing": "Выполнение транзакции через квантовое реле...",
        "success": "Транзакция подтверждена. Добро пожаловать в AlphaMarketMakerAi."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;