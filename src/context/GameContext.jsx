import { createContext, useContext, useEffect, useState } from 'react'

const GameContext = createContext()

const STORAGE_KEY = 'kibershield_progress_v1'

const defaultProgress = {
  started: false,
  heroName: '',
  completedMissions: [],
  currentMission: 1,
  fragments: 0,
  finalCompleted: false,
}

export function GameProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress
    } catch {
      return defaultProgress
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const startGame = (heroName = 'Пионер') => {
    setProgress(prev => ({ ...prev, started: true, heroName }))
  }

  const completeMission = (missionId) => {
    setProgress(prev => {
      const completed = prev.completedMissions.includes(missionId)
        ? prev.completedMissions
        : [...prev.completedMissions, missionId]
      return {
        ...prev,
        completedMissions: completed,
        fragments: completed.length,
        currentMission: Math.min(missionId + 1, 9),
      }
    })
  }

  const completeFinal = () => {
    setProgress(prev => ({ ...prev, finalCompleted: true }))
  }

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY)
    setProgress(defaultProgress)
  }

  const isMissionCompleted = (id) => progress.completedMissions.includes(id)

  return (
    <GameContext.Provider value={{
      progress,
      startGame,
      completeMission,
      completeFinal,
      resetProgress,
      isMissionCompleted,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}