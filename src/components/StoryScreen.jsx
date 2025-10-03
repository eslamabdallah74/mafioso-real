import React from 'react'
import './StoryScreen.css'

const StoryScreen = ({ currentStory, isLoading, error, generateGameContent, nextPhase }) => {
  return (
    <div className="story-screen">
      {isLoading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <h2>جاري توليد القصة...</h2>
          <p>الذكاء الاصطناعي يخلق مغامرة جديدة لك!</p>
        </div>
      ) : error ? (
        <div className="error-screen">
          <h2>خطأ في التحميل</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={generateGameContent}>
            إعادة المحاولة
          </button>
        </div>
      ) : currentStory ? (
        <>
          <h2>{currentStory.title}</h2>
          <div className="story-content">
            <p>{currentStory.story}</p>
          </div>
          <button className="next-btn" onClick={nextPhase}>
            المتابعة
          </button>
        </>
      ) : null}
    </div>
  )
}

export default StoryScreen
