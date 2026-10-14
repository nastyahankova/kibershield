import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import ScrollTo from '../components/ScrollTo.jsx'
import { useSound } from '../context/SoundContext.jsx'

// Сетка 3×3. Индексы:
//  1 2 3
//  4 5 6
//  7 8 9
//
// Правильный маршрут: 1 → 2 → 5 → 8 → 9
const grid = [
  { id: 1, name: 'school1-gorki.by',     label: 'Сайт школы',          emoji: '🏫', safe: true,  reason: 'Официальный сайт школы — безопасный.' },
  { id: 2, name: 'brpo.by',              label: 'БРПО',                emoji: '🔥', safe: true,  reason: 'Официальный сайт БРПО — безопасный.' },
  { id: 3, name: 'free-money.xyz',       label: 'Бесплатные деньги',   emoji: '💰', safe: false, reason: 'Незнакомый сайт с обещанием денег — мошенничество!' },

  { id: 4, name: 'kazino-24.top',        label: 'Казино 24',           emoji: '🎰', safe: false, reason: 'Игровые сайты для детей запрещены и опасны.' },
  { id: 5, name: 'edu.by',               label: 'Мин. образования',    emoji: '🎓', safe: true,  reason: 'Официальный образовательный портал.' },
  { id: 6, name: 'virus-download.ru',    label: 'Скачать файл',        emoji: '⚠️', safe: false, reason: 'Файлы с незнакомых сайтов могут содержать вирусы.' },

  { id: 7, name: 'prize-win-iphone.xyz', label: 'Выиграл iPhone',      emoji: '📱', safe: false, reason: 'Подозрительный адрес .xyz + обещание приза = мошенничество.' },
  { id: 8, name: 'wiki-pedia.by',        label: 'Энциклопедия',        emoji: '📚', safe: true,  reason: 'Известная онлайн-энциклопедия — безопасно.' },
  { id: 9, name: 'school-library.by',    label: 'Школьная библиотека', emoji: '📖', safe: true,  reason: 'Библиотека школы — проверенный сайт.' },
]

// Соседи по сетке 3×3
const neighbors = {
  1: [2, 4],
  2: [1, 3, 5],
  3: [2, 6],
  4: [1, 5, 7],
  5: [2, 4, 6, 8],
  6: [3, 5, 9],
  7: [4, 8],
  8: [5, 7, 9],
  9: [6, 8],
}

const ACCENT = '#4CB86C'
const DANGER = '#E85C5C'
const START_ID = 1
const GOAL_ID = 9
const MAX_MISTAKES = 3

