import React, { useState, useEffect, Suspense } from "react";
import { ethers } from "ethers";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { encryptWithPublicKey } from "eth-crypto";
import { useTranslation } from "react-i18next";
import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import PaymentAnimation from "./PaymentAnimation";
import "./App.css";
import "./i18n";

// Конфигурация Web3Modal
const projectId = "ddba0f009aa0ad5d1d48ab7bc0a8dec8";

const metadata = {
  name: "Alpha Market Maker AI",
  description: "A decentralized market maker application",
  url: "https://alphamarketmakeraidapp.vercel.app/",
  icons: ["https://alphamarketmakeraidapp.vercel.app/favicon.ico"],
};

const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://mainnet.infura.io/v3/4c9e3f999a68423bab7c091b3ef5440c",
};

const bsc = {
  chainId: 56,
  name: "BNB Smart Chain",
  currency: "BNB",
  explorerUrl: "https://bscscan.com",
  rpcUrl: "https://bsc-dataseed.binance.org/",
};

const sepolia = {
  chainId: 11155111,
  name: "Sepolia Testnet",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://sepolia.infura.io/v3/4c9e3f999a68423bab7c091b3ef5440c",
};

const chains = [mainnet, bsc, sepolia];

const modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains,
  projectId,
  enableAnalytics: true,
});

const contractAddresses = {
  "1": "0xYOUR_ETHEREUM_CONTRACT_ADDRESS",
  "56": "0xYOUR_BSC_CONTRACT_ADDRESS",
  "11155111": "0x973d57e218dDb5dCf9A5Fcc0a654243cdb94d3E6",
};

const usdtAddresses = {
  "1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "56": "0x55d398326f99059fF775485246999027B3197955",
  "11155111": "0xa2E2C327c886C78C935A6A079E9EDaB7472b8c53",
};

