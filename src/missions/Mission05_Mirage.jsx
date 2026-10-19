import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import { useSound } from '../context/SoundContext.jsx'

const news = [
  {
    id: 'real1',
    emoji: '🏗',
    source: 'edu.by',
    sourceLabel: 'Мин. образования',
    title: 'В Минске открыли новый детский технопарк',
    text: 'В Минске торжественно открыли детский технопарк. Здесь школьники смогут изучать робототехнику, программирование и 3D-моделирование. Занятия бесплатные — запись открыта на сайте edu.by.',
    isFake: false,
    reason: 'Официальный источник (edu.by), конкретные факты, реальное событие.',
  },
  {
    id: 'fake',
    emoji: '📡',
    source: 'health-sensation.info',
    sourceLabel: 'Health Sensation',
    title: '🚨 Учёные доказали: Wi-Fi опасен для школьников!',
    text: 'СЕНСАЦИЯ! Исследование показало, что школьный Wi-Fi влияет на мозг детей. Врачи советуют срочно отключать роутеры! Читайте на health-sensation.info.',
    isFake: true,
    reason: 'Громкий заголовок, ненадёжный источник, нет конкретики — какие учёные? какое исследование?',
  },
  {
    id: 'real2',
    emoji: '🏆',
    source: 'brpo.by',
    sourceLabel: 'ОО "БРПО"',
    title: 'Белорусские школьники победили на олимпиаде по информатике',
    text: 'На международной олимпиаде по информатике сборная Беларуси завоевала золотые медали. Поздравляем ребят и их наставников! Подробности — на сайте brpo.by.',
    isFake: false,
    reason: 'Проверенный источник (brpo.by), конкретное событие, факты совпадают с официальными новостями.',
  },
]

const reasons = [
  {
    id: 'source',
    label: '🌐 Ненадёжный сайт',
    isCorrect: true,
    text: 'health-sensation.info — незнакомый сайт. Настоящие новости приходят с известных источников (edu.by, brpo.by).',
  },
  {
    id: 'loud',
    label: '📣 Слишком громкий заголовок',
    isCorrect: true,
    text: 'Слова «СЕНСАЦИЯ», «СРОЧНО» и восклицательные знаки — типичные признаки фейка. Настоящие новости спокойнее.',
  },
  {
    id: 'vague',
    label: '❓ Нет конкретики',
    isCorrect: true,
    text: '«Учёные доказали» — а какие учёные? Где исследование? Без конкретики новость нельзя проверить.',
  },
  {
    id: 'true',
    label: '✅ Всё в порядке — это правда',
    isCorrect: false,
    text: 'Нет, это фейк. Присмотрись ещё раз к источнику и заголовку.',
  },
]

const ACCENT = '#4A90E2'
const DANGER = '#E85C5C'

