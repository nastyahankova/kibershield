import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import TypewriterText from '../components/TypewriterText.jsx'
import { useGame } from '../context/GameContext.jsx'

const dialogues = [
  {
    speaker: 'Огонёк',
    text: 'Привет! Я — Огонёк, талисман ОО "БРПО". А ты, я вижу, настоящий пионер!',
  },
  {
    speaker: 'Огонёк',
    text: 'Слушай легенду. Далеко в цифровом океане есть Остров Сокровищ. Там спрятан сундук, в котором хранится главное сокровище — Клад Знаний о безопасной сети.',
  },
  {
    speaker: 'Огонёк',
    text: 'Но злой Профессор Хаос и его 9 помощников охраняют путь к сундуку. Они хотят, чтобы ребята попадали в их ловушки.',
  },
  {
    speaker: 'Огонёк',
    text: 'Ты готов отправиться в путешествие, победить злодеев и найти клад? Тогда вперёд!',
  },
]

export default function Prologue() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const { startGame, progress } = useGame()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleNext = () => {
    if (step < dialogues.length - 1) {
      setStep(step + 1)
    } else {
      startGame(progress.heroName || 'Пионер')
      navigate('/map')
    }
  }

  const current = dialogues[step]

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        padding: isMobile
          ? '20px 14px 20px'
          : 'clamp(20px, 4vh, 60px) clamp(16px, 3vw, 48px)',
        background: 'var(--grad-bg)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Радужные полосы */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg, #A8D8EA, #A5E0B8, #FFEBA0, #FFCC91, #FFA8A8, #C8A8EB)',
          zIndex: 100,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0, height: 6,
          background: 'linear-gradient(90deg, #C8A8EB, #FFA8A8, #FFCC91, #FFEBA0, #A5E0B8, #A8D8EA)',
          zIndex: 100,
        }}
      />

      {/* Огонёк — крупный, слева (только на больших экранах) */}
      {!isMobile && (
        <motion.img
          src="/images/ogonek.png"
          alt="Огонёк"
          initial={{ opacity: 0, x: -60, scale: 0.9 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -14, 0],
            rotate: [0, 2, -2, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            opacity: { duration: 0.6 },
            x: { type: 'spring', stiffness: 100, damping: 20 },
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            position: 'absolute',
            left: 'clamp(20px, 5vw, 80px)',
            bottom: 'clamp(160px, 22vh, 260px)',
            height: 'clamp(280px, 50vh, 620px)',
            objectFit: 'contain',
            zIndex: 3,
            filter: 'drop-shadow(0 20px 40px rgba(46, 58, 89, 0.28))',
            pointerEvents: 'none',
          }}
          onError={e => (e.target.style.display = 'none')}
        />
      )}

      {/* Диалоговая карточка */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(14px)',
          borderRadius: isMobile ? 22 : 32,
          padding: isMobile
            ? 'clamp(20px, 3vh, 28px)'
            : 'clamp(28px, 4vh, 48px)',
          boxShadow: '0 28px 70px rgba(46, 58, 89, 0.25)',
          border: '2px solid rgba(255, 255, 255, 0.95)',
          maxWidth: isMobile ? '100%' : 900,
          width: '100%',
          position: 'relative',
          zIndex: 5,
          marginBottom: isMobile ? 8 : 'clamp(8px, 2vh, 20px)',
        }}
      >
        {/* Огонёк внутри карточки — только на мобильных */}
        {isMobile && (
          <motion.img
            src="/images/ogonek.png"
            alt="Огонёк"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              height: 'clamp(90px, 15vh, 140px)',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto 8px',
              filter: 'drop-shadow(0 8px 16px rgba(46, 58, 89, 0.2))',
            }}
            onError={e => (e.target.style.display = 'none')}
          />
        )}

        <h2
          style={{
            color: '#E8A317',
            marginBottom: isMobile ? 12 : 18,
            fontSize: isMobile
              ? 'clamp(1.3rem, 5vw, 1.7rem)'
              : 'clamp(1.6rem, 2.8vw, 2.4rem)',
            fontWeight: 800,
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          🔥 {current.speaker}
        </h2>

        <p
          style={{
            fontSize: isMobile
              ? 'clamp(1rem, 4vw, 1.2rem)'
              : 'clamp(1.3rem, 2vw, 1.8rem)',
            lineHeight: 1.55,
            color: 'var(--text-dark)',
            fontWeight: 600,
            minHeight: isMobile ? 'clamp(100px, 20vh, 160px)' : 'clamp(120px, 18vh, 200px)',
            margin: 0,
          }}
        >
          <TypewriterText key={step} text={current.text} speed={25} />
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'space-between',
            alignItems: 'center',
            marginTop: isMobile ? 18 : 24,
            gap: 12,
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%',
          }}
        >
          {/* Точки прогресса */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginRight: isMobile ? 0 : 'auto',
            }}
          >
            {dialogues.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 32 : 12,
                  height: 12,
                  borderRadius: 6,
                  background: i === step ? '#4A90E2' : '#D5DEEC',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            variant="primary"
            className="btn-xl"
            style={{
              fontSize: isMobile ? '1.1rem' : '1.35rem',
              padding: isMobile ? '14px 24px' : '18px 42px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? 340 : 'none',
            }}
          >
            {step < dialogues.length - 1 ? 'Далее →' : '🚀 Начать путешествие'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}