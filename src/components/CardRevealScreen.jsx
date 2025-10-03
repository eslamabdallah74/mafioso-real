import React from 'react'

const CardRevealScreen = ({ 
  currentPlayer, 
  currentPlayerJob, 
  cardRevealed, 
  revealCard, 
  nextPlayerCard, 
  currentPlayerIndex, 
  players 
}) => {
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes screenPulse {
          0%, 100% { box-shadow: 0 15px 50px rgba(136, 0, 255, 0.4), 0 0 100px rgba(0, 255, 136, 0.2); }
          50% { box-shadow: 0 20px 60px rgba(136, 0, 255, 0.6), 0 0 120px rgba(0, 255, 136, 0.3); }
        }
        
        @keyframes bgShift {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes titleGlow {
          from { 
            text-shadow: 0 0 20px rgba(136, 0, 255, 0.8), 0 0 40px rgba(136, 0, 255, 0.4);
            transform: scale(1);
          }
          to { 
            text-shadow: 0 0 30px rgba(136, 0, 255, 1), 0 0 60px rgba(136, 0, 255, 0.6), 0 0 80px rgba(0, 255, 136, 0.3);
            transform: scale(1.02);
          }
        }
        
        @keyframes instructionShimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          50% { transform: translateY(-10px) rotateX(2deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .card-reveal-container {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 30px;
          padding: 3rem;
          border: 3px solid #8800ff;
          box-shadow: 0 15px 50px rgba(136, 0, 255, 0.4), 0 0 100px rgba(0, 255, 136, 0.2);
          backdrop-filter: blur(20px);
          text-align: center;
          width: 100%;
          max-width: 700px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          position: relative;
          overflow: hidden;
          margin: 1rem;
          animation: screenPulse 3s ease-in-out infinite;
        }
        
        .bg-effect {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(136, 0, 255, 0.15), transparent 50%),
                      radial-gradient(circle at 80% 50%, rgba(0, 255, 136, 0.15), transparent 50%);
          border-radius: 30px;
          z-index: 0;
          animation: bgShift 8s ease-in-out infinite;
          pointer-events: none;
        }
        
        .title {
          font-size: 2.8rem;
          margin-bottom: 1.5rem;
          color: #8800ff;
          text-shadow: 0 0 20px rgba(136, 0, 255, 0.8), 0 0 40px rgba(136, 0, 255, 0.4);
          font-weight: 800;
          animation: titleGlow 2s ease-in-out infinite alternate;
          letter-spacing: 2px;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }
        
        .instruction {
          font-size: 1.4rem;
          color: #ffffff;
          margin-bottom: 2.5rem;
          font-weight: 600;
          background: linear-gradient(135deg, rgba(136, 0, 255, 0.2), rgba(0, 136, 255, 0.2));
          padding: 1.2rem 2.5rem;
          border-radius: 20px;
          border: 2px solid rgba(136, 0, 255, 0.5);
          box-shadow: 0 5px 20px rgba(136, 0, 255, 0.3), inset 0 0 20px rgba(136, 0, 255, 0.1);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        
        .instruction::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: instructionShimmer 3s infinite;
        }
        
        .fifa-card-container {
          perspective: 1000px;
          margin: 2rem 0;
          width: 100%;
          max-width: 600px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .fifa-card {
          position: relative;
          width: 100%;
          height: 450px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          animation: cardFloat 3s ease-in-out infinite;
          border-radius: 25px;
        }
        
        .fifa-card:hover:not(.flipped) {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
        }
        
        .fifa-card.flipped {
          transform: rotateY(180deg);
          animation: none;
          cursor: default;
        }
        
        .card-front, .card-back {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 25px;
          border: 3px solid;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .card-front {
          background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
          border-color: #0088ff;
          box-shadow: 0 10px 40px rgba(0, 136, 255, 0.4);
        }
        
        .card-front::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(0, 136, 255, 0.1), transparent);
          animation: shimmer 2s infinite;
          z-index: 1;
        }
        
        .card-back {
          background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
          transform: rotateY(180deg);
          border-color: #00ff88;
          box-shadow: 0 10px 40px rgba(0, 255, 136, 0.4);
        }
        
        .card-back::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(0, 255, 136, 0.1), transparent);
          animation: shimmer 2s infinite;
          z-index: 1;
        }
        
        .card-header {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
          padding: 1.5rem;
          border-bottom: 2px solid rgba(136, 0, 255, 0.3);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 2;
        }
        
        .card-header h3 {
          color: #ffffff;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        
        .card-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.8;
        }
        
        .card-body p {
          color: #a0a0a0;
          font-size: 1.1rem;
          margin: 0;
        }
        
        .click-indicator {
          font-size: 2rem;
          margin-top: 1rem;
          animation: bounce 1s ease-in-out infinite;
        }
        
        .job-title {
          font-size: 2.2rem;
          color: #00ff88;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-align: center;
          line-height: 1.3;
          text-shadow: 0 2px 8px rgba(0, 255, 136, 0.3);
        }
        
        .role-status {
          font-size: 1.5rem;
          font-weight: 700;
          padding: 1.2rem 2rem;
          border-radius: 20px;
          text-align: center;
          min-width: 200px;
        }
        
        .role-status.criminal {
          color: #ff4444;
          background: rgba(255, 68, 68, 0.2);
          border: 2px solid #ff4444;
          box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
        }
        
        .role-status.innocent {
          color: #00ff88;
          background: rgba(0, 255, 136, 0.2);
          border: 2px solid #00ff88;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }
        
        .next-player-btn {
          background: linear-gradient(45deg, #8800ff, #0088ff);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 15px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 2rem;
          position: relative;
          z-index: 1;
          box-shadow: 0 5px 20px rgba(136, 0, 255, 0.4);
        }
        
        .next-player-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(136, 0, 255, 0.6);
        }
        
        @media (max-width: 768px) {
          .card-reveal-container {
            padding: 2rem;
            margin: 0.5rem;
          }
          
          .title {
            font-size: 2rem;
          }
          
          .instruction {
            font-size: 1.1rem;
            padding: 0.8rem 1.5rem;
          }
          
          .fifa-card {
            height: 350px;
          }
          
          .card-header h3 {
            font-size: 1.5rem;
          }
          
          .job-title {
            font-size: 1.8rem;
          }
          
          .role-status {
            font-size: 1.3rem;
            padding: 1rem 1.5rem;
            min-width: 150px;
          }
        }
      `}</style>
      
      <div className="card-reveal-container">
        <div className="bg-effect"></div>
        
        <h2 className="title">كشف الأدوار</h2>
        <p className="instruction">
          دور {currentPlayer?.name} - اضغط على البطاقة لرؤية دورك
        </p>
        
        <div className="fifa-card-container">
          <div 
            className={`fifa-card ${cardRevealed ? 'flipped' : ''}`}
            onClick={!cardRevealed ? revealCard : undefined}
          >
            <div className="card-front">
              <div className="card-header">
                <h3>{currentPlayer?.name}</h3>
              </div>
              <div className="card-body">
                <div className="card-icon">👤</div>
                <p>اضغط لرؤية الدور</p>
                <div className="click-indicator">👆</div>
              </div>
            </div>
            
            <div className="card-back">
              <div className="card-header">
                <h3>{currentPlayer?.name}</h3>
              </div>
              <div className="card-body">
                <div className="job-title">{currentPlayerJob?.job}</div>
                <div className={`role-status ${currentPlayerJob?.isCriminal ? 'criminal' : 'innocent'}`}>
                  {currentPlayerJob?.isCriminal ? '🕵️‍♂️ المجرم' : '👥 بريء'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {cardRevealed && (
          <button className="next-player-btn" onClick={nextPlayerCard}>
            {currentPlayerIndex < players.length - 1 ? 'اللاعب التالي' : 'بدء التحقيق'}
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
    padding: '1rem'
  }
}

export default CardRevealScreen