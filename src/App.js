import React, { useState, useEffect, Suspense } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider"; // WalletConnect v1
import { EthereumProvider } from "@walletconnect/ethereum-provider"; // WalletConnect v2
import { encryptWithPublicKey } from "eth-crypto";
import { useTranslation } from "react-i18next";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./App.css";
import "./i18n";

// Конфигурация Web3Modal
const providerOptions = {
  // WalletConnect v1 (для старых кошельков, таких как устаревшие версии Trust Wallet)
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "YOUR_INFURA_ID", // Замени на свой Infura ID
      qrcode: false,
      qrcodeModalOptions: {
        mobileLinks: ["trust"],
      },
    },
  },
  // WalletConnect v2 (для новых кошельков)
  walletconnect2: {
    package: EthereumProvider,
    options: {
      projectId: "ddba0f009aa0ad5d1d48ab7bc0a8dec8", // Твой projectId
      chains: [1],
      showQrModal: false,
      mobileLinks: ["trust"],
      methods: ["eth_sendTransaction", "eth_sign"],
      events: ["chainChanged", "accountsChanged"],
      rpcMap: {
        1: "https://mainnet.infura.io/v3/YOUR_INFURA_ID",
        56: "https://bsc-dataseed.binance.org/",
        11155111: "https://sepolia.infura.io/v3/YOUR_INFURA_ID",
      },
    },
  },
  injected: {
    display: {
      name: "MetaMask",
      description: "Connect with MetaMask in your browser",
    },
    package: null,
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
  disableInjectedProvider: false,
});

// Маппинг адресов контрактов и USDT для каждой сети
const contractAddresses = {
  "1": "0xYOUR_ETHEREUM_CONTRACT_ADDRESS",
  "56": "0xYOUR_BSC_CONTRACT_ADDRESS",
  "11155111": "0xYOUR_SEPOLIA_CONTRACT_ADDRESS",
};

