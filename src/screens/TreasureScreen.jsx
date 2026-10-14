import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import { useGame } from '../context/GameContext.jsx'
import { useSound } from '../context/SoundContext.jsx'

export default function TreasureScreen() {
  const navigate = useNavigate()
  const { progress, resetProgress } = useGame()
  const { playVictory, playMainMusic } = useSound()

  const [stage, setStage] = useState('glow')

  // Отслеживаем ширину экрана
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Автопереход
  useEffect(() => {
    const t1 = setTimeout(() => setStage('open'), 1500)
    const t2 = setTimeout(() => setStage('reveal'), 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // Звук победы + возврат обычной музыки
  useEffect(() => {
    if (stage === 'open') {
      playVictory()
      playMainMusic()
    }
  }, [stage])

  const handleHome = () => navigate('/')

  const handleReplay = () => {
    resetProgress()
    navigate('/')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #FFF9EC 0%, #FFE9B5 40%, #FFD98A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 3vh, 40px)',
        boxSizing: 'border-box',
      }}
    >
      {/* Радужные полосы */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 8, background: 'linear-gradient(90deg, #A8D8EA, #A5E0B8, #FFEBA0, #FFCC91, #FFA8A8, #C8A8EB)', zIndex: 100 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 8, background: 'linear-gradient(90deg, #C8A8EB, #FFA8A8, #FFCC91, #FFEBA0, #A5E0B8, #A8D8EA)', zIndex: 100 }} />

      {/* Логотип БРПО — верхний левый угол */}
      <img
        src="/images/brpo-logo.png"
        alt="БРПО"
        style={{
          position: 'fixed',
          top: isMobile ? 14 : 20,
          left: isMobile ? 12 : 24,
                    height: isMobile ? 'clamp(120px, 20vh, 180px)' : 'clamp(180px, 26vh, 300px)',
          objectFit: 'contain',
          zIndex: 30,
          filter: 'drop-shadow(0 8px 18px rgba(46, 58, 89, 0.2))',
        }}
        onError={e => (e.target.style.display = 'none')}
      />

      {/* Логотип школы — верхний правый угол */}
      <img
        src="/images/school-logo.png"
        alt="Школа"
        style={{
          position: 'fixed',
          top: isMobile ? 14 : 16,
          right: isMobile ? 12 : 24,
          height: isMobile ? 'clamp(55px, 9vh, 85px)' : 'clamp(80px, 12vh, 140px)',
          objectFit: 'contain',
          zIndex: 30,
          filter: 'drop-shadow(0 8px 18px rgba(46, 58, 89, 0.2))',
        }}
        onError={e => (e.target.style.display = 'none')}
      />

      {/* Лучи света */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: '180vmax',
          height: '180vmax',
          top: '50%',
          left: '50%',
          marginLeft: '-90vmax',
          marginTop: '-90vmax',
          background: `conic-gradient(
            from 0deg,
            rgba(255, 220, 120, 0.35) 0deg,
            transparent 20deg,
            transparent 40deg,
            rgba(255, 220, 120, 0.35) 60deg,
            transparent 80deg,
            transparent 100deg,
            rgba(255, 220, 120, 0.35) 120deg,
            transparent 140deg,
            transparent 160deg,
            rgba(255, 220, 120, 0.35) 180deg,
            transparent 200deg,
            transparent 220deg,
            rgba(255, 220, 120, 0.35) 240deg,
            transparent 260deg,
            transparent 280deg,
            rgba(255, 220, 120, 0.35) 300deg,
            transparent 320deg,
            transparent 340deg,
            rgba(255, 220, 120, 0.35) 360deg
          )`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Блёстки */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: (i * 0.13) % 3 }}
          style={{
            position: 'absolute',
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            fontSize: `${0.8 + (i % 3) * 0.4}rem`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '💫'}
        </motion.div>
      ))}

      {/* Фейерверк */}
      <Fireworks active={stage === 'reveal'} />

      {/* ==================== ДВУХКОЛОНОЧНАЯ РАСКЛАДКА ==================== */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 1400,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? 20 : 'clamp(20px, 4vw, 60px)',
          padding: isMobile ? '60px 0 0' : '20px 0',
        }}
      >
        {/* ============ ЛЕВАЯ КОЛОНКА — ПЕРСОНАЖИ ============ */}
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: isMobile ? 12 : 'clamp(16px, 3vw, 40px)',
            flexShrink: 0,
          }}
        >
          {/* Пионер */}
          <motion.img
            src="/images/hero.png"
            alt="Пионер"
            animate={{ y: [0, -20, 0], rotate: [0, -6, 6, -6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6 }}
            style={{
              height: isMobile ? 'clamp(140px, 22vh, 200px)' : 'clamp(220px, 38vh, 400px)',
              objectFit: 'contain',
              filter: 'drop-shadow(0 14px 28px rgba(46, 58, 89, 0.28))',
            }}
            onError={e => (e.target.style.display = 'none')}
          />

          {/* Сердечко между персонажами */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              repeatDelay: 0.8,
            }}
            style={{
              fontSize: isMobile ? '2rem' : 'clamp(3rem, 5vw, 5rem)',
              marginBottom: isMobile ? 30 : 'clamp(40px, 8vh, 80px)',
              filter: 'drop-shadow(0 8px 16px rgba(232, 92, 92, 0.5))',
              pointerEvents: 'none',
            }}
          >
            💛
          </motion.div>

          {/* Огонёк */}
          <motion.img
            src="/images/ogonek.png"
            alt="Огонёк"
            animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
            style={{
              height: isMobile ? 'clamp(120px, 18vh, 170px)' : 'clamp(190px, 32vh, 350px)',
              objectFit: 'contain',
              filter: 'drop-shadow(0 14px 28px rgba(46, 58, 89, 0.28))',
            }}
            onError={e => (e.target.style.display = 'none')}
          />
        </motion.div>

        {/* ============ ПРАВАЯ КОЛОНКА — ТЕКСТ ============ */}
        <AnimatePresence>
          {stage === 'reveal' && (
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
              style={{
                width: isMobile ? '100%' : 'auto',
                maxWidth: isMobile ? '100%' : 650,
                flex: isMobile ? '1 1 100%' : '1 1 500px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Заголовок */}
              <h1
                style={{
                  fontSize: isMobile ? 'clamp(1.8rem, 7vw, 2.4rem)' : 'clamp(2.2rem, 4vw, 3.4rem)',
                  background: 'linear-gradient(135deg, #D4A02C, #E8A317, #F0C24B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0,
                  marginBottom: 16,
                  lineHeight: 1.1,
                  textAlign: 'center',
                  filter: 'drop-shadow(0 4px 8px rgba(180, 120, 0, 0.2))',
                }}
              >
                🏆 Клад найден!
              </h1>

              {/* Карточка с текстом */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(14px)',
                  borderRadius: 24,
                  padding: isMobile ? '20px 18px' : 'clamp(20px, 3vh, 30px) clamp(24px, 3vw, 40px)',
                  border: '3px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 20px 60px rgba(197, 130, 10, 0.3)',
                  marginBottom: 20,
                  width: '100%',
                }}
              >
                <p
                  style={{
                    fontSize: isMobile ? 'clamp(1.1rem, 4.5vw, 1.3rem)' : 'clamp(1.15rem, 1.6vw, 1.45rem)',
                    fontWeight: 800,
                    color: '#C55A00',
                    lineHeight: 1.5,
                    margin: 0,
                    marginBottom: 12,
                    textAlign: 'center',
                  }}
                >
                  Молодец, юный пионер!
                </p>
                <p
                  style={{
                    fontSize: isMobile ? 'clamp(0.95rem, 3.5vw, 1.1rem)' : 'clamp(1rem, 1.3vw, 1.15rem)',
                    color: 'var(--text-dark)',
                    lineHeight: 1.6,
                    margin: 0,
                    marginBottom: 10,
                  }}
                >
                  Ты прошёл весь путь, победил 9 цифровых злодеев
                  и разгадал все хитрости Профессора Хаоса.
                </p>
                <p
                  style={{
                    fontSize: isMobile ? 'clamp(0.95rem, 3.5vw, 1.1rem)' : 'clamp(1rem, 1.3vw, 1.15rem)',
                    color: 'var(--text-soft)',
                    lineHeight: 1.6,
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  Но самое главное сокровище — это{' '}
                  <b style={{ color: '#C55A00' }}>твои знания</b>.
                  Теперь ты знаешь, как защитить себя, свою семью и своих друзей
                  в цифровом мире. Настоящий пионер — это тот, кто умеет помочь
                  и защитить. Ты — молодец! 💛
                </p>
              </div>

              {/* Статистика */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                  marginBottom: 20,
                  width: '100%',
                }}
              >
                <StatBadge emoji="🧩" label="Фрагментов" value={`${progress.fragments} / 9`} isMobile={isMobile} />
                <StatBadge emoji="👹" label="Злодеев" value="9" isMobile={isMobile} />
                <StatBadge emoji="🏆" label="Финал" value="✓" isMobile={isMobile} />
              </div>

              {/* Кнопки */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                  width: '100%',
                }}
              >
                <Button
                  onClick={() => navigate('/certificate')}
                  variant="primary"
                  className="btn-xl"
                  style={{
                    background: 'linear-gradient(135deg, #4CB86C, #2A8B4E)',
                    color: 'white',
                    fontSize: '1.25rem',
                    padding: '16px 36px',
                  }}
                >
                  🎓 Получить грамоту
                </Button>
                <Button
                  onClick={handleHome}
                  variant="secondary"
                  className="btn-xl"
                  style={{
                    fontSize: isMobile ? '1rem' : '1.15rem',
                    padding: isMobile ? '14px 24px' : '16px 32px',
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: isMobile ? 320 : 'none',
                  }}
                >
                  🏠 На главную
                </Button>
              </div>

              {/* Пройти заново */}
              <button
                onClick={handleReplay}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-soft)',
                  fontSize: '0.9rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  padding: 8,
                  marginTop: 12,
                }}
              >
                ↻ Пройти игру заново
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Если stage ещё не 'reveal' — показываем подсказку по центру */}
        {stage !== 'reveal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              textAlign: 'center',
              padding: '20px 0',
            }}
          >
            <motion.p
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                fontSize: isMobile ? '1.2rem' : 'clamp(1.4rem, 2vw, 1.8rem)',
                color: '#8B6914',
                fontWeight: 800,
                margin: 0,
              }}
            >
              {stage === 'glow' ? '✨ Клад сияет...' : '🎉 Открывается!'}
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Плашка статистики
// ============================================
function StatBadge({ emoji, label, value, isMobile }) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 16,
        padding: isMobile ? '8px 14px' : '10px 18px',
        border: '2px solid rgba(255, 255, 255, 0.95)',
        boxShadow: '0 8px 20px rgba(197, 130, 10, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minWidth: isMobile ? 100 : 130,
      }}
    >
      <span style={{ fontSize: isMobile ? '1.3rem' : '1.6rem' }}>{emoji}</span>
      <div style={{ textAlign: 'left' }}>
        <div
          style={{
            fontSize: isMobile ? '0.6rem' : '0.7rem',
            color: 'var(--text-soft)',
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}
        >
          {label.toUpperCase()}
        </div>
        <div style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', fontWeight: 800, color: 'var(--text-dark)' }}>
          {value}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Фейерверк
// ============================================
function Fireworks({ active }) {
  const [bursts, setBursts] = useState([])

  useEffect(() => {
    if (!active) return

    const colors = ['#FFD166', '#EF476F', '#06D6A0', '#118AB2', '#F78C6B', '#C8A8EB', '#FFEBA0']

    const interval = setInterval(() => {
      const id = Date.now() + Math.random()
      const x = 10 + Math.random() * 80
      const y = 10 + Math.random() * 60
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = 100 + Math.random() * 120
      setBursts(prev => [...prev, { id, x, y, color, size }])

      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== id))
      }, 2000)
    }, 700)

    return () => clearInterval(interval)
  }, [active])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      {bursts.map(b => (
        <div key={b.id} style={{ position: 'absolute', top: `${b.y}%`, left: `${b.x}%` }}>
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.6 }}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: b.color,
              boxShadow: `0 0 20px ${b.color}, 0 0 40px ${b.color}`,
              marginLeft: -4,
              marginTop: -4,
            }}
          />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const distance = b.size
            const dx = Math.cos(angle) * distance
            const dy = Math.sin(angle) * distance
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: dx, y: dy, opacity: 0, scale: 0.3 }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: b.color,
                  boxShadow: `0 0 10px ${b.color}`,
                  marginLeft: -3.5,
                  marginTop: -3.5,
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}