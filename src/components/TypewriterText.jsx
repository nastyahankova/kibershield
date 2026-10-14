import { useState, useEffect } from 'react'
import { useSound } from '../context/SoundContext'

export default function TypewriterText({ text, speed = 30, onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const { playTyping, stopTyping } = useSound()

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      // Звук каждые 3 символа — реже, чтобы не «тарахтел» слишком часто
      if (i % 3 === 0) playTyping()
      if (i >= text.length) {
        clearInterval(timer)
        // ⚠️ Останавливаем звук печати, когда текст закончился
        stopTyping()
        if (onComplete) onComplete()
      }
    }, speed)
    return () => {
      clearInterval(timer)
      stopTyping()   // стоп при размонтировании
    }
  }, [text, speed])

  return <span>{displayed}</span>
}