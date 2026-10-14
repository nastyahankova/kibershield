import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import { useSound } from '../context/SoundContext.jsx'

const fields = [
  { id: 'name',     emoji: '😀', label: 'Имя и фамилия',  hint: 'Иван Петров',                 correctPublic: true,  reason: 'Имя — нормально. Но если рядом лежат адрес или телефон — это уже опасно.' },
  { id: 'phone',    emoji: '📞', label: 'Номер телефона', hint: '+375 (29) 123-45-67',          correctPublic: false, reason: 'Телефон нельзя показывать всем — им могут воспользоваться мошенники.' },
  { id: 'address',  emoji: '🏠', label: 'Домашний адрес', hint: 'г. Горки, ул. Школьная, 5',    correctPublic: false, reason: 'Адрес дома — личное! Никогда не публикуй его в открытом профиле.' },
  { id: 'books',    emoji: '📚', label: 'Любимые книги',  hint: '«Гарри Поттер», «Хоббит»',       correctPublic: true,  reason: 'Список книг — безопасная информация, ею можно делиться.' },
  { id: 'birthday', emoji: '🎂', label: 'Дата рождения',  hint: '15.03.2012',                    correctPublic: false, reason: 'Дата рождения помогает подбирать пароли и угадывать ответы на секретные вопросы.' },
  { id: 'hobby',    emoji: '⚽', label: 'Хобби',          hint: 'Футбол, робототехника',          correctPublic: true,  reason: 'Хобби — безопасно. По нему можно найти друзей.' },
  { id: 'location', emoji: '📍', label: 'Геолокация',     hint: 'Показать текущее местоположение', correctPublic: false, reason: 'Геолокация в реальном времени — очень опасно. По ней легко вычислить, где ты.' },
  { id: 'pet',      emoji: '🐱', label: 'Фото питомца',   hint: 'Мурзик 🐾',                      correctPublic: true,  reason: 'Фото питомца безопасно, если там нет геометки (места съёмки).' },
]

const ACCENT = '#D4A02C'
const DANGER = '#E85C5C'
const SAFE = '#4CB86C'

