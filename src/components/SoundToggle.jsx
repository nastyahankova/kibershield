import { useSound } from '../context/SoundContext'

export default function SoundToggle({ position = 'bottom-left' }) {
  const { enabled, toggleSound } = useSound()

  const positions = {
    'bottom-left': { bottom: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
    'top-right': { top: 22, right: 22 },
  }

  return (
    <button
      onClick={toggleSound}
      title={enabled ? 'Выключить звук' : 'Включить звук'}
      style={{
        position: 'fixed',
        ...positions[position],
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.95)',
        border: '2.5px solid var(--pastel-blue)',
        boxShadow: '0 6px 18px rgba(46, 58, 89, 0.15)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        zIndex: 300,
        transition: 'transform 0.15s ease, border-color 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.1)'
        e.currentTarget.style.borderColor = 'var(--accent-blue)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.borderColor = 'var(--pastel-blue)'
      }}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  )
}