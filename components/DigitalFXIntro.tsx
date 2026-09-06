"use client";

import { useEffect, useState } from "react";

export default function DigitalFXIntro() {
  const [count, setCount] = useState(3);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = window.setTimeout(() => {
      setCount(2);
    }, 900);

    const second = window.setTimeout(() => {
      setCount(1);
    }, 1800);

    const finish = window.setTimeout(() => {
      setCount(0);
    }, 2400);

    const hide = window.setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(second);
      window.clearTimeout(finish);
      window.clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="dfx-intro" aria-label="Digital FX">
      <div className="dfx-orbit dfx-orbit-1" />
      <div className="dfx-orbit dfx-orbit-2" />
      <div className="dfx-grid dfx-grid-left" />
      <div className="dfx-grid dfx-grid-right" />

      <div className="dfx-intro-content">
        <div className="dfx-intro-logo-wrap">
          <div className="dfx-logo-glow" />
          <img
            src="/logo.png"
            alt="Digital FX"
            className="dfx-intro-logo"
          />
        </div>

        <div className="dfx-intro-brand">DIGITAL FX</div>

        <div className="dfx-intro-line">
          <span />
        </div>

        <p className="dfx-intro-text">
          DIGITAL MARKETING THAT DELIVERS
        </p>

        <div className="dfx-intro-keywords">
          <span>VISIBILITY</span>
          <i>•</i>
          <span>LEADS</span>
          <i>•</i>
          <span>CONVERSION</span>
          <i>•</i>
          <span>GROWTH</span>
        </div>

        <div className="dfx-count-wrap">
          <div className="dfx-count-ring">
            <div className="dfx-count">
              {count === 0 ? "GO" : count}
            </div>
          </div>
        </div>

        <div className="dfx-intro-loading">
          GETTING THINGS READY<span className="dfx-dots">...</span>
        </div>
      </div>

      <div className="dfx-wave dfx-wave-back" />
      <div className="dfx-wave dfx-wave-mid" />
      <div className="dfx-wave dfx-wave-front" />

      <div className="dfx-intro-bottom">
        <div className="dfx-url">
          <span />
          WWW.DIGITALFX.IN
          <span />
        </div>

        <div className="dfx-build">
          BUILD <b>•</b> BRAND <b>•</b> GROW
        </div>
      </div>

      <div className="dfx-corner dfx-corner-tl" />
      <div className="dfx-corner dfx-corner-tr" />
      <div className="dfx-corner dfx-corner-bl" />
      <div className="dfx-corner dfx-corner-br" />

      <style jsx>{`
        .dfx-intro {
          position: fixed;
          inset: 0;
          z-index: 99999;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 50% 38%, rgba(255,255,255,1) 0%, rgba(247,251,255,.98) 30%, rgba(232,242,255,.96) 62%, rgba(218,233,252,1) 100%);
          color: #071b49;
          animation: dfxIntroIn .35s ease-out both;
        }

        .dfx-intro::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 50% 42%, rgba(49,93,245,.09), transparent 31%),
            linear-gradient(180deg, rgba(255,255,255,.78) 0%, transparent 48%, rgba(5,28,73,.04) 100%);
          pointer-events: none;
        }

        .dfx-intro-content {
          position: relative;
          z-index: 5;
          width: min(760px, 90vw);
          margin-top: -5vh;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .dfx-intro-logo-wrap {
          position: relative;
          width: clamp(150px, 19vw, 225px);
          height: clamp(90px, 12vw, 130px);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
        }

        .dfx-logo-glow {
          position: absolute;
          width: 125%;
          height: 125%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(49,93,245,.15), transparent 67%);
          filter: blur(10px);
        }

        .dfx-intro-logo {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 10px 24px rgba(11,43,102,.14));
        }

        .dfx-intro-brand {
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(28px, 4vw, 48px);
          line-height: 1;
          font-weight: 800;
          letter-spacing: .16em;
          margin-left: .16em;
          color: #071b49;
          text-shadow: 0 2px 18px rgba(49,93,245,.08);
        }

        .dfx-intro-line {
          width: 125px;
          height: 2px;
          margin: 22px 0 15px;
          overflow: hidden;
          background: rgba(49,93,245,.13);
          border-radius: 999px;
        }

        .dfx-intro-line span {
          display: block;
          width: 55%;
          height: 100%;
          margin: auto;
          background: #315df5;
          box-shadow: 0 0 14px rgba(49,93,245,.55);
          animation: dfxLine 1.4s ease-in-out infinite;
        }

        .dfx-intro-text {
          margin: 0;
          font-size: clamp(10px, 1.1vw, 14px);
          font-weight: 700;
          letter-spacing: .34em;
          color: #17366f;
        }

        .dfx-intro-keywords {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          margin-top: 30px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .28em;
          color: #6680aa;
        }

        .dfx-intro-keywords i {
          font-style: normal;
          color: #315df5;
          font-size: 9px;
        }

        .dfx-count-wrap {
          margin-top: 32px;
        }

        .dfx-count-ring {
          position: relative;
          width: 118px;
          height: 118px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255,255,255,.72);
          border: 1px solid rgba(49,93,245,.25);
          box-shadow:
            0 12px 38px rgba(33,78,150,.12),
            inset 0 0 30px rgba(255,255,255,.95);
        }

        .dfx-count-ring::before {
          content: "";
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: #315df5;
          border-right-color: rgba(49,93,245,.25);
          animation: dfxSpin 1.4s linear infinite;
        }

        .dfx-count-ring::after {
          content: "";
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 1px solid rgba(49,93,245,.1);
        }

        .dfx-count {
          position: relative;
          z-index: 2;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 52px;
          line-height: 1;
          font-weight: 800;
          color: #1745b6;
          animation: dfxCount .45s ease-out;
        }

        .dfx-intro-loading {
          margin-top: 20px;
          font-size: 10px;
          letter-spacing: .34em;
          font-weight: 700;
          color: #60789f;
        }

        .dfx-dots {
          display: inline-block;
          width: 18px;
          text-align: left;
          animation: dfxDots 1s steps(4, end) infinite;
        }

        .dfx-wave {
          position: absolute;
          left: -8%;
          width: 116%;
          pointer-events: none;
          border-radius: 50% 50% 0 0;
          transform-origin: center;
        }

        .dfx-wave-back {
          bottom: -21%;
          height: 38%;
          background: linear-gradient(180deg, rgba(177,210,250,.72), rgba(72,124,224,.72));
          transform: rotate(-4deg);
          box-shadow: 0 -1px 0 rgba(255,255,255,.9);
        }

        .dfx-wave-mid {
          bottom: -25%;
          height: 30%;
          background: linear-gradient(180deg, #174cae, #09285f);
          transform: rotate(3deg);
          box-shadow: 0 -2px 10px rgba(49,93,245,.25);
        }

        .dfx-wave-front {
          bottom: -31%;
          height: 26%;
          background: linear-gradient(180deg, #071f4d, #031332);
          transform: rotate(-5deg);
          box-shadow: 0 -1px 0 rgba(49,93,245,.75);
        }

        .dfx-wave-front::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #3d7bff;
          box-shadow: 0 0 15px rgba(61,123,255,.8);
        }

        .dfx-intro-bottom {
          position: absolute;
          z-index: 7;
          left: 0;
          right: 0;
          bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 48px;
          color: rgba(255,255,255,.88);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .36em;
        }

        .dfx-url {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .dfx-url span {
          display: block;
          width: 80px;
          height: 1px;
          background: rgba(255,255,255,.75);
        }

        .dfx-build {
          position: absolute;
          right: 48px;
          letter-spacing: .28em;
        }

        .dfx-build b {
          margin: 0 7px;
          color: #4d83ff;
        }

        .dfx-orbit {
          position: absolute;
          left: 50%;
          top: 42%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .dfx-orbit-1 {
          width: min(72vw, 900px);
          height: min(72vw, 900px);
          border: 1px solid rgba(49,93,245,.08);
          box-shadow: 0 0 80px rgba(49,93,245,.035);
        }

        .dfx-orbit-2 {
          width: min(58vw, 720px);
          height: min(58vw, 720px);
          border: 1px solid rgba(49,93,245,.055);
        }

        .dfx-grid {
          position: absolute;
          width: 120px;
          height: 170px;
          opacity: .4;
          background-image: radial-gradient(rgba(49,93,245,.32) 1px, transparent 1px);
          background-size: 12px 12px;
          pointer-events: none;
        }

        .dfx-grid-left {
          left: 20px;
          bottom: 28%;
        }

        .dfx-grid-right {
          right: 20px;
          top: 26%;
        }

        .dfx-corner {
          position: absolute;
          width: 34px;
          height: 34px;
          opacity: .45;
        }

        .dfx-corner-tl {
          top: 24px;
          left: 24px;
          border-top: 1px solid #315df5;
          border-left: 1px solid #315df5;
        }

        .dfx-corner-tr {
          top: 24px;
          right: 24px;
          border-top: 1px solid #315df5;
          border-right: 1px solid #315df5;
        }

        .dfx-corner-bl {
          bottom: 24px;
          left: 24px;
          border-bottom: 1px solid #315df5;
          border-left: 1px solid #315df5;
        }

        .dfx-corner-br {
          bottom: 24px;
          right: 24px;
          border-bottom: 1px solid #315df5;
          border-right: 1px solid #315df5;
        }

        @keyframes dfxSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes dfxLine {
          0%, 100% { transform: translateX(-40%); }
          50% { transform: translateX(40%); }
        }

        @keyframes dfxCount {
          from { transform: scale(.75); opacity: .2; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes dfxDots {
          0% { opacity: .25; }
          50% { opacity: 1; }
          100% { opacity: .25; }
        }

        @keyframes dfxIntroIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 640px) {
          .dfx-intro-content {
            margin-top: -9vh;
          }

          .dfx-intro-brand {
            font-size: 27px;
            letter-spacing: .11em;
            margin-left: .11em;
          }

          .dfx-intro-text {
            font-size: 8px;
            letter-spacing: .22em;
          }

          .dfx-intro-keywords {
            gap: 7px;
            font-size: 7px;
            letter-spacing: .14em;
          }

          .dfx-count-ring {
            width: 92px;
            height: 92px;
          }

          .dfx-count {
            font-size: 42px;
          }

          .dfx-intro-loading {
            font-size: 8px;
            letter-spacing: .22em;
          }

          .dfx-intro-bottom {
            bottom: 18px;
            padding: 0 20px;
          }

          .dfx-url {
            gap: 10px;
            font-size: 7px;
            letter-spacing: .22em;
          }

          .dfx-url span {
            width: 28px;
          }

          .dfx-build {
            display: none;
          }

          .dfx-grid {
            opacity: .22;
            transform: scale(.7);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dfx-intro,
          .dfx-intro-line span,
          .dfx-count-ring::before,
          .dfx-count,
          .dfx-dots {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}