export default function Mission07_Watcher({ onSuccess }) {
  const [settings, setSettings] = useState(
    Object.fromEntries(fields.map(f => [f.id, true]))
  )
  const [checked, setChecked] = useState(false)
  const { playSuccess, playFail } = useSound()
  const resultRef = useRef(null)

  const toggle = (id) => {
    if (checked) return
    setSettings(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleCheck = () => {
    setChecked(true)
    const correctCount = fields.filter(f => settings[f.id] === f.correctPublic).length
    const isPerfect = correctCount === fields.length
    if (isPerfect) {
      playSuccess()
    } else {
      playFail()
    }
    // Автоскролл к итогу
    setTimeout(() => {
      if (resultRef.current) {
        const rect = resultRef.current.getBoundingClientRect()
        const y = rect.top + window.scrollY - 80
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 150)
  }

  const handleRetry = () => setChecked(false)
  const handleContinue = () => onSuccess()

  const correctCount = fields.filter(f => settings[f.id] === f.correctPublic).length
  const totalCount = fields.length
  const isPerfect = correctCount === totalCount

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      {/* Заголовок */}
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: 24,
          padding: 'clamp(16px, 2.5vh, 28px) clamp(24px, 4vw, 48px)',
          boxShadow: `0 16px 40px ${ACCENT}40`,
          border: `3px solid ${ACCENT}`,
          maxWidth: 1000,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: 8, fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', color: '#9A6F00' }}>
          👁️ Настрой приватность
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', margin: 0 }}>
          Соглядатай следит за твоим профилем. <b>Спрячь всё личное</b> и оставь только безопасное!
        </p>
      </div>

      {/* Профиль */}
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: 24,
          padding: 'clamp(18px, 3vh, 28px)',
          boxShadow: `0 16px 40px ${ACCENT}30`,
          border: `2px solid #E8D5A0`,
          maxWidth: 950,
          width: '100%',
        }}
      >
        {/* Шапка профиля */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: `3px solid #F5E6C0`,
          }}
        >
          <div
            style={{
              width: 70, height: 70, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFE082, #F5C242)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.4rem',
            }}
          >
            🧒
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 'clamp(1.1rem, 1.6vw, 1.3rem)' }}>
              Иван Петров
            </div>
            <div style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>
              Профиль в соцсети · Приватность: настрой сам
            </div>
          </div>
        </div>

        {/* Пункты */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fields.map(field => {
            const isPublic = settings[field.id]
            const isCorrect = isPublic === field.correctPublic

            let bc = '#E8D5A0'
            let bg = 'white'
            let sh = 'rgba(46,58,89,0.08)'

            if (checked) {
              if (isCorrect) { bc = SAFE; bg = '#F0FBF5'; sh = 'rgba(76,184,108,0.3)' }
              else { bc = DANGER; bg = '#FFF5F5'; sh = 'rgba(232,92,92,0.3)' }
            } else if (isPublic) {
              bc = ACCENT; bg = '#FFFAEB'
            }

            return (
              <div
                key={field.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  border: `3px solid ${bc}`,
                  borderRadius: 18,
                  background: bg,
                  boxShadow: `0 6px 20px ${sh}`,
                  padding: '14px 18px',
                  transition: 'all 0.25s',
                }}
              >
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: '#F5F7FB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', flexShrink: 0,
                  }}
                >
                  {field.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                      color: 'var(--text-dark)',
                    }}
                  >
                    {field.label}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(0.8rem, 1vw, 0.9rem)',
                      color: 'var(--text-soft)',
                      marginTop: 2,
                      wordBreak: 'break-word',
                    }}
                  >
                    {isPublic ? field.hint : '🔒 Скрыто'}
                  </div>
                  {checked && (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 'clamp(0.82rem, 1.05vw, 0.92rem)',
                        color: isCorrect ? '#2A8B4E' : '#C33C3C',
                        lineHeight: 1.45,
                      }}
                    >
                      <b>{isCorrect ? '✅ ' : '❌ '}</b>
                      {field.reason}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => toggle(field.id)}
                  disabled={checked}
                  style={{
                    position: 'relative',
                    width: 78, height: 40,
                    borderRadius: 999,
                    border: 'none',
                    background: isPublic
                      ? 'linear-gradient(135deg, #F5C242, #D4A02C)'
                      : 'linear-gradient(135deg, #B5E6C3, #4CB86C)',
                    cursor: checked ? 'default' : 'pointer',
                    transition: 'background 0.25s',
                    flexShrink: 0,
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 4,
                      left: isPublic ? 4 : 42,
                      width: 32, height: 32,
                      borderRadius: '50%',
                      background: 'white',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem',
                      transition: 'left 0.25s',
                    }}
                  >
                    {isPublic ? '👁' : '🔒'}
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Легенда */}
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            flexWrap: 'wrap',
            fontSize: '0.9rem',
            color: 'var(--text-soft)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'linear-gradient(135deg, #F5C242, #D4A02C)' }} />
            Видно всем
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'linear-gradient(135deg, #B5E6C3, #4CB86C)' }} />
            Только мне
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        {!checked && (
          <Button
            onClick={handleCheck}
            variant="primary"
            className="btn-xl"
            style={{ background: ACCENT, color: 'white', fontSize: '1.35rem', padding: '18px 42px' }}
          >
            🔍 Проверить настройки
          </Button>
        )}
        {checked && !isPerfect && (
          <Button
            onClick={handleRetry}
            variant="primary"
            className="btn-xl"
            style={{ background: ACCENT, color: 'white', fontSize: '1.35rem', padding: '18px 42px' }}
          >
            🔄 Попробовать снова
          </Button>
        )}
      </div>

      {/* Итог с ref для ручного скролла */}
      <AnimatePresence>
        {checked && (
          <div ref={resultRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                maxWidth: 900,
                width: '100%',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderLeft: `10px solid ${isPerfect ? SAFE : DANGER}`,
                borderRadius: 24,
                padding: 'clamp(20px, 3.5vh, 32px)',
                boxShadow: `0 20px 50px ${isPerfect ? 'rgba(76,184,108,0.25)' : 'rgba(232,92,92,0.25)'}`,
              }}
            >
              <h3
                style={{
                  color: isPerfect ? '#2A8B4E' : '#C33C3C',
                  marginBottom: 10,
                  textAlign: 'center',
                  fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)',
                }}
              >
                {isPerfect
                  ? '✅ Отлично! Профиль настроен безопасно'
                  : '❌ Есть ошибки в настройках'}
              </h3>
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-soft)',
                  marginBottom: isPerfect ? 20 : 0,
                  fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                }}
              >
                Правильно настроено: <b>{correctCount} из {totalCount}</b>
              </p>
              {isPerfect && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={handleContinue}
                    variant="primary"
                    className="btn-xl"
                    style={{ background: ACCENT, color: 'white', fontSize: '1.35rem', padding: '18px 42px' }}
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