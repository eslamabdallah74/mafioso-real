import React from 'react'
import './WelcomeScreen.css'

const WelcomeScreen = ({ onStartGame }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        {/* Logo and Brand */}
        <div className="brand-section">
          <div className="logo">
            <div className="logo-icon">🕵️‍♂️</div>
          </div>
          <h1 className="brand-title">CAU</h1>
          <h2 className="brand-subtitle">Criminal Among Us</h2>
          <p className="brand-tagline">لعبة الاستنتاج الاجتماعي بالذكاء الاصطناعي</p>
        </div>

        {/* Game Features */}
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🎭</div>
            <h3>أدوار متنوعة</h3>
            <p>كل لاعب يحصل على دور فريد مرتبط بالقصة</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>ذكاء اصطناعي</h3>
            <p>قصص وأدلة مولدة بالذكاء الاصطناعي</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🕵️</div>
            <h3>تحقيق تفاعلي</h3>
            <p>أدلة متدرجة ونظام تصويت ذكي</p>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="instructions-section">
          <h3>كيفية اللعب</h3>
          <div className="instructions-grid">
            <div className="instruction-step">
              <div className="step-number">1</div>
              <p>أدخل أسماء اللاعبين</p>
            </div>
            <div className="instruction-step">
              <div className="step-number">2</div>
              <p>اقرأ القصة واكتشف أدواركم</p>
            </div>
            <div className="instruction-step">
              <div className="step-number">3</div>
              <p>استخدم الأدلة للتحقيق</p>
            </div>
            <div className="instruction-step">
              <div className="step-number">4</div>
              <p>صوت لطرد المشتبه به</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="start-section">
          <button className="start-game-btn" onClick={onStartGame}>
            <span className="btn-text">ابدأ اللعبة</span>
            <span className="btn-icon">🚀</span>
          </button>
          <p className="start-hint">3-8 لاعبين</p>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <p>صُنع بـ ❤️ باستخدام Gemini AI</p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
