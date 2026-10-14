import { createContext, useContext, useEffect, useRef, useState } from 'react'

const SoundContext = createContext()
const STORAGE_KEY = 'kibershield_sound_enabled'

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved === null ? true : saved === 'true'
    } catch {
      return true
    }
  })

  // Какой фоновый трек сейчас играет: 'main' или 'battle'
  const [bgTrack, setBgTrack] = useState('main')

  const bgMainRef = useRef(null)
  const bgBattleRef = useRef(null)
  const clickSoundRef = useRef(null)
  const typingSoundRef = useRef(null)
  const successSoundRef = useRef(null)
  const failSoundRef = useRef(null)
  const victorySoundRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  // Создаём Audio-объекты один раз
  useEffect(() => {
    bgMainRef.current = new Audio('/sounds/bg-music.mp3')
    bgMainRef.current.loop = true
    bgMainRef.current.volume = 0.35

    bgBattleRef.current = new Audio('/sounds/battle-music.mp3')
    bgBattleRef.current.loop = true
    bgBattleRef.current.volume = 0.4

    clickSoundRef.current = new Audio('/sounds/click.mp3')
    clickSoundRef.current.volume = 0.22

    typingSoundRef.current = new Audio('/sounds/typing.mp3')
    typingSoundRef.current.volume = 0.12

    successSoundRef.current = new Audio('/sounds/success.mp3')
    successSoundRef.current.volume = 0.5

    failSoundRef.current = new Audio('/sounds/fail.mp3')
    failSoundRef.current.volume = 0.35

    victorySoundRef.current = new Audio('/sounds/victory.mp3')
    victorySoundRef.current.volume = 0.6

    // Диагностика — пригодится при отладке
    ;[
      ['bg-music', bgMainRef.current],
      ['battle-music', bgBattleRef.current],
      ['click', clickSoundRef.current],
      ['typing', typingSoundRef.current],
      ['success', successSoundRef.current],
      ['fail', failSoundRef.current],
      ['victory', victorySoundRef.current],
    ].forEach(([name, audio]) => {
      audio.addEventListener('error', () => {
        console.error(`❌ Не удалось загрузить звук: ${name}.mp3`)
      })
      audio.addEventListener('canplaythrough', () => {
        console.log(`✅ Звук ${name}.mp3 загружен`)
      })
    })

    setLoaded(true)
  }, [])

  // Сохраняем настройку звука в localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false')
    } catch {}
  }, [enabled])

  // Управление фоновой музыкой
  useEffect(() => {
    if (!loaded) return
    const main = bgMainRef.current
    const battle = bgBattleRef.current
    if (!main || !battle) return

    if (!enabled) {
      main.pause()
      battle.pause()
      return
    }

    main.pause()
    battle.pause()

    const active = bgTrack === 'battle' ? battle : main
    const playPromise = active.play()
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        // Игнорируем — включим после первого клика
      })
    }
  }, [enabled, loaded, bgTrack])

  // Включаем фон после первого клика (обход блокировки браузера)
  useEffect(() => {
    if (!loaded || !enabled) return

    const enableOnFirstClick = () => {
      const active = bgTrack === 'battle' ? bgBattleRef.current : bgMainRef.current
      if (active && active.paused) {
        const playPromise = active.play()
        if (playPromise && playPromise.catch) playPromise.catch(() => {})
      }
      document.removeEventListener('click', enableOnFirstClick)
      document.removeEventListener('touchstart', enableOnFirstClick)
      document.removeEventListener('keydown', enableOnFirstClick)
    }

    document.addEventListener('click', enableOnFirstClick)
    document.addEventListener('touchstart', enableOnFirstClick)
    document.addEventListener('keydown', enableOnFirstClick)

    return () => {
      document.removeEventListener('click', enableOnFirstClick)
      document.removeEventListener('touchstart', enableOnFirstClick)
      document.removeEventListener('keydown', enableOnFirstClick)
    }
  }, [enabled, loaded, bgTrack])

  const safePlay = (audioRef) => {
    if (!enabled || !audioRef.current) return
    audioRef.current.currentTime = 0
    const playPromise = audioRef.current.play()
    if (playPromise && playPromise.catch) playPromise.catch(() => {})
  }

  const playClick = () => safePlay(clickSoundRef)
  const playTyping = () => safePlay(typingSoundRef)
  const playSuccess = () => safePlay(successSoundRef)
  const playFail = () => safePlay(failSoundRef)
  const playVictory = () => safePlay(victorySoundRef)

  const toggleSound = () => setEnabled(prev => !prev)

  // Переключение фонового трека
  const playBattleMusic = () => setBgTrack('battle')
  const playMainMusic = () => setBgTrack('main')

  return (
    <SoundContext.Provider value={{
      enabled,
      toggleSound,
      playClick,
      playTyping,
      playSuccess,
      playFail,
      playVictory,
      playBattleMusic,
      playMainMusic,
    }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSound must be used within SoundProvider')
  return ctx
}