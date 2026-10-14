import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import { useGame } from '../context/GameContext.jsx'

export default function StartScreen() {
  const { progress, resetProgress } = useGame()
  const [resetOpen, setResetOpen] = useState(false)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--grad-bg)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: isMobile
          ? 'clamp(60px, 10vh, 90px) 16px clamp(30px, 5vh, 50px)'
          : 'clamp(80px, 12vh, 140px) clamp(16px, 2vw, 32px) clamp(40px, 6vh, 60px)',
      }}
    >
      {/* Декоративные свечения */}
      <div
        style={{
          position: 'absolute',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 216, 234, 0.65), transparent 65%)',
          top: '-15%',
          left: '-15%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 235, 160, 0.7), transparent 65%)',
          bottom: '-15%',
          right: '-12%',
          pointerEvents: 'none',
        }}
      />

      {/* Радужные полосы */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: 8,
          background: 'linear-gradient(90deg, #A8D8EA, #A5E0B8, #FFEBA0, #FFCC91, #FFA8A8, #C8A8EB)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0, height: 8,
          background: 'linear-gradient(90deg, #C8A8EB, #FFA8A8, #FFCC91, #FFEBA0, #A5E0B8, #A8D8EA)',
          pointerEvents: 'none',
        }}
      />

      {/* Логотип БРПО */}
      <img
        src="/images/brpo-logo.png"
        alt="БРПО"
        style={{
          position: 'absolute',
          top: isMobile ? 20 : 'clamp(12px, 2vh, 24px)',
          left: isMobile ? 12 : 'clamp(16px, 2vw, 32px)',
          height: isMobile
            ? 'clamp(70px, 11vh, 110px)'
            : 'clamp(140px, 22vh, 240px)',
          objectFit: 'contain',
          zIndex: 4,
          filter: 'drop-shadow(0 6px 14px rgba(46, 58, 89, 0.15))',
        }}
        onError={e => (e.target.style.display = 'none')}
      />

      {/* Логотип школы */}
      <img
        src="/images/school-logo.png"
        alt="Школа"
        style={{
          position: 'absolute',
          top: isMobile ? 14 : 'clamp(10px, 1.8vh, 20px)',
          right: isMobile ? 12 : 'clamp(16px, 2vw, 28px)',
          height: isMobile
            ? 'clamp(60px, 10vh, 100px)'
            : 'clamp(120px, 18vh, 200px)',
          objectFit: 'contain',
          zIndex: 4,
          filter: 'drop-shadow(0 6px 14px rgba(46, 58, 89, 0.15))',
        }}
        onError={e => (e.target.style.display = 'none')}
      />

      {/* ===== Пионер — только на больших экранах ===== */}
      {!isMobile && (
        <motion.img
          src="/images/hero.png"
          alt="Пионер"
          initial={{ opacity: 0, x: -60 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -10, 0],
            rotate: [0, 1.5, -1.5, 0],
          }}
          transition={{
            opacity: { delay: 0.2, duration: 0.7 },
            x: { delay: 0.2, duration: 0.7 },
            y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            position: 'absolute',
            left: 'clamp(2%, 4vw, 8%)',
            bottom: 'clamp(20px, 5vh, 70px)',
            height: 'clamp(280px, 52vh, 540px)',
            objectFit: 'contain',
            objectPosition: 'bottom left',
            zIndex: 3,
            filter: 'drop-shadow(0 20px 40px rgba(46, 58, 89, 0.25))',
            pointerEvents: 'none',
          }}
          onError={e => (e.target.style.display = 'none')}
        />
      )}

      {/* ===== Огонёк — только на больших экранах ===== */}
      {!isMobile && (
        <motion.img
          src="/images/ogonek.png"
          alt="Огонёк"
          initial={{ opacity: 0, x: 60 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -12, 0],
            rotate: [0, 2, -2, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            opacity: { delay: 0.3, duration: 0.7 },
            x: { delay: 0.3, duration: 0.7 },
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            position: 'absolute',
            right: 'clamp(2%, 4vw, 8%)',
            bottom: 'clamp(20px, 5vh, 70px)',
            height: 'clamp(260px, 50vh, 520px)',
            objectFit: 'contain',
            objectPosition: 'bottom right',
            zIndex: 3,
            filter: 'drop-shadow(0 20px 40px rgba(46, 58, 89, 0.25))',
            pointerEvents: 'none',
          }}
          onError={e => (e.target.style.display = 'none')}
        />
      )}

      {/* ===== Центральная карточка ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: isMobile ? 24 : 32,
          padding: isMobile
            ? 'clamp(20px, 3vh, 32px) clamp(18px, 4vw, 28px)'
            : 'clamp(24px, 4vh, 44px) clamp(28px, 3.5vw, 52px)',
          boxShadow: '0 24px 60px rgba(46, 58, 89, 0.22)',
          border: '2px solid rgba(255, 255, 255, 0.95)',
          maxWidth: isMobile ? '100%' : 560,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? 10 : 'clamp(8px, 1.4vh, 16px)',
          zIndex: 2,
        }}
      >
        {/* Герой на мобильных */}
        {isMobile && (
          <motion.img
            src="/images/hero.png"
            alt="Пионер"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { delay: 0.2, duration: 0.5 },
              scale: { delay: 0.2, duration: 0.5 },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              height: 'clamp(110px, 18vh, 180px)',
              objectFit: 'contain',
              marginBottom: 4,
              filter: 'drop-shadow(0 10px 20px rgba(46, 58, 89, 0.2))',
            }}
            onError={e => (e.target.style.display = 'none')}
          />
        )}

        <h1
          style={{
            fontSize: isMobile
              ? 'clamp(2rem, 9vw, 3rem)'
              : 'clamp(2.4rem, 4.4vw, 3.6rem)',
            background: 'linear-gradient(135deg, #4A90E2, #9B6BC9, #EE85B5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            fontWeight: 900,
          }}
        >
          КиберЩит
        </h1>

        <h2
          style={{
            color: 'var(--accent-blue)',
            fontWeight: 800,
            fontSize: isMobile
              ? 'clamp(1rem, 4vw, 1.3rem)'
              : 'clamp(1.1rem, 1.9vw, 1.5rem)',
            margin: 0,
            letterSpacing: '0.06em',
            textAlign: 'center',
          }}
        >
          ✦ Остров Сокровищ ✦
        </h2>

        <p
          style={{
            color: 'var(--text-soft)',
            fontSize: isMobile
              ? 'clamp(0.9rem, 3.5vw, 1.05rem)'
              : 'clamp(0.95rem, 1.2vw, 1.15rem)',
            maxWidth: 460,
            lineHeight: 1.55,
            textAlign: 'center',
            margin: '2px 0 6px',
          }}
        >
          Отправляйся в путешествие вместе с Огоньком,
          победи 9 злодеев и найди главное сокровище —
          знания о безопасной сети.
        </p>

        {/* ===== Кнопки ===== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 10 : 'clamp(8px, 1.2vh, 12px)',
            width: '100%',
            maxWidth: isMobile ? '100%' : 400,
            marginTop: 6,
          }}
        >
          <Button
            to={progress.started ? '/map' : '/prologue'}
            variant="primary"
            className="btn-full btn-xl"
          >
            {progress.started ? '▶ Продолжить путешествие' : '▶ Начать игру'}
          </Button>

          <Button to="/about" variant="secondary" className="btn-full btn-xl">
            ℹ О проекте
          </Button>

          {/* Кнопка «Памятка пионеру» — ведёт на /memo */}
          <Button
            to="/memo"
            variant="primary"
            className="btn-full btn-xl"
            style={{
              background: 'linear-gradient(135deg, #4CB86C, #2A8B4E)',
              color: 'white',
            }}
          >
            📘 Памятка пионеру
          </Button>

          {progress.started && (
            <Button
              variant="danger"
              onClick={() => setResetOpen(true)}
              className="btn-full btn-xl"
            >
              ↻ Сбросить прогресс
            </Button>
          )}
        </div>
      </motion.div>

      {/* Модальное окно сброса прогресса */}
      <Modal isOpen={resetOpen} onClose={() => setResetOpen(false)}>
        <h3 style={{ marginBottom: 16 }}>Сбросить прогресс?</h3>
        <p style={{ marginBottom: 24, color: 'var(--text-soft)' }}>
          Вы действительно хотите сбросить весь прогресс?
          Это действие нельзя отменить.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setResetOpen(false)}>
            Отмена
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              resetProgress()
              setResetOpen(false)
            }}
          >
            Сбросить
          </Button>
        </div>
      </Modal>
    </div>
  )
}