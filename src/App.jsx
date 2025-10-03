import { useState, useEffect } from 'react'
import './styles/global.css'
import geminiService from './services/geminiService'

// Import Components
import WelcomeScreen from './components/WelcomeScreen'
import SetupScreen from './components/SetupScreen'
import StoryScreen from './components/StoryScreen'
import CardRevealScreen from './components/CardRevealScreen'
import CluesScreen from './components/CluesScreen'
import VotingScreen from './components/VotingScreen'
import ResultScreen from './components/ResultScreen'

function App() {
  const [gameState, setGameState] = useState('welcome') // welcome, setup, story, cardReveal, clues, voting, result
  const [players, setPlayers] = useState(() => {
    // Load players from localStorage on component mount
    const savedPlayers = localStorage.getItem('cau-players')
    return savedPlayers ? JSON.parse(savedPlayers) : []
  })
  const [currentStory, setCurrentStory] = useState(null)
  const [assignedJobs, setAssignedJobs] = useState([])
  const [currentClueIndex, setCurrentClueIndex] = useState(0)
  const [votes, setVotes] = useState({})
  const [criminal, setCriminal] = useState(null)
  const [eliminatedPlayers, setEliminatedPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [cardRevealed, setCardRevealed] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  const [wrongGuesses, setWrongGuesses] = useState(0)

  // Save players to localStorage whenever players change
  useEffect(() => {
    localStorage.setItem('cau-players', JSON.stringify(players))
  }, [players])

  // Initialize game with AI-generated content
  useEffect(() => {
    if (gameState === 'story' && !currentStory && !isLoading) {
      generateGameContent()
    }
  }, [gameState, players, currentStory, isLoading])

  const generateGameContent = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Generate all content in one request
      const playerNames = players.map(p => p.name)
      const gameData = await geminiService.generateGameContent(playerNames)
      
      // Set story
      setCurrentStory({ title: 'قصة الجريمة', story: gameData.story, clues: gameData.clues })
      
      // Assign jobs to players
      const jobAssignments = players.map((player, index) => {
        const playerJob = gameData.jobs.find(job => job.name === player.name)
        return {
          player,
          job: playerJob ? playerJob.job : `وظيفة ${index + 1}`,
          isCriminal: false
        }
      })
      
      // Randomly select one criminal
      const criminalIndex = Math.floor(Math.random() * players.length)
      jobAssignments[criminalIndex].isCriminal = true
      setCriminal(jobAssignments[criminalIndex])
      setAssignedJobs(jobAssignments)
      
    } catch (error) {
      console.error('Error generating game content:', error)
      setError('حدث خطأ في توليد المحتوى. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  const addPlayer = (name) => {
    if (name.trim() && players.length < 8) {
      setPlayers([...players, { id: Date.now(), name: name.trim() }])
    }
  }

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id))
  }

  const startGame = () => {
    if (players.length >= 3) {
      setGameState('story')
    }
  }

  const startFromWelcome = () => {
    setGameState('setup')
  }

  const resetPlayers = () => {
    setPlayers([])
    localStorage.removeItem('cau-players')
  }

  const playAgain = () => {
    setGameState('setup')
    setCurrentStory(null)
    setAssignedJobs([])
    setCurrentClueIndex(0)
    setVotes({})
    setCriminal(null)
    setEliminatedPlayers([])
    setCurrentPlayerIndex(0)
    setCardRevealed(false)
    setGameResult(null)
    setWrongGuesses(0)
  }

  const nextPhase = () => {
    if (gameState === 'story') setGameState('cardReveal')
    else if (gameState === 'cardReveal') setGameState('clues')
    else if (gameState === 'clues') setGameState('voting')
  }

  const nextPlayerCard = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1)
      setCardRevealed(false)
    } else {
      setGameState('clues')
    }
  }

  const revealCard = () => {
    setCardRevealed(true)
  }

  const showNextClue = () => {
    setGameState('voting')
  }

  const voteForPlayer = (playerId) => {
    const newVotes = { ...votes, [playerId]: (votes[playerId] || 0) + 1 }
    setVotes(newVotes)
  }

  const submitVote = () => {
    // Find player with most votes
    const voteEntries = Object.entries(votes)
    if (voteEntries.length === 0) return

    const [eliminatedPlayerId, voteCount] = voteEntries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    )

    const eliminatedPlayer = assignedJobs.find(job => job.player.id === parseInt(eliminatedPlayerId))
    
    if (eliminatedPlayer.isCriminal) {
      // Criminal eliminated - Villagers win
      setGameResult('villagers')
      setGameState('result')
    } else {
      // Villager eliminated - wrong guess
      setEliminatedPlayers([...eliminatedPlayers, eliminatedPlayer])
      setWrongGuesses(wrongGuesses + 1)
      
      // Show next clue if available
      if (currentClueIndex < currentStory.clues.length - 1) {
        setCurrentClueIndex(currentClueIndex + 1)
        setVotes({})
        setGameState('clues')
      } else {
        // No more clues - Criminal wins
        setGameResult('criminal')
        setGameState('result')
      }
    }
  }

  const resetGame = () => {
    setGameState('welcome')
    setPlayers([])
    setCurrentStory(null)
    setAssignedJobs([])
    setCurrentClueIndex(0)
    setVotes({})
    setCriminal(null)
    setEliminatedPlayers([])
    setCurrentPlayerIndex(0)
    setCardRevealed(false)
    setGameResult(null)
    setWrongGuesses(0)
  }

  const getCurrentPlayer = () => {
    return players[currentPlayerIndex]
  }

  const getCurrentPlayerJob = () => {
    return assignedJobs.find(job => job.player.id === getCurrentPlayer()?.id)
  }

  return (
    <div className="app">
      <div className="game-container">
        {gameState === 'welcome' && (
          <WelcomeScreen 
            onStartGame={startFromWelcome}
          />
        )}

        {gameState === 'setup' && (
          <SetupScreen 
            players={players}
            addPlayer={addPlayer}
            removePlayer={removePlayer}
            startGame={startGame}
            resetPlayers={resetPlayers}
          />
        )}

        {gameState === 'story' && (
          <StoryScreen 
            currentStory={currentStory}
            isLoading={isLoading}
            error={error}
            generateGameContent={generateGameContent}
            nextPhase={nextPhase}
          />
        )}

        {gameState === 'cardReveal' && (
          <CardRevealScreen 
            currentPlayer={getCurrentPlayer()}
            currentPlayerJob={getCurrentPlayerJob()}
            cardRevealed={cardRevealed}
            revealCard={revealCard}
            nextPlayerCard={nextPlayerCard}
            currentPlayerIndex={currentPlayerIndex}
            players={players}
          />
        )}

        {gameState === 'clues' && currentStory && (
          <CluesScreen 
            currentStory={currentStory}
            currentClueIndex={currentClueIndex}
            showNextClue={showNextClue}
          />
        )}

        {gameState === 'voting' && (
          <VotingScreen 
            assignedJobs={assignedJobs}
            eliminatedPlayers={eliminatedPlayers}
            votes={votes}
            voteForPlayer={voteForPlayer}
            submitVote={submitVote}
            currentClueIndex={currentClueIndex}
          />
        )}

        {gameState === 'result' && (
          <ResultScreen 
            gameResult={{
              winner: gameResult === 'villagers' ? 'players' : 'criminal',
              message: gameResult === 'villagers' ? 'تم القبض على المجرم!' : 'المجرم نجح في الهروب!',
              criminal: criminal?.player.name
            }}
            resetGame={resetGame}
            playAgain={playAgain}
          />
        )}
      </div>
    </div>
  )
}

export default App