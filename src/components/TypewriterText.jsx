import { useState, useEffect, useRef } from 'react'
import { useSound } from '../context/SoundContext'

export default function TypewriterText({ text, speed = 30, onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const { playTyping } = useSound()
  const lastCharCount = useRef(0)

  useEffect(() => {
    setDisplayed('')
    lastCharCount.current = 0
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      // Играем звук печати каждые 3 символа, чтобы не спамить
      if (i % 3 === 0) playTyping()
      if (i >= text.length) {
        clearInterval(timer)
        if (onComplete) onComplete()
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return <span>{displayed}</span>
}