import { useState, useEffect } from 'react'
import { useSound } from '../context/SoundContext'

export default function SoundToggle({ position = 'bottom-right' }) {
  const { enabled, toggleSound } = useSound()
  const [isMobile, setIsMobile] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const positions = {
    'bottom-left': {
      bottom: isMobile ? 16 : 16,
      left: 16,
    },
    'bottom-right': {
      bottom: isMobile ? 80 : 16,
      right: isMobile ? 8 : 16,
    },
    'top-right': {
      top: isMobile ? 70 : 22,
      right: isMobile ? 10 : 22,
    },
  }

  const size = isMobile ? 44 : 52

  return (
    <button
      onClick={toggleSound}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      title={enabled ? 'Выключить звук' : 'Включить звук'}
      style={{
        position: 'fixed',
        ...positions[position],
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '2px solid rgba(168, 216, 234, 0.9)',
        boxShadow: '0 4px 12px rgba(46, 58, 89, 0.15)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '1.15rem' : '1.4rem',
        zIndex: 300,
        opacity: isPressed ? 1 : 0.7,
        transform: isPressed ? 'scale(1.1)' : 'scale(1)',
        transition: 'opacity 0.2s, transform 0.15s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.borderColor = 'var(--accent-blue)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.opacity = '0.7'
        e.currentTarget.style.borderColor = 'rgba(168, 216, 234, 0.9)'
      }}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  )
}