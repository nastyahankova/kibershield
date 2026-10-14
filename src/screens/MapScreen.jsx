import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import { useGame } from '../context/GameContext.jsx'

// 10 точек на карте: 9 миссий + финал с Профессором Хаосом
// Координаты измерены в Paint по файлу island.png (1536×960)
const points = [
  { id: 1,  x: 15.5, y: 72.6, emoji: '🎣', name: 'Крючок',         label: 'Фишинг' },
  { id: 2,  x: 15.9, y: 54.7, emoji: '📱', name: 'Поток',          label: 'Спам и SMS' },
  { id: 3,  x: 19.6, y: 37.0, emoji: '👤', name: 'Тень',           label: 'Кибербуллинг' },
  { id: 4,  x: 30.2, y: 25.5, emoji: '🐛', name: 'Червь',          label: 'Вирусы' },
  { id: 5,  x: 45.1, y: 18.2, emoji: '📰', name: 'Мираж',          label: 'Фейк-новости' },
  { id: 6,  x: 59.6, y: 20.6, emoji: '🔐', name: 'Взломщик',       label: 'Пароли' },
  { id: 7,  x: 71.6, y: 27.9, emoji: '👁️', name: 'Соглядатай',    label: 'Данные' },
  { id: 8,  x: 75.2, y: 41.2, emoji: '🎩', name: 'Иллюзионист',    label: 'Мошенники' },
  { id: 9,  x: 70.0, y: 58.0, emoji: '👥', name: 'Клон',           label: 'Фейк-аккаунты' },
  { id: 10, x: 57.8, y: 63.3, emoji: '💀', name: 'Профессор Хаос', label: 'Финал' },
]

