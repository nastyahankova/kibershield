import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import { useSound } from '../context/SoundContext.jsx'

const messages = [
  {
    id: 1,
    from: '+375 (29) 123-45-67',
    fromLabel: 'Неизвестный номер',
    text: '🎉 Поздравляем! Вы выиграли 1000 рублей! Перейдите по ссылке prize-minsk.xyz и введите номер карты.',
    isSpam: true,
    reason: 'Незнакомый номер + обещание денег + просят данные карты — это мошенничество!',
  },
  {
    id: 2,
    from: 'Mama',
    fromLabel: 'Мама',
    text: 'Сынок, купи хлеб по дороге домой 🍞',
    isSpam: false,
    reason: 'Обычное сообщение от близкого человека — никаких ссылок и данных.',
  },
  {
    id: 3,
    from: 'SCHOOL1-GORKI',
    fromLabel: 'Школа №1 г. Горки',
    text: 'Завтра в 14:00 родительское собрание в кабинете 12. Явка обязательна.',
    isSpam: false,
    reason: 'Сообщение от школы с известным коротким номером. Никаких ссылок.',
  },
  {
    id: 4,
    from: '+375 (44) 987-65-43',
    fromLabel: 'Неизвестный номер',
    text: '⚠️ Ваша карта заблокирована! Срочно позвоните по номеру 8-800-XXX-XX-XX для разблокировки.',
    isSpam: true,
    reason: 'Банки не звонят по SMS с незнакомых номеров. Настоящий банк указывает свой официальный номер.',
  },
  {
    id: 5,
    from: 'BELARUSBANK',
    fromLabel: 'Беларусбанк',
    text: 'Списание 25.50 BYN. Баланс: 142.30 BYN. Подробнее в приложении.',
    isSpam: false,
    reason: 'Банк присылает уведомления с официального короткого номера. Никаких ссылок и паролей.',
  },
  {
    id: 6,
    from: '+375 (33) 555-11-22',
    fromLabel: 'Неизвестный номер',
    text: 'Проголосуй за мою племянницу в конкурсе! Перейди по ссылке vote-best.by и отправь SMS.',
    isSpam: true,
    reason: 'Классическая схема: «проголосуй за…» — за этим скрывается платная подписка или кража данных.',
  },
]

const ACCENT = '#F5A623'
const ACCENT_DARK = '#D48806'

