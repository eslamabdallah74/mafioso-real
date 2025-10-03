import React, { useState } from 'react'
import './VotingScreen.css'

const VotingScreen = ({ 
  assignedJobs, 
  eliminatedPlayers, 
  voteForPlayer, 
  submitVote, 
  currentClueIndex 
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = (playerId) => {
    if (!hasVoted) {
      setSelectedPlayer(playerId)
      voteForPlayer(playerId)
      setHasVoted(true)
    }
  }

  const handleSubmit = () => {
    if (selectedPlayer) {
      submitVote()
    }
  }

  const availablePlayers = assignedJobs.filter(job => 
    !eliminatedPlayers.some(elim => elim.player.id === job.player.id)
  )

  return (
    <div className="voting-screen">
      <h2>من تعتقد أنه المجرم؟</h2>
      <p className="voting-instruction">
        بعد الدليل {currentClueIndex + 1} - اختر لاعباً واحداً فقط
      </p>
      
      <div className="voting-grid">
        {availablePlayers.map((assignment, index) => (
          <button 
            key={assignment.player.id} 
            className={`vote-btn ${selectedPlayer === assignment.player.id ? 'selected' : ''} ${hasVoted ? 'disabled' : ''}`}
            onClick={() => handleVote(assignment.player.id)}
            disabled={hasVoted}
          >
            <div className="player-avatar">
              {assignment.player.name.charAt(0).toUpperCase()}
            </div>
            <div className="player-info">
              <h3>{assignment.player.name}</h3>
              <p>{assignment.job}</p>
            </div>
            {selectedPlayer === assignment.player.id && (
              <div className="selected-indicator">✓</div>
            )}
          </button>
        ))}
      </div>
      
      {hasVoted && (
        <div className="vote-confirmation">
          <p>تم اختيارك: <strong>{availablePlayers.find(p => p.player.id === selectedPlayer)?.player.name}</strong></p>
        </div>
      )}
      
      <button 
        className={`submit-vote-btn ${selectedPlayer ? 'active' : 'disabled'}`}
        onClick={handleSubmit}
        disabled={!selectedPlayer}
      >
        {hasVoted ? 'تأكيد التصويت' : 'اختر لاعباً أولاً'}
      </button>
    </div>
  )
}

export default VotingScreen