export default function Mission05_Mirage({ onSuccess }) {
  const [selectedNews, setSelectedNews] = useState(null)
  const [checkedNews, setCheckedNews] = useState(false)

  const [selectedReasons, setSelectedReasons] = useState([])
  const [checkedReason, setCheckedReason] = useState(false)

  const { playSuccess, playFail } = useSound()

  // Автоскролл к результату (первый этап — выбор новости)
  const resultRef = useRef(null)
  useEffect(() => {
    if (checkedNews && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 250)
    }
  }, [checkedNews])

  // Автоскролл к разбору признаков
  const reasonsRef = useRef(null)
  useEffect(() => {
    if (checkedReason && reasonsRef.current) {
      setTimeout(() => {
        reasonsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 250)
    }
  }, [checkedReason])

  const handleNewsClick = (n) => {
    if (checkedNews) return
    setSelectedNews(n.id)
  }

  const handleCheckNews = () => {
    if (!selectedNews) return
    setCheckedNews(true)
    const isCorrect = news.find(n => n.id === selectedNews)?.isFake === true
    if (isCorrect) {
      playSuccess()
    } else {
      playFail()
    }
  }

  const isNewsCorrect =
    checkedNews && news.find(n => n.id === selectedNews)?.isFake === true

  const toggleReason = (r) => {
    if (checkedReason) return
    setSelectedReasons(prev =>
      prev.includes(r.id) ? prev.filter(x => x !== r.id) : [...prev, r.id]
    )
  }

  const handleCheckReason = () => {
    if (selectedReasons.length === 0) return
    setCheckedReason(true)
    const correctReasons = reasons.filter(r => r.isCorrect).map(r => r.id)
    const correctlyFound = selectedReasons.filter(id => correctReasons.includes(id)).length
    const wrongFound = selectedReasons.filter(id => !correctReasons.includes(id)).length
    const isPerfect = correctlyFound === correctReasons.length && wrongFound === 0
    if (isPerfect) {
      playSuccess()
    } else {
      playFail()
    }
  }

  const correctReasons = reasons.filter(r => r.isCorrect).map(r => r.id)
  const reasonsCorrectlyFound = selectedReasons.filter(id => correctReasons.includes(id)).length
  const reasonsWrongFound = selectedReasons.filter(id => !correctReasons.includes(id)).length
  const isReasonPerfect =
    reasonsCorrectlyFound === correctReasons.length && reasonsWrongFound === 0

  const handleRetryNews = () => {
    setSelectedNews(null)
    setCheckedNews(false)
  }

  const handleRetryReason = () => {
    setSelectedReasons([])
    setCheckedReason(false)
  }

  const handleContinue = () => onSuccess()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        padding: '0 4px',
        boxSizing: 'border-box',
      }}
    >
      {/* Заголовок */}
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: 24,
          padding: 'clamp(16px, 2.5vh, 28px) clamp(20px, 4vw, 48px)',
          boxShadow: `0 16px 40px ${ACCENT}35`,
          border: `3px solid ${ACCENT}`,
          maxWidth: '100%',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ marginBottom: 8, fontSize: 'clamp(1.3rem, 5vw, 2rem)', color: '#2A6CC0' }}>
          📰 Найди фейк
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: 'clamp(0.9rem, 3.5vw, 1.2rem)', margin: 0, lineHeight: 1.4 }}>
          Среди трёх новостей — <b>одна фейковая</b>. Найди её!
        </p>
      </div>

      {/* Сетка новостей */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 16,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {news.map(n => {
          const isSelected = selectedNews === n.id
          const isFake = n.isFake

          let borderColor = 'transparent'
          let shadowColor = 'rgba(46,58,89,0.12)'
          let bg = 'white'

          if (checkedNews) {
            if (isFake && isSelected) { borderColor = '#4CB86C'; shadowColor = 'rgba(76,184,108,0.4)'; bg = '#F5FBF7' }
            else if (isFake && !isSelected) { borderColor = DANGER; shadowColor = 'rgba(232,92,92,0.3)'; bg = '#FFF5F5' }
            else if (!isFake && isSelected) { borderColor = DANGER; shadowColor = 'rgba(232,92,92,0.4)'; bg = '#FFF5F5' }
            else { borderColor = '#D5E5F5'; shadowColor = 'rgba(74,144,226,0.15)'; bg = '#F5FAFF' }
          } else if (isSelected) {
            borderColor = ACCENT; shadowColor = 'rgba(74,144,226,0.4)'; bg = '#F0F7FF'
          }

          return (
            <motion.button
              key={n.id}
              onClick={() => handleNewsClick(n)}
              whileHover={!checkedNews ? { y: -5, scale: 1.02 } : {}}
              whileTap={!checkedNews ? { scale: 0.98 } : {}}
              disabled={checkedNews}
              style={{
                cursor: checkedNews ? 'default' : 'pointer',
                border: `5px solid ${borderColor}`,
                borderRadius: 22,
                background: bg,
                boxShadow: `0 12px 32px ${shadowColor}`,
                padding: 0,
                overflow: 'hidden',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                fontFamily: 'inherit',
                position: 'relative',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  padding: 'clamp(10px, 2.5vw, 16px) clamp(12px, 3vw, 18px)',
                  background: 'linear-gradient(135deg, #F0F7FF, #E2EEFB)',
                  borderBottom: '3px solid #D5E5F5',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                      color: 'var(--text-dark)',
                      wordBreak: 'break-word',
                    }}
                  >
                    {n.sourceLabel}
                  </span>
                  <span
                    style={{
                      fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
                      color: 'var(--text-soft)',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}
                  >
                    {n.source}
                  </span>
                </div>
                <span style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', flexShrink: 0 }}>{n.emoji}</span>
              </div>

              <div
                style={{
                  padding: 'clamp(12px, 3vw, 22px) clamp(12px, 3vw, 22px) 8px',
                  fontWeight: 800,
                  fontSize: 'clamp(1rem, 4vw, 1.35rem)',
                  color: 'var(--text-dark)',
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                }}
              >
                {n.title}
              </div>

              <div
                style={{
                  padding: '0 clamp(12px, 3vw, 22px) clamp(14px, 3vw, 20px)',
                  fontSize: 'clamp(0.9rem, 3.5vw, 1.05rem)',
                  color: 'var(--text-soft)',
                  lineHeight: 1.5,
                  flex: 1,
                  wordBreak: 'break-word',
                }}
              >
                {n.text}
              </div>

              {checkedNews && isFake && (
                <motion.div
                  initial={{ opacity: 0, rotate: -25, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: -12, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  style={{
                    position: 'absolute',
                    top: '45%',
                    right: '-30px',
                    background: DANGER,
                    color: 'white',
                    padding: '8px 30px',
                    fontWeight: 900,
                    fontSize: 'clamp(0.9rem, 3vw, 1.3rem)',
                    letterSpacing: '0.1em',
                    boxShadow: '0 8px 24px rgba(232,92,92,0.55)',
                    pointerEvents: 'none',
                  }}
                >
                  ФЕЙК
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Кнопка «Проверить новость» */}
      {!checkedNews && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <Button
            onClick={handleCheckNews}
            variant="primary"
            className="btn-xl"
            disabled={!selectedNews}
            style={{ background: ACCENT, color: 'white' }}
          >
            🔍 Проверить новость
          </Button>
        </div>
      )}

      {/* Ошибка при выборе новости */}
      <AnimatePresence>
        {checkedNews && !isNewsCorrect && (
          <div ref={resultRef} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                maxWidth: '100%',
                width: '100%',
                background: 'white',
                borderLeft: `10px solid ${DANGER}`,
                borderRadius: 20,
                padding: 'clamp(16px, 3vh, 26px)',
                boxShadow: '0 12px 32px rgba(232,92,92,0.25)',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              <h3 style={{ color: DANGER, marginBottom: 10, fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}>
                ❌ Это настоящая новость
              </h3>
              <p style={{ fontSize: 'clamp(0.95rem, 3.5vw, 1.15rem)', marginBottom: 18, wordBreak: 'break-word' }}>
                Присмотрись к новости про Wi-Fi — у неё подозрительный источник и слишком громкий заголовок.
              </p>
              <Button
                onClick={handleRetryNews}
                variant="primary"
                className="btn-xl"
                style={{ background: ACCENT, color: 'white' }}
              >
                🔄 Попробовать снова
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Правильный выбор — признаки */}
      <AnimatePresence>
        {checkedNews && isNewsCorrect && (
          <div ref={reasonsRef} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                maxWidth: '100%',
                width: '100%',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderLeft: `10px solid #4CB86C`,
                borderRadius: 24,
                padding: 'clamp(18px, 3.5vh, 32px)',
                boxShadow: '0 20px 50px rgba(76,184,108,0.25)',
                boxSizing: 'border-box',
              }}
            >
              <h3
                style={{
                  color: '#2A8B4E',
                  marginBottom: 10,
                  textAlign: 'center',
                  fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                }}
              >
                ✅ Молодец, ты нашёл фейк!
              </h3>
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-soft)',
                  marginBottom: 22,
                  fontSize: 'clamp(0.9rem, 3.5vw, 1.15rem)',
                }}
              >
                А теперь объясни: <b>какие признаки выдают фейк?</b>
                <br />
                <span style={{ fontSize: '0.9em' }}>Выбери все подходящие варианты.</span>
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                  gap: 14,
                  marginBottom: 22,
                  boxSizing: 'border-box',
                }}
              >
                {reasons.map(r => {
                  const isSel = selectedReasons.includes(r.id)
                  const isCorrect = r.isCorrect

                  let bc = 'transparent'
                  let bg = 'white'
                  let sh = 'rgba(46,58,89,0.1)'

                  if (checkedReason) {
                    if (isCorrect && isSel) {
                      bc = '#4CB86C'; bg = '#F0FBF5'; sh = 'rgba(76,184,108,0.35)'
                    } else if (isCorrect && !isSel) {
                      bc = '#4CB86C'; bg = '#F0FBF5'; sh = 'rgba(76,184,108,0.25)'
                    } else if (!isCorrect && isSel) {
                      bc = DANGER; bg = '#FFF5F5'; sh = 'rgba(232,92,92,0.35)'
                    }
                  } else if (isSel) {
                    bc = ACCENT; bg = '#F0F7FF'; sh = 'rgba(74,144,226,0.4)'
                  }

                  return (
                    <motion.button
                      key={r.id}
                      onClick={() => toggleReason(r)}
                      whileHover={!checkedReason ? { y: -4, scale: 1.02 } : {}}
                      whileTap={!checkedReason ? { scale: 0.98 } : {}}
                      disabled={checkedReason}
                      style={{
                        cursor: checkedReason ? 'default' : 'pointer',
                        border: `4px solid ${bc}`,
                        borderRadius: 18,
                        background: bg,
                        boxShadow: `0 8px 22px ${sh}`,
                        padding: 'clamp(12px, 2.5vh, 20px)',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        position: 'relative',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      {isSel && !checkedReason && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            background: ACCENT,
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </div>
                      )}

                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 'clamp(0.95rem, 3.5vw, 1.15rem)',
                          color: 'var(--text-dark)',
                          paddingRight: 32,
                          wordBreak: 'break-word',
                        }}
                      >
                        {r.label}
                      </div>
                      {checkedReason && (
                        <div
                          style={{
                            fontSize: 'clamp(0.8rem, 3vw, 0.95rem)',
                            color: isCorrect ? '#2A8B4E' : '#C33C3C',
                            lineHeight: 1.5,
                            wordBreak: 'break-word',
                          }}
                        >
                          <b>{isCorrect ? '✅ Верно: ' : '❌ Неверно: '}</b>
                          {r.text}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {checkedReason && (
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: 'clamp(0.9rem, 3.5vw, 1.15rem)',
                    marginBottom: 16,
                    color: isReasonPerfect ? '#2A8B4E' : '#C33C3C',
                    fontWeight: 700,
                  }}
                >
                  {isReasonPerfect
                    ? `🎉 Отлично! Ты нашёл все ${correctReasons.length} признака.`
                    : `Ты нашёл ${reasonsCorrectlyFound} из ${correctReasons.length} признаков${reasonsWrongFound > 0 ? ` и ${reasonsWrongFound} ошибок` : ''}.`}
                </div>
              )}

              {!checkedReason && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={handleCheckReason}
                    variant="primary"
                    className="btn-xl"
                    disabled={selectedReasons.length === 0}
                    style={{ background: ACCENT, color: 'white' }}
                  >
                    🔍 Проверить ответ ({selectedReasons.length})
                  </Button>
                </div>
              )}
              {checkedReason && !isReasonPerfect && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={handleRetryReason}
                    variant="primary"
                    className="btn-xl"
                    style={{ background: ACCENT, color: 'white' }}
                  >
                    🔄 Попробовать снова
                  </Button>
                </div>
              )}
              {checkedReason && isReasonPerfect && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={handleContinue}
                    variant="primary"
                    className="btn-xl"
                    style={{ background: ACCENT, color: 'white' }}
                  >
                    Продолжить →
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}