export default function Mission02_Flood({ onSuccess }) {
  const [selected, setSelected] = useState([])
  const [checked, setChecked] = useState(false)
  const { playSuccess, playFail } = useSound()

  const resultRef = useRef(null)
  useEffect(() => {
    if (checked && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 250)
    }
  }, [checked])

  const toggleMessage = (id) => {
    if (checked) return
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleCheck = () => {
    if (selected.length === 0) return
    setChecked(true)
    const spamIds = messages.filter(m => m.isSpam).map(m => m.id)
    const correctlyFound = selected.filter(id => spamIds.includes(id)).length
    const wrongFound = selected.filter(id => !spamIds.includes(id)).length
    const isPerfect = correctlyFound === spamIds.length && wrongFound === 0
    if (isPerfect) {
      playSuccess()
    } else {
      playFail()
    }
  }

  const handleRetry = () => {
    setSelected([])
    setChecked(false)
  }

  const spamIds = messages.filter(m => m.isSpam).map(m => m.id)
  const correctlyFound = selected.filter(id => spamIds.includes(id)).length
  const wrongFound = selected.filter(id => !spamIds.includes(id)).length
  const isPerfect = correctlyFound === spamIds.length && wrongFound === 0

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
          boxShadow: `0 16px 40px rgba(245, 166, 35, 0.25)`,
          border: `3px solid ${ACCENT}`,
          maxWidth: '100%',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <h2
          style={{
            marginBottom: 8,
            fontSize: 'clamp(1.3rem, 5vw, 2rem)',
            color: ACCENT_DARK,
          }}
        >
          📱 Найди мошеннические SMS
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: 'clamp(0.9rem, 3.5vw, 1.2rem)', margin: 0, lineHeight: 1.4 }}>
          Среди этих сообщений спрятались <b>3 мошеннических</b>. Кликни на них!
        </p>
      </div>

      {/* Сетка SMS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 16,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {messages.map(msg => {
          const isSelected = selected.includes(msg.id)
          const isSpam = msg.isSpam

          let borderColor = 'transparent'
          let shadowColor = 'rgba(46,58,89,0.12)'
          let bgColor = 'white'

          if (checked) {
            if (isSpam && isSelected) {
              borderColor = '#4CB86C'; shadowColor = 'rgba(76,184,108,0.4)'; bgColor = '#F0FBF5'
            } else if (isSpam && !isSelected) {
              borderColor = '#E85C5C'; shadowColor = 'rgba(232,92,92,0.4)'; bgColor = '#FFF0F0'
            } else if (!isSpam && isSelected) {
              borderColor = '#E85C5C'; shadowColor = 'rgba(232,92,92,0.4)'; bgColor = '#FFF0F0'
            }
          } else if (isSelected) {
            borderColor = ACCENT; shadowColor = 'rgba(245,166,35,0.4)'; bgColor = '#FFF8E8'
          }

          return (
            <motion.div
              key={msg.id}
              onClick={() => toggleMessage(msg.id)}
              whileHover={!checked ? { y: -5, scale: 1.02 } : {}}
              whileTap={!checked ? { scale: 0.98 } : {}}
              style={{
                cursor: checked ? 'default' : 'pointer',
                border: `4px solid ${borderColor}`,
                borderRadius: 20,
                background: bgColor,
                boxShadow: `0 12px 28px ${shadowColor}`,
                overflow: 'hidden',
                transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  padding: 'clamp(10px, 2.5vw, 16px) clamp(12px, 3vw, 18px)',
                  background: isSelected && !checked ? '#FFF3D6' : '#F5F7FB',
                  borderBottom: '3px solid #EEF1F7',
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
                    {msg.fromLabel}
                  </span>
                  <span
                    style={{
                      fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
                      color: 'var(--text-soft)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {msg.from}
                  </span>
                </div>
                <AnimatePresence>
                  {isSelected && !checked && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{
                        background: ACCENT, color: 'white', borderRadius: '50%',
                        width: 28, height: 28, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 800, fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div
                style={{
                  padding: 'clamp(12px, 3vw, 18px)',
                  fontSize: 'clamp(0.9rem, 3.5vw, 1.08rem)',
                  color: 'var(--text-dark)',
                  lineHeight: 1.5,
                  flex: 1,
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </div>

              {checked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    padding: 'clamp(10px, 2.5vw, 16px) clamp(12px, 3vw, 18px)',
                    background: isSpam ? '#F0FBF5' : '#F5F7FB',
                    borderTop: `3px solid ${isSpam ? '#4CB86C' : '#B8C5D6'}`,
                    fontSize: 'clamp(0.8rem, 3vw, 0.95rem)',
                    color: 'var(--text-soft)',
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                  }}
                >
                  <b style={{ color: isSpam ? '#2A8B4E' : '#5A6885' }}>
                    {isSpam ? '⚠ Мошенничество: ' : '✓ Настоящее: '}
                  </b>
                  {msg.reason}
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        {!checked && (
          <Button
            onClick={handleCheck}
            variant="primary"
            className="btn-xl"
            disabled={selected.length === 0}
            style={{ background: ACCENT, color: 'white' }}
          >
            🔍 Проверить выбор ({selected.length})
          </Button>
        )}
        {checked && !isPerfect && (
          <Button
            onClick={handleRetry}
            variant="primary"
            className="btn-xl"
            style={{ background: ACCENT, color: 'white' }}
          >
            🔄 Попробовать снова
          </Button>
        )}
      </div>

      {/* Результат — автоскролл */}
      <div
        ref={resultRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          boxSizing: 'border-box',
        }}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                maxWidth: '100%',
                width: '100%',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderLeft: `10px solid ${isPerfect ? '#4CB86C' : '#E85C5C'}`,
                borderRadius: 24,
                padding: 'clamp(18px, 3.5vh, 32px)',
                boxShadow: `0 20px 50px ${isPerfect ? 'rgba(76,184,108,0.25)' : 'rgba(232,92,92,0.25)'}`,
                boxSizing: 'border-box',
              }}
            >
              <h3
                style={{
                  color: isPerfect ? '#2A8B4E' : '#C33C3C',
                  marginBottom: 10,
                  textAlign: 'center',
                  fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                }}
              >
                {isPerfect ? '✅ Отлично! Все мошенники найдены' : '❌ Есть ошибки'}
              </h3>
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-soft)',
                  marginBottom: 20,
                  fontSize: 'clamp(0.95rem, 3.5vw, 1.15rem)',
                }}
              >
                Ты нашёл {correctlyFound} из {spamIds.length} мошеннических SMS
                {wrongFound > 0 && `, и ${wrongFound} ошибок`}.
              </p>

              {isPerfect && (
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
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}