export default function Mission04_Worm({ onSuccess }) {
  const [path, setPath] = useState([START_ID])
  const [mistakes, setMistakes] = useState([])
  const [message, setMessage] = useState(null)
  const [finished, setFinished] = useState(null)
  const { playSuccess, playFail } = useSound()

  const currentId = path[path.length - 1]
  const attemptsLeft = MAX_MISTAKES - mistakes.length

  const handleClick = (site) => {
    if (finished) return
    if (path.includes(site.id) && site.id !== START_ID) {
      setMessage({ type: 'info', text: 'Ты уже был на этом сайте.' })
      return
    }
    if (mistakes.includes(site.id)) return

    const currentNeighbors = neighbors[currentId] || []
    if (!currentNeighbors.includes(site.id)) {
      setMessage({
        type: 'info',
        text: 'Сюда нельзя — двигайся только по соседним сайтам (вверх/вниз/влево/вправо).',
      })
      return
    }

    if (site.safe) {
      const newPath = [...path, site.id]
      setPath(newPath)
      setMessage({ type: 'safe', text: `✅ ${site.label} — ${site.reason}` })

      if (site.id === GOAL_ID) {
        setFinished('win')
        playSuccess()
        setTimeout(() => {
          setMessage({ type: 'win', text: '🎉 Победа! Ты добрался до безопасного финиша!' })
        }, 500)
      }
    } else {
      const newMistakes = [...mistakes, site.id]
      setMistakes(newMistakes)
      playFail()
      setMessage({ type: 'danger', text: `⚠️ ${site.label} — ${site.reason}` })

      if (newMistakes.length >= MAX_MISTAKES) {
        setFinished('fail')
        setTimeout(() => {
          setMessage({ type: 'fail', text: '❌ Ты попался на 3 опасных сайта. Попробуй снова!' })
        }, 500)
      }
    }
  }

  const handleRetry = () => {
    setPath([START_ID])
    setMistakes([])
    setMessage(null)
    setFinished(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', width: '100%' }}>
      {/* Заголовок */}
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: 20,
          padding: 'clamp(12px, 2vh, 24px) clamp(16px, 3vw, 40px)',
          boxShadow: `0 16px 40px ${ACCENT}35`,
          border: `3px solid ${ACCENT}`,
          maxWidth: '100%',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ marginBottom: 8, fontSize: 'clamp(1.2rem, 4.5vw, 1.8rem)', color: '#2A8B4E' }}>
          🐛 Безопасный путь
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: 'clamp(0.9rem, 3.2vw, 1.1rem)', margin: 0 }}>
          Дойди от <b>«Сайта школы»</b> (Старт) до <b>«Школьной библиотеки»</b> (Финиш).
          Двигайся только по <b>соседним</b> сайтам и не попадись на опасные!
        </p>
      </div>

      {/* Статус — компактные плашки */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 8px',
        }}
      >
        <StatusPill color={ACCENT} icon="🟢" label={`Пройдено: ${path.length - 1}`} />
        <StatusPill color={DANGER} icon="🔴" label={`Ошибок: ${mistakes.length} / ${MAX_MISTAKES}`} />
        <StatusPill color="#4A90E2" icon="❤️" label={`Попыток: ${attemptsLeft}`} />
      </div>

      {/* Сообщение */}
      <AnimatePresence mode="wait">
        {message && (
          <ScrollTo trigger={message}>
            <motion.div
              key={message.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                maxWidth: '100%',
                width: '100%',
                background: 'white',
                borderLeft: `8px solid ${
                  message.type === 'safe' || message.type === 'win'
                    ? ACCENT
                    : message.type === 'danger' || message.type === 'fail'
                    ? DANGER
                    : '#4A90E2'
                }`,
                borderRadius: 16,
                padding: '12px 18px',
                boxShadow: `0 12px 32px ${
                  message.type === 'danger' || message.type === 'fail'
                    ? 'rgba(232,92,92,0.25)'
                    : message.type === 'info'
                    ? 'rgba(74,144,226,0.2)'
                    : 'rgba(76,184,108,0.25)'
                }`,
                fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
                fontWeight: 600,
                color: 'var(--text-dark)',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              {message.text}
            </motion.div>
          </ScrollTo>
        )}
      </AnimatePresence>

      {/* Сетка 3×3 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(6px, 1.5vw, 16px)',
          width: '100%',
          maxWidth: '100%',
          padding: '0 4px',
          boxSizing: 'border-box',
        }}
      >
        {grid.map(site => {
          const isVisited = path.includes(site.id)
          const isCurrent = currentId === site.id
          const isMistake = mistakes.includes(site.id)
          const isGoal = site.id === GOAL_ID
          const isStart = site.id === START_ID
          const isNeighbor = (neighbors[currentId] || []).includes(site.id)
          const isClickable = !finished && isNeighbor && !isVisited && !isMistake

          let bg = 'white'
          let borderColor = '#D5DEEC'
          let shadowColor = 'rgba(46,58,89,0.08)'
          let opacity = 1
          let scale = 1

          if (isCurrent) {
            bg = 'linear-gradient(135deg, #E4F7EC, #B5E6C3)'
            borderColor = ACCENT
            shadowColor = 'rgba(76,184,108,0.5)'
            scale = 1.03
          } else if (isVisited) {
            bg = 'linear-gradient(135deg, #F0FBF5, #D5EFE0)'
            borderColor = ACCENT
            shadowColor = 'rgba(76,184,108,0.3)'
          } else if (isMistake) {
            bg = 'linear-gradient(135deg, #FFE5E5, #FFC5C5)'
            borderColor = DANGER
            shadowColor = 'rgba(232,92,92,0.3)'
            opacity = 0.55
          } else if (isNeighbor && !finished) {
            borderColor = '#4A90E2'
            shadowColor = 'rgba(74,144,226,0.35)'
            bg = '#F5FAFF'
          } else if (finished || !isNeighbor) {
            opacity = 0.55
          }

          return (
            <motion.button
              key={site.id}
              onClick={() => handleClick(site)}
              whileHover={isClickable ? { y: -4, scale: 1.03 } : {}}
              whileTap={isClickable ? { scale: 0.97 } : {}}
              disabled={!isClickable}
              animate={{ scale }}
              style={{
                cursor: isClickable ? 'pointer' : 'default',
                border: `3px solid ${borderColor}`,
                borderRadius: 14,
                background: bg,
                boxShadow: `0 6px 16px ${shadowColor}`,
                padding: 'clamp(6px, 1.5vw, 16px) clamp(4px, 1vw, 12px)',
                textAlign: 'center',
                fontFamily: 'inherit',
                opacity,
                transition: 'all 0.25s',
                position: 'relative',
                minHeight: 'clamp(90px, 14vh, 150px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              {isStart && (
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    background: ACCENT,
                    color: 'white',
                    fontSize: 'clamp(0.5rem, 1.8vw, 0.7rem)',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 6,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    zIndex: 2,
                  }}
                >
                  СТАРТ
                </div>
              )}
              {isGoal && (
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: '#F5A623',
                    color: 'white',
                    fontSize: 'clamp(0.5rem, 1.8vw, 0.7rem)',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 6,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    zIndex: 2,
                  }}
                >
                  ФИНИШ
                </div>
              )}

              <span style={{ fontSize: 'clamp(1.5rem, 6vw, 2.6rem)', lineHeight: 1 }}>
                {site.emoji}
              </span>
              <span
                style={{
                  fontSize: 'clamp(0.6rem, 2.2vw, 0.9rem)',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  lineHeight: 1.15,
                }}
              >
                {site.label}
              </span>
              <span
                style={{
                  fontSize: 'clamp(0.5rem, 1.8vw, 0.75rem)',
                  color: 'var(--text-soft)',
                  fontFamily: 'monospace',
                  lineHeight: 1.1,
                  wordBreak: 'break-all',
                }}
              >
                {site.name}
              </span>

              {isCurrent && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12, left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                  }}
                >
                  🧒
                </div>
              )}

              {isVisited && !isCurrent && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -8, right: -8,
                    background: ACCENT, color: 'white',
                    borderRadius: '50%',
                    width: 'clamp(20px, 5vw, 28px)',
                    height: 'clamp(20px, 5vw, 28px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'clamp(0.7rem, 2vw, 1rem)', fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(76,184,108,0.5)',
                  }}
                >
                  ✓
                </div>
              )}
              {isMistake && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -8, right: -8,
                    background: DANGER, color: 'white',
                    borderRadius: '50%',
                    width: 'clamp(20px, 5vw, 28px)',
                    height: 'clamp(20px, 5vw, 28px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'clamp(0.7rem, 2vw, 1rem)', fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(232,92,92,0.5)',
                  }}
                >
                  ✗
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Кнопки управления */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        {finished === 'fail' && (
          <Button
            onClick={handleRetry}
            variant="primary"
            className="btn-xl"
            style={{ background: ACCENT, color: 'white', fontSize: '1.15rem', padding: '14px 32px' }}
          >
            🔄 Попробовать снова
          </Button>
        )}
        {finished === 'win' && (
          <Button
            onClick={onSuccess}
            variant="primary"
            className="btn-xl"
            style={{ background: ACCENT, color: 'white', fontSize: '1.15rem', padding: '14px 32px' }}
          >
            Продолжить →
          </Button>
        )}
      </div>
    </div>
  )
}

function StatusPill({ color, icon, label }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.95)',
        border: `2px solid ${color}`,
        borderRadius: 999,
        padding: '5px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 'clamp(0.72rem, 2.5vw, 0.95rem)',
        fontWeight: 700,
        color: 'var(--text-dark)',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}