import React, { useState, useEffect, Suspense } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { encryptWithPublicKey } from "eth-crypto";
import { useTranslation } from "react-i18next";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./App.css";
import "./i18n";

// Конфигурация Web3Modal
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "YOUR_INFURA_ID", // Замени на свой Infura ID
    },
  },
};

const web3Modal = new Web3Modal({
  network: "sepolia",
  cacheProvider: true,
  providerOptions,
});

const contractAddress = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS"; // Замени после деплоя
const usdtAddress = "0xYOUR_SEPOLIA_USDT_ADDRESS"; // Замени на тестовый USDT в Sepolia
const abi = [
  "function payForService(uint8 _tariffId, bytes memory _encryptedData) external",
  "event PaymentReceived(address indexed client, uint256 amount, uint8 tariffId, bytes encryptedData)",
];

function App() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    projectName: "",
    exchange: "",
    apiKey: "",
    volume: "",
    priceMovement: "",
    dex: "",
  });
  const [tariffId, setTariffId] = useState(1);
  const [status, setStatus] = useState("Connecting to NeuralNet..."); // Инициализация состояния здесь
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Добавлено состояние загрузки

  const tariffs = [
    { id: 1, name: "2 Weeks, 1 Pair - 690 USDT" },
    { id: 2, name: "1 Month, 1 Pair - 1300 USDT" },
    { id: 3, name: "1 Month, 2 Pairs - 2000 USDT" },
    { id: 4, name: "1 Month, 3 Pairs - 2500 USDT" },
    { id: 5, name: "1 Month, 4 Pairs - 3000 USDT" },
    { id: 6, name: "1 Month, 5 Pairs - 3500 USDT" },
    { id: 7, name: "2 Months, 1 Pair - 2000 USDT" },
    { id: 8, name: "2 Months, 2 Pairs - 3500 USDT" },
    { id: 9, name: "2 Months, 3 Pairs - 4500 USDT" },
    { id: 10, name: "2 Months, 4 Pairs - 5500 USDT" },
    { id: 11, name: "2 Months, 5 Pairs - 6000 USDT" },
    { id: 12, name: "Сhange of strategy - 9 USDT" },
    { id: 13, name: "Project support - 999 USDT" },
  ];

  useEffect(() => {
    // Симуляция процесса "загрузки" AI и криптографики
    const fakeLoading = async () => {
      // 1. Имитация сканирования криптографических данных
      setStatus("Analyzing blockchain data...");
      await delay(1000);

      // 2. Имитация нейронной сети
      setStatus("Initializing neural network...");
      await delay(1000);

      // 3. Имитация оптимизации алгоритмов
      setStatus("Optimizing trading algorithms...");
      await delay(1000);

      // 4. Имитация процесса шифрования
      setStatus("Encrypting trading strategies...");
      await delay(1000);

      // 5. Готово!
      setStatus("DApp ready!");
      await delay(500);
      setIsLoading(false);
    };

    fakeLoading();
  }, []);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();
      setWalletConnected(true);
      setWalletAddress(address);
      setStatus(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
      return signer;
    } catch (error) {
      setStatus(`Connection error: ${error.message}`);
      return null;
    }
  };

  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    setWalletConnected(false);
    setWalletAddress("");
    setStatus("Wallet disconnected");
  };

  const validateForm = () => {
    return (
      formData.projectName &&
      formData.exchange &&
      formData.apiKey &&
      formData.volume &&
      formData.priceMovement
    );
  };

  const handleSubmit = async () => {
    if (!walletConnected) {
      setStatus("Please connect your wallet first!");
      return;
    }

    if (!validateForm()) {
      setStatus(t("status.fillFields"));
      return;
    }

    setStatus("Initializing neural network connection...");
    const signer = await connectWallet();
    if (!signer) return;

    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      setStatus("Processing data through AI encryption...");
      const clientData = JSON.stringify(formData);
      const encryptedData = await encryptWithPublicKey(
        "your-public-key",
        clientData
      );

      setStatus("Synchronizing with blockchain ledger...");
      const usdtContract = new ethers.Contract(
        usdtAddress,
        ["function approve(address spender, uint256 amount) external"],
        signer
      );
      const amount = tariffs[tariffId - 1].name
        .split(" - ")[1]
        .replace(" USDT", "");
      const approveTx = await usdtContract.approve(
        contractAddress,
        ethers.utils.parseUnits(amount, 6)
      );
      await approveTx.wait();

      setStatus("Executing transaction via quantum relay...");
      const tx = await contract.payForService(
        tariffId,
        ethers.utils.hexlify(ethers.utils.toUtf8Bytes(JSON.stringify(encryptedData)))
      );
      await tx.wait();

      setStatus("Transaction confirmed. Welcome to AlphaMarketMakerAi.");
    } catch (error) {
      setStatus(`System error: ${error.message}`);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Suspense fallback="Loading...">
      <div className="app-container">
        {isLoading ? (
          // Заставка
          <div className="splash-screen">
            <div className="ai-graphic">
              {/* Здесь будет анимированный график или что-то в этом роде */}
              <div className="line"></div>
              <div className="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="status-text">{status}</div>
          </div>
        ) : (
          // Основной контент DApp
          <>
            <Particles
              id="tsparticles"
              init={particlesInit}
              options={{
                background: { color: { value: "#0a0a0a" } },
                fpsLimit: 60,
                particles: {
                  number: { value: 50, density: { enable: true, value_area: 800 } },
                  color: { value: "#00d4ff" },
                  shape: { type: "circle" },
                  opacity: { value: 0.5, random: true },
                  size: { value: 3, random: true },
                  move: { enable: true, speed: 0.5, direction: "none", random: true },
                },
                interactivity: {
                  events: { onHover: { enable: true, mode: "repulse" } },
                  modes: { repulse: { distance: 100, duration: 0.4 } },
                },
              }}
            />
            <header className="header">
              <div className="header-content">
                <h1>{t("title")}</h1>
                <p>{t("subtitle")}</p>
              </div>
              <div className="wallet-controls">
                <div className="language-buttons">
                  <button onClick={() => changeLanguage("en")} title="English">
                    🇬🇧
                  </button>
                  <button onClick={() => changeLanguage("zh")} title="Chinese">
                    🇨🇳
                  </button>
                  <button onClick={() => changeLanguage("ru")} title="Russian">
                    🇷🇺
                  </button>
                </div>
                {walletConnected ? (
                  <>
                    <span className="wallet-address">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                    <button onClick={disconnectWallet} className="wallet-button">
                      {t("disconnectWallet")}
                    </button>
                  </>
                ) : (
                  <button onClick={connectWallet} className="wallet-button">
                    {t("connectWallet")}
                  </button>
                )}
              </div>
            </header>
            <div className="form-container">
              <h2>{t("choosePlan")}</h2>
              <select
                value={tariffId}
                onChange={(e) => setTariffId(parseInt(e.target.value))}
              >
                {tariffs.map((tariff) => (
                  <option key={tariff.id} value={tariff.id}>
                    {tariff.name}
                  </option>
                ))}
              </select>
              <input
                placeholder={t("projectName")}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
              />
              <input
                placeholder={t("exchange")}
                onChange={(e) =>
                  setFormData({ ...formData, exchange: e.target.value })
                }
              />
              <input
                placeholder={t("apiKey")}
                onChange={(e) =>
                  setFormData({ ...formData, apiKey: e.target.value })
                }
              />
              <input
                placeholder={t("volume")}
                onChange={(e) =>
                  setFormData({ ...formData, volume: e.target.value })
                }
              />
              <input
                placeholder={t("priceMovement")}
                onChange={(e) =>
                  setFormData({ ...formData, priceMovement: e.target.value })
                }
              />
              <input
                placeholder={t("dex")}
                onChange={(e) => setFormData({ ...formData, dex: e.target.value })}
              />
              <button onClick={handleSubmit}>{t("payButton")}</button>
              {status && <p className="status scanning">{status}</p>}
            </div>
            <footer>
              <p>{t("footer")}</p>
            </footer>
          </>
        )}
      </div>
    </Suspense>
  );
}

export default App;
