import React from 'react'
import './CluesScreen.css'

const CluesScreen = ({ currentStory, currentClueIndex, showNextClue }) => {
  return (
    <div className="clues-screen">
      <h2>الأدلة</h2>
      <div className="clue-display">
        <h3>{currentStory.clues[currentClueIndex]}</h3>
      </div>
      <div className="clue-controls">
        <button className="next-clue-btn" onClick={showNextClue}>
          التصويت الآن
        </button>
      </div>
    </div>
  )
}

export default CluesScreen