const abi = [
  "function payForService(uint8 _tariffId, bytes memory _encryptedData) external",
  "function withdrawUSDT(uint256 _amount) external",
  "function getTariff(uint8 _tariffId) external view returns (uint256 price, uint8 tradingPairs, uint8 durationWeeks)",
  "function getPaymentCount(address _client) external view returns (uint256)",
  "function ownerPublicKey() external view returns (bytes)",
  "function clientRecords(address, uint256) external view returns (bytes encryptedData, uint256 timestamp, uint8 tariffId)",
  "event PaymentReceived(address indexed client, uint256 amount, uint8 tariffId, bytes encryptedData)",
  "event PaymentFailed(address indexed client, string reason)",
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
    strategy: [],
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
  const [signer, setSigner] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [activeTariff, setActiveTariff] = useState(null);
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false);
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [showTariffModal, setShowTariffModal] = useState(false);

  const networks = [
    { chainId: "1", name: "Ethereum Mainnet" },
    { chainId: "56", name: "BNB Smart Chain" },
    { chainId: "11155111", name: "Sepolia Testnet" },
  ];

  const tariffs = [
    { id: 1, name: "2 Weeks, 1 Pair - 552 USDT" },
    { id: 2, name: "1 Month, 1 Pair - 1040 USDT" },
    { id: 3, name: "1 Month, 2 Pairs - 1600 USDT" },
    { id: 4, name: "1 Month, 3 Pairs - 2000 USDT" },
    { id: 5, name: "1 Month, 4 Pairs - 2400 USDT" },
    { id: 6, name: "1 Month, 5 Pairs - 2800 USDT" },
    { id: 7, name: "2 Months, 1 Pair - 1600 USDT" },
    { id: 8, name: "2 Months, 2 Pairs - 2800 USDT" },
    { id: 9, name: "2 Months, 3 Pairs - 3600 USDT" },
    { id: 10, name: "2 Months, 4 Pairs - 4400 USDT" },
    { id: 11, name: "2 Months, 5 Pairs - 4800 USDT" },
    { id: 12, name: "Change of strategy - 7 USDT" },
    { id: 13, name: "Project support - 799 USDT" },
  ];

  const strategies = [
    { key: "inventoryManagement", name: "Inventory Management", descriptionKey: "inventoryManagementDesc" },
    { key: "spreadOptimization", name: "Spread Optimization", descriptionKey: "spreadOptimizationDesc" },
    { key: "volatilityBasedQuoting", name: "Volatility-Based Quoting", descriptionKey: "volatilityBasedQuotingDesc" },
    { key: "orderBookBalancing", name: "Order Book Balancing", descriptionKey: "orderBookBalancingDesc" },
    { key: "dynamicSpreadAdjustment", name: "Dynamic Spread Adjustment", descriptionKey: "dynamicSpreadAdjustmentDesc" },
    { key: "liquidityProvision", name: "Liquidity Provision", descriptionKey: "liquidityProvisionDesc" },
    { key: "pricePegging", name: "Price Pegging", descriptionKey: "pricePeggingDesc" },
    { key: "highFrequencyMarketMaking", name: "High-Frequency Market Making", descriptionKey: "highFrequencyMarketMakingDesc" },
    { key: "adaptiveMarketMaking", name: "Adaptive Market Making", descriptionKey: "adaptiveMarketMakingDesc" },
    { key: "frontRunning", name: "Front-Running", descriptionKey: "frontRunningDesc" },
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
    candle.high = candle.y - randomHighWick;
    candle.low = (candle.type === "bullish" ? candle.y + candle.height : candle.y) + randomLowWick;
  });

  const calculateVolume = (candle, index) => {
    const priceRange = candle.high - candle.low;
    const baseVolume = Math.abs(priceRange) * 2;
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
    if (!candleData[i]) {
      setStatus(`Error: candleData[${i}] is undefined`);
      continue;
    }
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

  const fetchPaymentHistory = async () => {
    if (!walletConnected || !signer || !selectedNetwork) {
      setStatus("Cannot fetch payment history: wallet not connected or network not selected.");
      return;
    }

    const contractAddress = contractAddresses[selectedNetwork];
    if (!contractAddress) {
      setStatus("Contract address not configured for this network!");
      return;
    }

    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const paymentCount = await contract.getPaymentCount(walletAddress);
      const payments = [];

      for (let i = 0; i < Number(paymentCount); i++) {
        const record = await contract.clientRecords(walletAddress, i);
        const tariffId = Number(record.tariffId);
        const timestamp = Number(record.timestamp) * 1000;
        const tariffDetails = await contract.getTariff(tariffId);
        const amount = ethers.formatUnits(tariffDetails.price, 6);

        const payment = {
          tariffId: tariffId,
          amount: amount,
          timestamp: new Date(timestamp).toLocaleString(),
          durationWeeks: Number(tariffDetails.durationWeeks),
          timestampRaw: timestamp,
        };

        payments.push(payment);
      }

      setPaymentHistory(payments);

      const now = Date.now();

      const active = payments
        .sort((a, b) => b.timestampRaw - a.timestampRaw)
        .find(payment => {
          const durationMs = payment.durationWeeks * 7 * 24 * 60 * 60 * 1000;
          const endTime = payment.timestampRaw + durationMs;
          const isActive = endTime > now && payment.tariffId !== 12 && payment.tariffId !== 13;
          return isActive;
        });

      if (active) {
        const durationMs = active.durationWeeks * 7 * 24 * 60 * 60 * 1000;
        const endTime = active.timestampRaw + durationMs;
        setActiveTariff({
          tariffName: tariffs[active.tariffId - 1].name,
          endDate: new Date(endTime).toLocaleString(),
          status: "Active",
        });
        setShowTariffModal(true);
      } else {
        setActiveTariff(null);
        setShowTariffModal(false);
      }
    } catch (error) {
      setStatus(`Error fetching payment history: ${error.message}`);
    }
  };

  useEffect(() => {
    const unsubscribe = modal.subscribeProvider(({ address, chainId, isConnected }) => {
      if (isConnected && address && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          provider.getSigner().then(signer => {
            setProvider(provider);
            setSigner(signer);
            setWalletConnected(true);
            setWalletAddress(address);
            setSelectedNetwork(chainId.toString());
            setStatus(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
            fetchPaymentHistory();
          }).catch(error => {
            setStatus("Failed to get signer. Please try reconnecting.");
          });
        } catch (error) {
          setStatus("Failed to initialize provider.");
        }
      } else {
        setWalletConnected(false);
        setWalletAddress("");
        setSelectedNetwork("");
        setProvider(null);
        setSigner(null);
        setPaymentHistory([]);
        setActiveTariff(null);
        setShowTariffModal(false);
        setStatus("Wallet disconnected");
      }
    });
    return () => unsubscribe();
  }, []);

  const connectWallet = async () => {
    try {
      setStatus("Attempting to connect wallet...");
      await modal.open();
    } catch (error) {
      setStatus(`Connection error: ${error.message}`);
    }
  };

  const disconnectWallet = async () => {
    try {
      await modal.close();
      setWalletConnected(false);
      setWalletAddress("");
      setSelectedNetwork("");
      setProvider(null);
      setSigner(null);
      setPaymentHistory([]);
      setActiveTariff(null);
      setShowTariffModal(false);
      setStatus("Wallet disconnected");
    } catch (error) {
      setStatus(`Disconnect error: ${error.message}`);
    }
  };

  const switchNetwork = async (chainId) => {
    if (!provider) {
      setStatus("Please connect your wallet first!");
      return;
    }

    try {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${parseInt(chainId).toString(16)}` },
      ]);
      setSelectedNetwork(chainId);
      setStatus(`Switched to ${networks.find(net => net.chainId === chainId).name}`);
    } catch (error) {
      if (error.code === 4902) {
        try {
          if (chainId === "56") {
            await provider.send("wallet_addEthereumChain", [
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
            ]);
          } else if (chainId === "1") {
            await provider.send("wallet_addEthereumChain", [
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
            ]);
          } else if (chainId === "11155111") {
            await provider.send("wallet_addEthereumChain", [
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
            ]);
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
      formData.strategy.length > 0
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
    if (!signer) {
      setStatus("No signer available. Please reconnect wallet.");
      return;
    }

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

      const ownerPublicKeyHex = await contract.ownerPublicKey();
      const ownerPublicKey = ethers.getBytes(ownerPublicKeyHex);

      const encryptedData = await encryptWithPublicKey(ownerPublicKey, clientData);

      setStatus(t("status.approving"));
      const usdtContract = new ethers.Contract(
        usdtAddress,
        [
          "function approve(address spender, uint256 amount) external returns (bool)",
          "function decimals() external view returns (uint8)",
        ],
        signer
      );
      const decimals = await usdtContract.decimals();
      const amount = tariffs[tariffId - 1].name.split(" - ")[1].replace(" USDT", "");
      const approveTx = await usdtContract.approve(
        contractAddress,
        ethers.parseUnits(amount, decimals)
      );
      await approveTx.wait();

      setStatus(t("status.processing"));
      const encodedData = ethers.hexlify(
        ethers.toUtf8Bytes(
          JSON.stringify({
            iv: encryptedData.iv,
            ephemPublicKey: encryptedData.ephemPublicKey,
            ciphertext: encryptedData.ciphertext,
            mac: encryptedData.mac,
          })
        )
      );
      const tx = await contract.payForService(tariffId, encodedData);
      await tx.wait();

      setShowPaymentAnimation(true);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleAnimationComplete = () => {
    setShowPaymentAnimation(false);
    setStatus(t("status.success"));
    setFormData({
      projectName: "",
      exchange: "",
      apiKey: "",
      volume: "",
      priceMovement: "",
      dex: "",
      strategy: [],
    });
    fetchPaymentHistory();
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "strategy") {
      setFormData((prev) => {
        const currentStrategies = prev.strategy || [];
        if (checked) {
          return { ...prev, strategy: [...currentStrategies, value] };
        } else {
          return {
            ...prev,
            strategy: currentStrategies.filter((strat) => strat !== value),
          };
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleStrategy = (strategyName) => {
    setFormData((prev) => {
      const currentStrategies = prev.strategy || [];
      if (currentStrategies.includes(strategyName)) {
        return {
          ...prev,
          strategy: currentStrategies.filter((strat) => strat !== strategyName),
        };
      } else {
        return { ...prev, strategy: [...currentStrategies, strategyName] };
      }
    });
  };

  const particlesInit = async (engine) => {
    await loadSlim(engine);
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
              {candles.map((candle, idx) => {
                if (!candle || !candle.type) return null;
                return (
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
                );
              })}
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

      {showPaymentAnimation && (
        <PaymentAnimation onComplete={handleAnimationComplete} />
      )}

      {showTariffModal && activeTariff && (
        <div className="tariff-modal">
          <div className="tariff-modal-content">
            <h2>{t("activeTariffModalTitle")}</h2>
            <p>{t("activeTariff")}: {activeTariff.tariffName}</p>
            <p>{t("statusLabel")}: <span className={`status-${activeTariff.status.toLowerCase()}`}>{activeTariff.status}</span></p>
            <p>{t("endDate")}: {activeTariff.endDate}</p>
            <button onClick={() => setShowTariffModal(false)}>{t("close")}</button>
          </div>
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
              number: { value: 50, density: { enable: true, area: 800 } },
              color: { value: "#00d4ff" },
              shape: { type: "circle" },
              opacity: { value: { min: 0.1, max: 0.5 }, random: true },
              size: { value: { min: 1, max: 3 }, random: true },
              move: {
                enable: true,
                speed: { min: 1, max: 2 },
                direction: "none",
                random: false,
                straight: false,
                outModes: { default: "out" },
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
            <div className="strategy-multi-select">
              <div
                className="strategy-select-display"
                onClick={() => setIsStrategyOpen(!isStrategyOpen)}
              >
                {formData.strategy.length > 0
                  ? formData.strategy.map((strat) => t(strategies.find(s => s.name === strat).key)).join(", ")
                  : t("selectStrategies") + " *"}
              </div>
              {isStrategyOpen && (
                <div className="strategy-options">
                  {strategies.map((strategy) => (
                    <div
                      key={strategy.key}
                      className={`strategy-option ${
                        formData.strategy.includes(strategy.name) ? "selected" : ""
                      }`}
                      onClick={() => toggleStrategy(strategy.name)}
                    >
                      <span>{t(strategy.key)}</span>
                      <p className="strategy-description">{t(strategy.descriptionKey)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleSubmit}>{t("payButton")}</button>
            <div className="status">{status}</div>
          </div>

          {walletConnected && (
            <div className="client-dashboard">
              <h2>{t("clientDashboard")}</h2>
              {activeTariff ? (
                <div className="active-tariff">
                  <p>{t("activeTariff")}: {activeTariff.tariffName}</p>
                  <p>{t("statusLabel")}: <span className={`status-${activeTariff.status.toLowerCase()}`}>{activeTariff.status}</span></p>
                  <p>{t("endDate")}: {activeTariff.endDate}</p>
                </div>
              ) : (
                <p>{t("noActiveTariff")}</p>
              )}
              {paymentHistory.length > 0 && (
                <div className="payment-history">
                  <h2>{t("paymentHistory")}</h2>
                  <ul>
                    {paymentHistory.map((payment, idx) => (
                      <li key={idx}>
                        {t("tariff")}: {tariffs[payment.tariffId - 1].name}, {t("amount")}: {payment.amount} USDT, {t("date")}: {payment.timestamp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Suspense>

        <footer>{t("footer")}</footer>
      </div>
    </>
  );
}

export default App;