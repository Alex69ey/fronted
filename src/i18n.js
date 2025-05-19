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
      "clientDashboard": "Client Dashboard",
      "activeTariff": "Active Tariff",
      "statusLabel": "Status",
      "endDate": "End Date",
      "noActiveTariff": "No active tariff",
      "paymentHistory": "Payment History",
      "tariff": "Tariff",
      "amount": "Amount",
      "date": "Date",
      "selectStrategies": "Select Market Making Strategies",
      "status": {
        "fillFields": "Please complete all required fields for AI processing.",
        "connecting": "Initializing neural network connection...",
        "encrypting": "Processing data through AI encryption...",
        "approving": "Synchronizing with blockchain ledger...",
        "processing": "Executing transaction via quantum relay...",
        "success": "Transaction confirmed. Welcome to AlphaMarketMakerAi."
      },
      // Названия стратегий
      "inventoryManagement": "Inventory Management",
      "spreadOptimization": "Spread Optimization",
      "volatilityBasedQuoting": "Volatility-Based Quoting",
      "orderBookBalancing": "Order Book Balancing",
      "dynamicSpreadAdjustment": "Dynamic Spread Adjustment",
      "liquidityProvision": "Liquidity Provision",
      "pricePegging": "Price Pegging",
      "highFrequencyMarketMaking": "High-Frequency Market Making",
      "adaptiveMarketMaking": "Adaptive Market Making",
      "frontRunning": "Front-Running",
      // Описания стратегий
      "inventoryManagementDesc": "Balances market maker positions to minimize risk during market changes.",
      "spreadOptimizationDesc": "Dynamically adjusts spread to increase trade volume and profit.",
      "volatilityBasedQuotingDesc": "Adjusts spreads based on volatility: wider when high, narrower when low.",
      "orderBookBalancingDesc": "Adjusts orders to balance supply/demand, reducing price jump risks.",
      "dynamicSpreadAdjustmentDesc": "Auto-adjusts spread based on market conditions and activity.",
      "liquidityProvisionDesc": "Constant quotes to maintain liquidity and fast trade execution.",
      "pricePeggingDesc": "Quotes near market price to reduce risk and stay competitive.",
      "highFrequencyMarketMakingDesc": "Fast order placement/cancellation for profit on small price movements.",
      "adaptiveMarketMakingDesc": "Adapts quotes based on demand, supply, and volatility.",
      "frontRunningDesc": "Predicts large orders and places trades ahead for profit (may be unethical)."
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
      "clientDashboard": "客户端仪表板",
      "activeTariff": "当前套餐",
      "statusLabel": "状态",
      "endDate": "到期日期",
      "noActiveTariff": "没有激活的套餐",
      "paymentHistory": "支付历史",
      "tariff": "套餐",
      "amount": "金额",
      "date": "日期",
      "selectStrategies": "选择市场做市策略",
      "status": {
        "fillFields": "请填写所有必填字段以进行AI处理。",
        "connecting": "初始化神经网络连接...",
        "encrypting": "通过AI加密处理数据...",
        "approving": "与区块链账本同步...",
        "processing": "通过量子中继执行交易...",
        "success": "交易已确认。欢迎使用 AlphaMarketMakerAi。"
      },
      // Названия стратегий
      "inventoryManagement": "库存管理",
      "spreadOptimization": "价差优化",
      "volatilityBasedQuoting": "基于波动率的报价",
      "orderBookBalancing": "订单簿平衡",
      "dynamicSpreadAdjustment": "动态价差调整",
      "liquidityProvision": "流动性提供",
      "pricePegging": "价格锚定",
      "highFrequencyMarketMaking": "高频做市",
      "adaptiveMarketMaking": "自适应做市",
      "frontRunning": "抢跑交易",
      // Описания стратегий
      "inventoryManagementDesc": "平衡做市商仓位以降低市场变化风险。",
      "spreadOptimizationDesc": "动态调整价差以增加交易量和利润。",
      "volatilityBasedQuotingDesc": "根据波动率调整价差：高时扩大，低时缩小。",
      "orderBookBalancingDesc": "调整订单以平衡供需，降低价格跳动风险。",
      "dynamicSpreadAdjustmentDesc": "根据市场和活动自动调整价差。",
      "liquidityProvisionDesc": "持续报价以保持流动性和快速成交。",
      "pricePeggingDesc": "报价接近市场价以降低风险并保持竞争力。",
      "highFrequencyMarketMakingDesc": "快速挂撤单以从小幅波动中获利。",
      "adaptiveMarketMakingDesc": "根据需求、供给和波动率调整报价。",
      "frontRunningDesc": "预测大单并提前挂单获利（可能不道德）。"
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
      "clientDashboard": "Панель клиента",
      "activeTariff": "Активный тариф",
      "statusLabel": "Статус",
      "endDate": "Дата окончания",
      "noActiveTariff": "Нет активного тарифа",
      "paymentHistory": "История платежей",
      "tariff": "Тариф",
      "amount": "Сумма",
      "date": "Дата",
      "selectStrategies": "Выберите стратегии маркет-мейкинга",
      "status": {
        "fillFields": "Пожалуйста, заполните все обязательные поля для обработки ИИ.",
        "connecting": "Инициализация нейронной сети...",
        "encrypting": "Шифрование данных через ИИ...",
        "approving": "Синхронизация с блокчейн-реестром...",
        "processing": "Выполнение транзакции через квантовое реле...",
        "success": "Транзакция подтверждена. Добро пожаловать в AlphaMarketMakerAi."
      },
      // Названия стратегий
      "inventoryManagement": "Управление запасами",
      "spreadOptimization": "Оптимизация спреда",
      "volatilityBasedQuoting": "Котирование на основе волатильности",
      "orderBookBalancing": "Балансировка книги ордеров",
      "dynamicSpreadAdjustment": "Динамическая регулировка спреда",
      "liquidityProvision": "Обеспечение ликвидности",
      "pricePegging": "Привязка цены",
      "highFrequencyMarketMaking": "Высокочастотный маркет-мейкинг",
      "adaptiveMarketMaking": "Адаптивный маркет-мейкинг",
      "frontRunning": "Фронтранинг",
      // Описания стратегий
      "inventoryManagementDesc": "Балансировка позиций для снижения риска при изменении рынка.",
      "spreadOptimizationDesc": "Регулировка спреда для роста сделок и прибыли.",
      "volatilityBasedQuotingDesc": "Изменение спредов: шире при высокой волатильности, уже при низкой.",
      "orderBookBalancingDesc": "Корректировка ордеров для баланса спроса/предложения, снижая скачки цены.",
      "dynamicSpreadAdjustmentDesc": "Автоматическая корректировка спреда по рынку и активности.",
      "liquidityProvisionDesc": "Постоянные котировки для ликвидности и быстрого исполнения.",
      "pricePeggingDesc": "Котировки около рыночной цены для снижения риска.",
      "highFrequencyMarketMakingDesc": "Быстрое выставление/снятие ордеров для прибыли на колебаниях.",
      "adaptiveMarketMakingDesc": "Адаптация котировок по спросу, предложению и волатильности.",
      "frontRunningDesc": "Предугадывание крупных ордеров для прибыли (может быть неэтичным)."
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