import React from 'react'
import './SetupScreen.css'

const SetupScreen = ({ players, addPlayer, removePlayer, startGame }) => {
  return (
    <div className="setup-screen">
      <h2>إعداد اللعبة</h2>
      <div className="players-list">
        <h3>اللاعبون ({players.length}/8)</h3>
        {players.map(player => (
          <div key={player.id} className="player-item">
            <span>{player.name}</span>
            <button onClick={() => removePlayer(player.id)} className="remove-btn">×</button>
          </div>
        ))}
      </div>
      
      {players.length < 8 && (
        <div className="add-player">
          <input 
            type="text" 
            placeholder="اسم اللاعب"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addPlayer(e.target.value)
                e.target.value = ''
              }
            }}
          />
        </div>
      )}
      
      <button 
        className="start-btn" 
        onClick={startGame}
        disabled={players.length < 3}
      >
        بدء اللعبة
      </button>
    </div>
  )
}

export default SetupScreen
