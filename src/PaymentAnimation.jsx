import React, { useEffect, useState } from 'react';
import './App.css';

const PaymentAnimation = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 8000); // Увеличил длительность до 8 секунд для более насыщенной анимации
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="payment-animation">
      {/* Фон с эффектом цифровой матрицы */}
      <div className="digital-matrix">
        {[...Array(30)].map((_, i) => (
          <div
            key={`matrix-${i}`}
            className="matrix-stream"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Неоновая сетка */}
      <div className="neon-grid" />

      {/* Центральный AI-кристалл и элементы market making */}
      <div className="market-making-core">
        <svg className="core-svg" viewBox="0 0 400 400">
          <defs>
            {/* Градиенты для кристалла */}
            <radialGradient id="crystal-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
              <stop offset="70%" style={{ stopColor: '#0033aa', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.5 }} />
            </radialGradient>

            {/* Градиенты для ордеров на покупку и продажу */}
            <linearGradient id="buy-order-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4dff4d', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#00ff00', stopOpacity: 0.5 }} />
            </linearGradient>
            <linearGradient id="sell-order-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ff4d4d', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ff0000', stopOpacity: 0.5 }} />
            </linearGradient>

            {/* Градиент для спреда */}
            <radialGradient id="spread-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: '#ffd700', stopOpacity: 0 }} />
              <stop offset="70%" style={{ stopColor: '#ffd700', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#ffd700', stopOpacity: 0 }} />
            </radialGradient>

            {/* Градиент для сделок */}
            <linearGradient id="trade-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#4dff4d', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* AI-кристалл (многогранник) */}
          <g className="crystal-core">
            <polygon
              points="200,120 280,200 200,280 120,200"
              fill="url(#crystal-gradient)"
              filter="drop-shadow(0 0 20px rgba(0, 212, 255, 0.8))"
            />
            <polygon
              points="200,130 270,200 200,270 130,200"
              fill="url(#crystal-gradient)"
              opacity="0.5"
              filter="drop-shadow(0 0 15px rgba(0, 212, 255, 0.5))"
            />
          </g>

          {/* Вращающиеся кольца вокруг кристалла */}
          <g className="orbital-rings">
            <circle cx="200" cy="200" r="80" fill="none" stroke="#00d4ff" strokeWidth="2" opacity="0.5" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.3" />
          </g>

          {/* Спред (голографическое кольцо) */}
          <circle
            className="spread-ring"
            cx="200"
            cy="200"
            r="90"
            fill="url(#spread-gradient)"
            filter="drop-shadow(0 0 15px rgba(255, 215, 0, 0.7))"
          />

          {/* Потоки ордеров (покупка и продажа) */}
          {[...Array(8)].map((_, i) => (
            <g key={`order-${i}`}>
              <line
                className={`order-stream ${i % 2 === 0 ? 'buy' : 'sell'}`}
                x1="200"
                y1="200"
                x2={200 + 150 * Math.cos((i * 45 * Math.PI) / 180)}
                y2={200 + 150 * Math.sin((i * 45 * Math.PI) / 180)}
                stroke={i % 2 === 0 ? 'url(#buy-order-gradient)' : 'url(#sell-order-gradient)'}
                strokeWidth="3"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
              <circle
                className={`order-particle ${i % 2 === 0 ? 'buy' : 'sell'}`}
                cx="200"
                cy="200"
                r="4"
                fill={i % 2 === 0 ? '#4dff4d' : '#ff4d4d'}
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            </g>
          ))}

          {/* Сделки (импульсы и мини-графики) */}
          {[...Array(4)].map((_, i) => (
            <g key={`trade-${i}`} className="trade-pulse" style={{ animationDelay: `${2 + i * 0.5}s` }}>
              <circle
                cx={200 + 120 * Math.cos(((i * 90 + 45) * Math.PI) / 180)}
                cy={200 + 120 * Math.sin(((i * 90 + 45) * Math.PI) / 180)}
                r="10"
                fill="url(#trade-gradient)"
                filter="drop-shadow(0 0 10px rgba(0, 212, 255, 0.7))"
              />
              <g className="mini-chart">
                <polyline
                  points={`${200 + 120 * Math.cos(((i * 90 + 45) * Math.PI) / 180) - 15},${200 + 120 * Math.sin(((i * 90 + 45) * Math.PI) / 180) + 10} ${200 + 120 * Math.cos(((i * 90 + 45) * Math.PI) / 180)},${200 + 120 * Math.sin(((i * 90 + 45) * Math.PI) / 180) - 10} ${200 + 120 * Math.cos(((i * 90 + 45) * Math.PI) / 180) + 15},${200 + 120 * Math.sin(((i * 90 + 45) * Math.PI) / 180) + 5}`}
                  fill="none"
                  stroke="url(#trade-gradient)"
                  strokeWidth="1"
                />
                <rect
                  x={200 + 120 * Math.cos(((i * 90 + 45) * Math.PI) / 180) - 5}
                  y={200 + 120 * Math.sin(((i * 90 + 45) * Math.PI) / 180) - 5}
                  width="3"
                  height="5"
                  fill="#4dff4d"
                />
              </g>
            </g>
          ))}

          {/* Звуковые волны */}
          <g className="sound-waves">
            <circle cx="200" cy="200" r="60" fill="none" stroke="#00d4ff" strokeWidth="2" opacity="0.3" />
            <circle cx="200" cy="200" r="70" fill="none" stroke="#00d4ff" strokeWidth="2" opacity="0.2" />
          </g>
        </svg>
      </div>

      {/* Текст с эффектом сканирования */}
      <div className="activation-text">Payment Successful</div>
      <div className="sub-text">Market Making AI Activated</div>

      {/* Финальный взрыв частиц */}
      <div className="final-burst">
        {[...Array(20)].map((_, i) => (
          <div
            key={`burst-${i}`}
            className="burst-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${5 + Math.random() * 1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentAnimation;