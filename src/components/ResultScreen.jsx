import React from 'react'
import './ResultScreen.css'

const ResultScreen = ({ gameResult, resetGame, playAgain }) => {
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
      <div className="result-actions">
        <button className="play-again-btn" onClick={playAgain}>
          لعب مرة أخرى
        </button>
        <button className="new-game-btn" onClick={resetGame}>
          لعبة جديدة
        </button>
      </div>
    </div>
  )
}

export default ResultScreen
