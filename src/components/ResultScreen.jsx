import React from 'react'
import './ResultScreen.css'

const ResultScreen = ({ gameResult, resetGame }) => {
  return (
    <div className="result-screen">
      <h2>{gameResult.winner === 'players' ? '🎉 فوز اللاعبين!' : '💀 فوز المجرم!'}</h2>
      <div className="result-content">
        <p>{gameResult.message}</p>
        {gameResult.criminal && (
          <div className="criminal-reveal">
            <h3>المجرم كان:</h3>
            <p className="criminal-name">{gameResult.criminal}</p>
          </div>
        )}
      </div>
      <button className="play-again-btn" onClick={resetGame}>
        لعب مرة أخرى
      </button>
    </div>
  )
}

export default ResultScreen