const usdtAddresses = {
  "1": "0xdAC17F958D2ee523a2206206994597C13D831ec",
  "56": "0x55d398326f99059fF775485246999027B319795",
  "11155111": "0x7169D38820dfd117C3FA1f22a697dBA58d90BA7",
};

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
    strategy: "",
  });
  const [tariffId, setTariffId] = useState(1);
  const [status, setStatus] = useState("Connecting to NeuralNet...");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [candles, setCandles] = useState([]);
  const [bollingerBandsDynamic, setBollingerBandsDynamic] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [provider, setProvider] = useState(null);

  const networks = [
    { chainId: "1", name: "Ethereum Mainnet" },
    { chainId: "56", name: "BNB Smart Chain" },
    { chainId: "11155111", name: "Sepolia Testnet" },
  ];

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

  const candleData = [
    { x: 20, y: 238, height: 5, type: "bullish" },
    { x: 40, y: 240, height: 6, type: "bearish" },
    { x: 60, y: 235, height: 4, type: "bullish" },
    { x: 80, y: 238, height: 7, type: "bearish" },
    { x: 100, y: 236, height: 5, type: "bullish" },
    { x: 120, y: 230, height: 12, type: "bullish" },
    { x: 140, y: 220, height: 10, type: "bullish" },
    { x: 160, y: 208, height: 12, type: "bullish" },
    { x: 180, y: 194, height: 12, type: "bullish" },
    { x: 200, y: 180, height: 13, type: "bullish" },
    { x: 220, y: 175, height: 14, type: "bullish" },
    { x: 240, y: 170, height: 15, type: "bullish" },
    { x: 260, y: 160, height: 16, type: "bullish" },
    { x: 280, y: 170, height: 10, type: "bearish" },
    { x: 300, y: 180, height: 12, type: "bearish" },
    { x: 320, y: 190, height: 14, type: "bearish" },
    { x: 340, y: 180, height: 14, type: "bullish" },
    { x: 360, y: 160, height: 15, type: "bullish" },
    { x: 380, y: 140, height: 16, type: "bullish" },
    { x: 400, y: 120, height: 17, type: "bullish" },
    { x: 420, y: 100, height: 18, type: "bullish" },
    { x: 440, y: 80, height: 19, type: "bullish" },
    { x: 460, y: 60, height: 20, type: "bullish" },
    { x: 480, y: 40, height: 21, type: "bullish" },
    { x: 500, y: 20, height: 22, type: "bullish" },
  ];

  candleData.forEach((candle, index) => {
    const isFirstFive = index < 5;
    const minWick = isFirstFive ? 2 : 10;
    const maxWick = isFirstFive ? 8 : 30;
    const randomHighWick = Math.floor(Math.random() * (maxWick - minWick + 1)) + minWick;
    const randomLowWick = Math.floor(Math.random() * (maxWick - minWick + 1)) + minWick;
    candle.high = candle.y + randomHighWick;
    candle.low = (candle.type === "bullish" ? candle.y + candle.height : candle.y) - randomLowWick;
  });

  const calculateVolume = (candle, index) => {
    const priceRange = candle.high - candle.low;
    const baseVolume = priceRange * 2;
    const randomFactor = Math.random() * 0.5 + 0.75;
    let volume = baseVolume * randomFactor;

    if (index < 5) {
      volume = Math.min(volume, 15);
      volume = Math.max(volume, 5);
    } else {
      volume = Math.min(volume, 60);
      volume = Math.max(volume, 10);
    }

    return Math.round(volume);
  };

  candleData.forEach((candle, index) => {
    candle.volume = calculateVolume(candle, index);
  });

  candleData[5].volume = 5;
  candleData[6].volume = 7;
  candleData[7].volume = 10;
  candleData[22].volume = 50;
  candleData[23].volume = 55;
  candleData[24].volume = 60;

  const period = 5;
  const multiplier = 2;
  const bollingerBands = [];

  const calculateSMA = (data, start, period) => {
    const slice = data.slice(start, start + period);
    const sum = slice.reduce((acc, val) => acc + val, 0);
    return sum / period;
  };

  const calculateSD = (data, start, period, mean) => {
    const slice = data.slice(start, start + period);
    const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
    return Math.sqrt(variance);
  };

  const closePrices = candleData.map(candle => 
    candle.type === "bullish" ? candle.y + candle.height : candle.y
  );

  for (let i = 0; i < candleData.length; i++) {
    let sma;
    if (i < period - 1) {
      sma = calculateSMA(closePrices, 0, period);
    } else {
      sma = calculateSMA(closePrices, i - period + 1, period);
    }
    const sd = i < period - 1 
      ? calculateSD(closePrices, 0, period, sma) 
      : calculateSD(closePrices, i - period + 1, period, sma);
    const upperBand = sma + (sd * multiplier);
    const lowerBand = sma - (sd * multiplier);

    bollingerBands.push({
      x: candleData[i].x,
      sma: sma,
      upper: upperBand,
      lower: lowerBand,
    });
  }

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < candleData.length && candleData[index]) {
        setCandles((prev) => [...prev, candleData[index]]);
        setBollingerBandsDynamic((prev) => [...prev, bollingerBands[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 250);
      }
    }, 250);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fakeLoading = async () => {
      setStatus("Analyzing blockchain data...");
      await delay(1200);
      setStatus("Initializing neural network...");
      await delay(1200);
      setStatus("Optimizing trading algorithms...");
      await delay(1200);
      setStatus("Encrypting trading strategies...");
      await delay(1200);
      setStatus("DApp ready!");
      await delay(1200);
    };

    fakeLoading();
  }, []);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const connectWallet = async () => {
    try {
      const web3Provider = await web3Modal.connect();
      const ethersProvider = new ethers.providers.Web3Provider(web3Provider);
      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(web3Provider);
      setWalletConnected(true);
      setWalletAddress(address);
      setStatus(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);

      setSelectedNetwork(networks[2].chainId);
      return signer;
    } catch (error) {
      setStatus(`Connection error: ${error.message}`);
      return null;
    }
  };

  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    if (provider?.disconnect) {
      await provider.disconnect();
    }
    setWalletConnected(false);
    setWalletAddress("");
    setSelectedNetwork("");
    setProvider(null);
    setStatus("Wallet disconnected");
  };

  const switchNetwork = async (chainId) => {
    if (!provider) {
      setStatus("Please connect your wallet first!");
      return;
    }

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
      });
      setSelectedNetwork(chainId);
      setStatus(`Switched to ${networks.find(net => net.chainId === chainId).name}`);
    } catch (error) {
      if (error.code === 4902) {
        try {
          if (chainId === "56") {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x38",
                  chainName: "BNB Smart Chain",
                  nativeCurrency: {
                    name: "BNB",
                    symbol: "BNB",
                    decimals: 18,
                  },
                  rpcUrls: ["https://bsc-dataseed.binance.org/"],
                  blockExplorerUrls: ["https://bscscan.com"],
                },
              ],
            });
          } else if (chainId === "1") {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x1",
                  chainName: "Ethereum Mainnet",
                  nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_ID"],
                  blockExplorerUrls: ["https://etherscan.io"],
                },
              ],
            });
          } else if (chainId === "11155111") {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia Testnet",
                  nativeCurrency: {
                    name: "Sepolia Ether",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://sepolia.infura.io/v3/YOUR_INFURA_ID"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          }
          setSelectedNetwork(chainId);
          setStatus(`Switched to ${networks.find(net => net.chainId === chainId).name}`);
        } catch (addError) {
          setStatus(`Failed to add network: ${addError.message}`);
        }
      } else {
        setStatus(`Failed to switch network: ${error.message}`);
      }
    }
  };

  const validateForm = () => {
    return (
      formData.projectName &&
      formData.exchange &&
      formData.apiKey &&
      formData.volume &&
      formData.priceMovement &&
      formData.strategy
    );
  };

  const handleSubmit = async () => {
    if (!walletConnected) {
      setStatus("Please connect your wallet first!");
      return;
    }

    if (!selectedNetwork) {
      setStatus("Please select a network!");
      return;
    }

    if (!validateForm()) {
      setStatus(t("status.fillFields"));
      return;
    }

    setStatus(t("status.connecting"));
    const signer = await connectWallet();
    if (!signer) return;

    const contractAddress = contractAddresses[selectedNetwork];
    const usdtAddress = usdtAddresses[selectedNetwork];

    if (!contractAddress || !usdtAddress) {
      setStatus("Contract or USDT address not configured for this network!");
      return;
    }

    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      setStatus(t("status.encrypting"));
      const clientData = JSON.stringify(formData);
      const encryptedData = await encryptWithPublicKey(
        "your-public-key",
        clientData
      );

      setStatus(t("status.approving"));
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

      setStatus(t("status.processing"));
      const tx = await contract.payForService(
        tariffId,
        ethers.utils.hexlify(ethers.utils.toUtf8Bytes(JSON.stringify(encryptedData)))
      );
      await tx.wait();

      setStatus(t("status.success"));
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <>
      {isLoading && (
        <div className={`splash-screen ${isLoading ? "" : "hidden"}`}>
          <div className="ai-graphic">
            <div className="chart-grid"></div>
            <svg className="candlestick-chart" viewBox="0 0 660 330">
              <defs>
                <linearGradient id="bullish-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#4dff4d", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#2e9b2e", stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="bearish-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#ff4d4d", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#b22222", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              {candles.map((candle, idx) => (
                <g key={idx}>
                  <rect
                    className={`candle candle${idx + 1} ${candle.type}`}
                    x={candle.x}
                    y={candle.y}
                    width="10"
                    height={candle.height}
                  />
                  <line
                    className={`wick wick${idx + 1}-high ${candle.type}`}
                    x1={candle.x + 5}
                    y1={candle.high}
                    x2={candle.x + 5}
                    y2={candle.y}
                  />
                  <line
                    className={`wick wick${idx + 1}-low ${candle.type}`}
                    x1={candle.x + 5}
                    y1={candle.y + candle.height}
                    x2={candle.x + 5}
                    y2={candle.low}
                  />
                  <rect
                    className={`volume-bar volume-bar${idx + 1} ${candle.type}`}
                    x={candle.x - 2.5}
                    y={325 - candle.volume * 1.5}
                    width="15"
                    height={candle.volume * 1.5}
                  />
                </g>
              ))}
              {bollingerBandsDynamic.length > 0 && (
                <>
                  <polyline
                    className="bollinger-sma"
                    points={bollingerBandsDynamic
                      .filter(band => band !== undefined)
                      .map(band => `${band.x},${band.sma}`)
                      .join(" ")}
                  />
                  <polyline
                    className="bollinger-upper"
                    points={bollingerBandsDynamic
                      .filter(band => band !== undefined)
                      .map(band => `${band.x},${band.upper}`)
                      .join(" ")}
                  />
                  <polyline
                    className="bollinger-lower"
                    points={bollingerBandsDynamic
                      .filter(band => band !== undefined)
                      .map(band => `${band.x},${band.lower}`)
                      .join(" ")}
                  />
                </>
              )}
              {candles.length >= 6 && (
                <>
                  <text className="ai-activation-text" x="20" y="30">
                    AI Activated
                  </text>
                  <g className="sparkles">
                    <circle className="sparkle sparkle1" cx="10" cy="20" r="4" />
                    <circle className="sparkle sparkle2" cx="110" cy="20" r="5" />
                    <circle className="sparkle sparkle3" cx="20" cy="40" r="3" />
                    <circle className="sparkle sparkle4" cx="100" cy="40" r="4" />
                    <circle className="sparkle sparkle5" cx="60" cy="15" r="3" />
                  </g>
                </>
              )}
            </svg>
          </div>
          <div className="status-text">{status}</div>
        </div>
      )}

      <div className={`app-container ${isLoading ? "loading" : ""}`}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            particles: {
              number: { value: 50, density: { enable: true, value_area: 800 } },
              color: { value: "#00d4ff" },
              shape: { type: "circle" },
              opacity: { value: 0.5, random: true },
              size: { value: 3, random: true },
              move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
              },
            },
            detectRetina: true,
          }}
        />
        <header className="header">
          <div className="header-content">
            <h1>{t("title")}</h1>
            <p>{t("subtitle")}</p>
          </div>
          <div className="wallet-controls">
            <div className="language-buttons">
              <button onClick={() => i18n.changeLanguage("en")}>EN</button>
              <button onClick={() => i18n.changeLanguage("ru")}>RU</button>
              <button onClick={() => i18n.changeLanguage("zh")}>ZH</button>
            </div>
            <div className="wallet-actions">
              {!walletConnected ? (
                <button className="wallet-button" onClick={connectWallet}>
                  {t("connectWallet")}
                </button>
              ) : (
                <>
                  <span className="wallet-address">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  <button className="wallet-button" onClick={disconnectWallet}>
                    {t("disconnectWallet")}
                  </button>
                </>
              )}
            </div>
            {walletConnected && (
              <select
                value={selectedNetwork}
                onChange={(e) => switchNetwork(e.target.value)}
              >
                {networks.map((network) => (
                  <option key={network.chainId} value={network.chainId}>
                    {network.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </header>

        <Suspense fallback={<div>Loading...</div>}>
          <div className="form-container">
            <h2>{t("choosePlan")}</h2>
            <select
              name="tariffId"
              value={tariffId}
              onChange={(e) => setTariffId(Number(e.target.value))}
            >
              {tariffs.map((tariff) => (
                <option key={tariff.id} value={tariff.id}>
                  {tariff.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="projectName"
              placeholder={t("projectName")}
              value={formData.projectName}
              onChange={handleInputChange}
            />
            <select name="exchange" value={formData.exchange} onChange={handleInputChange}>
              <option value="">{t("exchange")}</option>
              <option value="Binance">Binance</option>
              <option value="Coinbase">Coinbase</option>
              <option value="Kraken">Kraken</option>
              <option value="Bitfinex">Bitfinex</option>
              <option value="Huobi">Huobi</option>
              <option value="OKX">OKX</option>
              <option value="KuCoin">KuCoin</option>
              <option value="Bybit">Bybit</option>
              <option value="Gate.io">Gate.io</option>
              <option value="Bitstamp">Bitstamp</option>
              <option value="MEXC">MEXC</option>
              <option value="Bittrex">Bittrex</option>
              <option value="Poloniex">Poloniex</option>
              <option value="Gemini">Gemini</option>
              <option value="Crypto.com">Crypto.com</option>
              <option value="Bitget">Bitget</option>
              <option value="Phemex">Phemex</option>
              <option value="WhiteBIT">WhiteBIT</option>
              <option value="BTSE">BTSE</option>
              <option value="AscendEX">AscendEX</option>
              <option value="BitMart">BitMart</option>
              <option value="LBank">LBank</option>
              <option value="CoinEx">CoinEx</option>
              <option value="ProBit">ProBit</option>
              <option value="EXMO">EXMO</option>
              <option value="Upbit">Upbit</option>
              <option value="Bithumb">Bithumb</option>
              <option value="Coinone">Coinone</option>
              <option value="Korbit">Korbit</option>
              <option value="BitFlyer">BitFlyer</option>
              <option value="Coincheck">Coincheck</option>
              <option value="Liquid">Liquid</option>
              <option value="Zaif">Zaif</option>
              <option value="Bitkub">Bitkub</option>
              <option value="Tokocrypto">Tokocrypto</option>
              <option value="Indodax">Indodax</option>
              <option value="WazirX">WazirX</option>
              <option value="CoinDCX">CoinDCX</option>
              <option value="ZebPay">ZebPay</option>
              <option value="Bitso">Bitso</option>
              <option value="Mercado Bitcoin">Mercado Bitcoin</option>
              <option value="Luno">Luno</option>
              <option value="HitBTC">HitBTC</option>
              <option value="CEX.IO">CEX.IO</option>
              <option value="Kuna">Kuna</option>
              <option value="Nexo">Nexo</option>
              <option value="YoBit">YoBit</option>
              <option value="BigONE">BigONE</option>
              <option value="Bitrue">Bitrue</option>
              <option value="LATOKEN">LATOKEN</option>
            </select>
            <input
              type="text"
              name="apiKey"
              placeholder={t("apiKey")}
              value={formData.apiKey}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="volume"
              placeholder={t("volume")}
              value={formData.volume}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="priceMovement"
              placeholder={t("priceMovement")}
              value={formData.priceMovement}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="dex"
              placeholder="Enter DEX link"
              value={formData.dex}
              onChange={handleInputChange}
            />
            <select name="strategy" value={formData.strategy} onChange={handleInputChange}>
              <option value="">Select Market Making Strategy</option>
              <option value="Inventory Management">Inventory Management</option>
              <option value="Spread Optimization">Spread Optimization</option>
              <option value="Volatility-Based Quoting">Volatility-Based Quoting</option>
              <option value="Order Book Balancing">Order Book Balancing</option>
              <option value="Dynamic Spread Adjustment">Dynamic Spread Adjustment</option>
              <option value="Liquidity Provision">Liquidity Provision</option>
              <option value="Price Pegging">Price Pegging</option>
              <option value="High-Frequency Market Making">High-Frequency Market Making</option>
              <option value="Cross-Exchange Arbitrage">Cross-Exchange Arbitrage</option>
              <option value="Adaptive Market Making">Adaptive Market Making</option>
            </select>
            <button onClick={handleSubmit}>{t("payButton")}</button>
            <div className="status">{status}</div>
          </div>
        </Suspense>

        <footer>{t("footer")}</footer>
      </div>
    </>
  );
}

export default App;