export default function MapScreen() {
  const navigate = useNavigate()
  const { progress, isMissionCompleted } = useGame()

  const [isMobile, setIsMobile] = useState(false)

  // Точка, на которую только что кликнули (для анимации)
  const [clickedPoint, setClickedPoint] = useState(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const completedCount = progress.completedMissions.length
  const finalUnlocked = completedCount === 9

  const getPointStatus = (id) => {
    if (id <= 9) {
      if (isMissionCompleted(id)) return 'done'
      if (id === 1 || isMissionCompleted(id - 1)) return 'available'
      return 'locked'
    }
    return finalUnlocked ? 'available' : 'locked'
  }

  const handlePointClick = (id) => {
    const status = getPointStatus(id)
    if (status === 'locked') return

    // Анимация клика
    setClickedPoint(id)

    // Через 400 мс — переход
    setTimeout(() => {
      if (id === 10) navigate('/final')
      else navigate(`/mission/${id}`)
    }, 400)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        background: 'var(--grad-bg)',
        padding: isMobile ? '14px 12px 24px' : 'clamp(12px, 1.5vh, 24px)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'center',
        overflow: isMobile ? 'auto' : 'hidden',
      }}
    >
      {/* Радужные полосы */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #A8D8EA, #A5E0B8, #FFEBA0, #FFCC91, #FFA8A8, #C8A8EB)', zIndex: 100 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #C8A8EB, #FFA8A8, #FFCC91, #FFEBA0, #A5E0B8, #A8D8EA)', zIndex: 100 }} />

      {/* Кнопка «На главную» */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: isMobile ? 14 : 22,
          left: isMobile ? 12 : 22,
          height: isMobile ? 44 : 52,
          padding: isMobile ? '0 16px' : '0 22px 0 18px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.95)',
          border: '2.5px solid var(--pastel-blue)',
          boxShadow: '0 6px 18px rgba(46, 58, 89, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: isMobile ? '0.9rem' : '1.05rem',
          fontWeight: 700,
          color: 'var(--text-dark)',
          fontFamily: 'inherit',
          zIndex: 200,
        }}
      >
        <span style={{ fontSize: isMobile ? '1.1rem' : '1.3rem' }}>🏠</span>
        <span>{isMobile ? '' : 'На главную'}</span>
      </button>

      {/* Прогресс */}
      <div
        style={{
          position: 'fixed',
          top: isMobile ? 14 : 22,
          right: isMobile ? 12 : 22,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.95)',
          padding: isMobile ? '8px 14px' : '10px 20px',
          borderRadius: 999,
          boxShadow: '0 6px 18px rgba(46, 58, 89, 0.15)',
          fontSize: isMobile ? '0.85rem' : 'clamp(0.9rem, 1.2vw, 1.05rem)',
          fontWeight: 700,
          zIndex: 200,
        }}
      >
        <span>🧩</span>
        <span style={{ color: 'var(--accent-blue)' }}>
          {completedCount} из 9
        </span>
      </div>

      {/* Заголовок */}
      <h1
        style={{
          fontSize: isMobile ? '1.5rem' : 'clamp(1.5rem, 2.6vw, 2.4rem)',
          background: 'linear-gradient(135deg, #4A90E2, #9B6BC9, #EE85B5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: isMobile ? '70px 0 12px' : '0 0 8px',
          textAlign: 'center',
          zIndex: 5,
          fontWeight: 900,
        }}
      >
        🗺 Остров Сокровищ
      </h1>

      {/* ============================================================ */}
      {/* МОБИЛЬНАЯ ВЕРСИЯ — СПИСОК ЛОКАЦИЙ                            */}
      {/* ============================================================ */}
      {isMobile && (
        <div
          style={{
            width: '100%',
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            paddingBottom: 24,
            zIndex: 5,
          }}
        >
          {points.map(point => {
            const status = getPointStatus(point.id)
            const isDone = status === 'done'
            const isAvailable = status === 'available'
            const isLocked = status === 'locked'

            return (
              <motion.button
                key={point.id}
                onClick={() => handlePointClick(point.id)}
                disabled={isLocked}
                whileTap={isAvailable ? { scale: 0.97 } : {}}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: point.id * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 18,
                  background: isDone
                    ? 'linear-gradient(135deg, #F0FBF5, #D5EFE0)'
                    : isAvailable
                    ? 'linear-gradient(135deg, #FFFFFF, #EAF4FC)'
                    : '#F0F2F7',
                  border: `3px solid ${isDone ? '#4CB86C' : isAvailable ? '#4A90E2' : '#D5DEEC'}`,
                  boxShadow: isAvailable
                    ? '0 8px 22px rgba(74, 144, 226, 0.25)'
                    : '0 4px 12px rgba(46, 58, 89, 0.08)',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  opacity: isLocked ? 0.6 : 1,
                  textAlign: 'left',
                  minHeight: 64,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: isDone
                      ? 'linear-gradient(135deg, #A5E0B8, #4CB86C)'
                      : isAvailable
                      ? 'white'
                      : 'linear-gradient(135deg, #E5E9F0, #C5CCDA)',
                    border: `2.5px solid ${isDone ? '#4CB86C' : isAvailable ? '#4A90E2' : '#9AA5B8'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                    boxShadow: isAvailable ? '0 0 0 4px rgba(74, 144, 226, 0.15)' : 'none',
                  }}
                >
                  <span style={{ filter: isLocked ? 'grayscale(1) opacity(0.6)' : 'none' }}>
                    {point.emoji}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)', lineHeight: 1.2, marginBottom: 2 }}>
                    {point.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 600 }}>
                    {point.label}
                  </div>
                </div>

                <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>
                  {isDone ? '✅' : isLocked ? '🔒' : '▶'}
                </div>
              </motion.button>
            )
          })}

          {finalUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}
            >
              <Button
                onClick={() => navigate('/final')}
                variant="primary"
                className="btn-xl"
                style={{
                  background: 'linear-gradient(135deg, #6B3FA0, #B03A5B)',
                  color: 'white',
                  fontSize: '1.1rem',
                  padding: '16px 32px',
                  width: '100%',
                  maxWidth: 340,
                }}
              >
                ⚔ К финалу!
              </Button>
            </motion.div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* КОМПЬЮТЕРНАЯ ВЕРСИЯ — КАРТА С ТОЧКАМИ                        */}
      {/* ============================================================ */}
      {!isMobile && (
        <>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 'min(1500px, calc((100vh - 150px) * 1.6))',
              aspectRatio: '16 / 10',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(46, 58, 89, 0.28)',
              border: '4px solid rgba(255, 255, 255, 0.95)',
              margin: '0 auto',
            }}
          >
            <img
              src="/images/island.png"
              alt="Карта острова"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={e => (e.target.style.display = 'none')}
            />

            {points.map(point => {
              const status = getPointStatus(point.id)
              return (
                <MapPoint
                  key={point.id}
                  point={point}
                  status={status}
                  onClick={() => handlePointClick(point.id)}
                  isClicked={clickedPoint === point.id}
                />
              )
            })}

            {/* Затемнение при клике */}
            <AnimatePresence>
              {clickedPoint !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(107, 63, 160, 0.35)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 50,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {finalUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 14, zIndex: 10 }}
            >
              <Button to="/final" variant="primary">
                ⚔ К финалу!
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

// ============================================
// Компонент точки на карте (для компьютера)
// ============================================
function MapPoint({ point, status, onClick, isClicked }) {
  const isDone = status === 'done'
  const isAvailable = status === 'available'
  const isLocked = status === 'locked'
  const size = 'clamp(38px, 4.5vw, 76px)'

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: point.id * 0.06, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={isAvailable ? { scale: 1.15 } : {}}
      whileTap={isAvailable ? { scale: 0.95 } : {}}
      style={{
        position: 'absolute',
        left: `${point.x}%`,
        top: `${point.y}%`,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        borderRadius: '50%',
        border: '4px solid',
        borderColor: isDone ? '#4CB86C' : isAvailable ? '#4A90E2' : '#9AA5B8',
        background: isDone
          ? 'linear-gradient(135deg, #A5E0B8, #4CB86C)'
          : isAvailable
          ? 'linear-gradient(135deg, #FFFFFF, #EAF4FC)'
          : 'linear-gradient(135deg, #E5E9F0, #C5CCDA)',
        boxShadow: isAvailable
          ? '0 0 0 6px rgba(74, 144, 226, 0.25), 0 8px 22px rgba(46, 58, 89, 0.25)'
          : '0 6px 16px rgba(46, 58, 89, 0.2)',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        zIndex: isAvailable ? 20 : 10,
        opacity: isLocked ? 0.85 : 1,
        fontFamily: 'inherit',
      }}
    >
      {isAvailable && (
        <motion.span
          animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            border: '3px solid #4A90E2',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Анимация при клике — расходящиеся круги */}
      {isClicked && (
        <>
          <motion.span
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '4px solid #F5C242',
              pointerEvents: 'none',
            }}
          />
          <motion.span
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '4px solid #4A90E2',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <span
        style={{
          fontSize: `calc(${size} * 0.45)`,
          lineHeight: 1,
          filter: isLocked ? 'grayscale(1) opacity(0.6)' : 'none',
        }}
      >
        {point.emoji}
      </span>

      <span
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          fontSize: `calc(${size} * 0.22)`,
          background: 'white',
          borderRadius: '50%',
          width: `calc(${size} * 0.32)`,
          height: `calc(${size} * 0.32)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          fontWeight: 800,
          color: isDone ? '#4CB86C' : isAvailable ? '#4A90E2' : '#7A8699',
        }}
      >
        {isDone ? '✓' : isLocked ? '🔒' : point.id}
      </span>
    </motion.button>
  )
}