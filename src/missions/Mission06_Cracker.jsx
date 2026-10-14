import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import ScrollTo from '../components/ScrollTo.jsx'
import { useSound } from '../context/SoundContext.jsx'

// 8 фрагментов пароля
const fragments = [
  { id: 'ko',   text: 'Ko',      type: 'Буквы (разный регистр)', safe: true,  reason: 'Заглавная и строчная — уже хорошо!' },
  { id: 't!',   text: 't!',      type: 'Буква + символ',          safe: true,  reason: 'Спецсимвол усиливает пароль.' },
  { id: '12',   text: '12',      type: 'Цифры',                   safe: true,  reason: 'Цифры в пароле обязательны.' },
  { id: '_x',   text: '_x',      type: 'Символ + буква',          safe: true,  reason: 'Ещё один спецсимвол — отлично!' },

  { id: 'макс', text: 'макс',    type: 'Имя',                     safe: false, reason: 'Личное имя легко угадать.' },
  { id: '2011', text: '2011',    type: 'Дата рождения',           safe: false, reason: 'Год рождения есть в соцсетях — легко угадать.' },
  { id: 'пороль', text: 'пороль', type: 'Простое слово',          safe: false, reason: 'Простые слова хакеры перебирают за секунды.' },
  { id: 'abc',  text: 'abc',     type: 'Латиница по порядку',     safe: false, reason: '«abc» — одна из первых комбинаций в любой атаке.' },
]

const ACCENT = '#3B6FD4'
const ACCENT_CYAN = '#00B8D4'
const DANGER = '#E85C5C'

export default function Mission06_Cracker({ onSuccess }) {
  const [password, setPassword] = useState([])
  const [checked, setChecked] = useState(false)
  const { playSuccess, playFail } = useSound()

  const slotsCount = 4

  const handleFragmentClick = (fragment) => {
    if (checked) return
    if (password.includes(fragment.id)) return
    if (password.length >= slotsCount) return
    setPassword([...password, fragment.id])
  }

  const handleRemoveFromSlot = (index) => {
    if (checked) return
    const newPassword = [...password]
    newPassword.splice(index, 1)
    setPassword(newPassword)
  }

  const handleCheck = () => {
    if (password.length !== slotsCount) return
    setChecked(true)
    const selectedFragments = password.map(id => fragments.find(f => f.id === id))
    const allSafe = selectedFragments.every(f => f?.safe)
    if (allSafe) {
      playSuccess()
    } else {
      playFail()
    }
  }

  const handleRetry = () => {
    setPassword([])
    setChecked(false)
  }

  const handleClear = () => {
    if (checked) return
    setPassword([])
  }

  const selectedFragments = password.map(id => fragments.find(f => f.id === id))
  const allSafe = selectedFragments.every(f => f?.safe)
  const isStrong = checked && allSafe && password.length === slotsCount
  const passwordString = selectedFragments.map(f => f?.text || '').join('')

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
        <h2 style={{ marginBottom: 8, fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', color: ACCENT }}>
          🔐 Собери надёжный пароль
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', margin: 0 }}>
          Взломщик подбирает пароли за секунды! Собери пароль из <b>4 фрагментов</b> так, чтобы его было сложно взломать.
        </p>
      </div>

      {/* Слоты пароля */}
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: 24,
          padding: 'clamp(20px, 3vh, 30px)',
          boxShadow: `0 16px 40px ${ACCENT}30`,
          border: `2px solid #D5DEEC`,
          width: '100%',
          maxWidth: 750,
        }}
      >
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text-soft)',
            marginBottom: 12,
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        >
          ТВОЙ ПАРОЛЬ
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
          }}
        >
          {Array.from({ length: slotsCount }).map((_, i) => {
            const fragmentId = password[i]
            const fragment = fragmentId ? fragments.find(f => f.id === fragmentId) : null

            let bc = '#D5DEEC'
            let bg = 'white'
            if (checked) {
              if (fragment?.safe) { bc = '#4CB86C'; bg = '#F0FBF5' }
              else if (fragment) { bc = DANGER; bg = '#FFF5F5' }
            } else if (fragment) {
              bc = ACCENT; bg = '#F0F7FF'
            }

            return (
              <motion.button
                key={i}
                onClick={() => handleRemoveFromSlot(i)}
                whileHover={!checked && fragment ? { scale: 1.05 } : {}}
                whileTap={!checked && fragment ? { scale: 0.95 } : {}}
                disabled={checked || !fragment}
                style={{
                  width: 'clamp(70px, 10vw, 100px)',
                  height: 'clamp(70px, 10vw, 100px)',
                  borderRadius: 18,
                  border: `4px solid ${bc}`,
                  background: bg,
                  cursor: !checked && fragment ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'monospace',
                  fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
                  fontWeight: 800,
                  color: fragment ? 'var(--text-dark)' : '#B8C5D6',
                  boxShadow: fragment ? `0 8px 20px ${bc}40` : 'none',
                  transition: 'all 0.2s',
                  position: 'relative',
                  padding: 0,
                }}
              >
                {fragment ? fragment.text : '?'}

                {!checked && fragment && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: DANGER,
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    ×
                  </div>
                )}

                {checked && fragment && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -10,
                      right: -10,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: fragment.safe ? '#4CB86C' : DANGER,
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    }}
                  >
                    {fragment.safe ? '✓' : '✗'}
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        <div
          style={{
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
            fontWeight: 800,
            color: password.length > 0 ? ACCENT : '#B8C5D6',
            letterSpacing: '0.1em',
            padding: '12px 20px',
            background: '#F5F7FB',
            borderRadius: 14,
            minHeight: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {passwordString || '··· ··· ··· ···'}
        </div>

        {!checked && password.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <button
              onClick={handleClear}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-soft)',
                fontSize: '0.9rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Очистить всё
            </button>
          </div>
        )}
      </div>

      {/* Фрагменты */}
      {!checked && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            width: '100%',
            maxWidth: 950,
          }}
        >
          {fragments.map(f => {
            const isUsed = password.includes(f.id)
            return (
              <motion.button
                key={f.id}
                onClick={() => handleFragmentClick(f)}
                whileHover={!isUsed ? { y: -5, scale: 1.05 } : {}}
                whileTap={!isUsed ? { scale: 0.95 } : {}}
                disabled={isUsed || password.length >= slotsCount}
                style={{
                  padding: 'clamp(14px, 2vh, 20px)',
                  borderRadius: 16,
                  border: `3px solid ${isUsed ? '#D5DEEC' : ACCENT}`,
                  background: isUsed
                    ? '#F5F7FB'
                    : `linear-gradient(135deg, #FFFFFF, #EAF4FC)`,
                  cursor: isUsed || password.length >= slotsCount ? 'not-allowed' : 'pointer',
                  opacity: isUsed ? 0.4 : password.length >= slotsCount ? 0.5 : 1,
                  fontFamily: 'monospace',
                  fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)',
                  fontWeight: 800,
                  color: 'var(--text-dark)',
                  boxShadow: isUsed ? 'none' : `0 6px 18px ${ACCENT}30`,
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{f.text}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-soft)',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                >
                  {f.type}
                </span>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Кнопки управления */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        {!checked && (
          <Button
            onClick={handleCheck}
            variant="primary"
            className="btn-xl"
            disabled={password.length !== slotsCount}
            style={{
              background: password.length === slotsCount ? ACCENT : '#B8C5D6',
              color: 'white',
              fontSize: '1.35rem',
              padding: '18px 42px',
            }}
          >
            {password.length !== slotsCount
              ? `Заполни все 4 слота (${password.length}/4)`
              : '🔍 Проверить пароль'}
          </Button>
        )}
      </div>

      {/* Разбор */}
      <ScrollTo trigger={checked}>
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                maxWidth: 950,
                width: '100%',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderLeft: `10px solid ${isStrong ? '#4CB86C' : DANGER}`,
                borderRadius: 24,
                padding: 'clamp(20px, 3.5vh, 32px)',
                boxShadow: `0 20px 50px ${isStrong ? 'rgba(76,184,108,0.25)' : 'rgba(232,92,92,0.25)'}`,
              }}
            >
              <h3
                style={{
                  color: isStrong ? '#2A8B4E' : '#C33C3C',
                  marginBottom: 16,
                  textAlign: 'center',
                  fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)',
                }}
              >
                {isStrong ? '✅ Отличный пароль!' : '❌ Пароль можно взломать'}
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 12,
                  marginBottom: 22,
                }}
              >
                {selectedFragments.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      background: f.safe ? '#F0FBF5' : '#FFF5F5',
                      border: `2.5px solid ${f.safe ? '#B5E6C3' : '#F5C5C5'}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        marginBottom: 4,
                        color: f.safe ? '#2A8B4E' : '#C33C3C',
                      }}
                    >
                      {f.safe ? '✓' : '✗'} {f.text}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)', lineHeight: 1.4 }}>
                      {f.reason}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div
                style={{
                  background: '#F0F7FF',
                  border: '2px dashed #B8D4EE',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 22,
                  fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
                  color: 'var(--text-dark)',
                  lineHeight: 1.55,
                }}
              >
                <b>💡 Запомни правила надёжного пароля:</b>
                <ul style={{ margin: '8px 0 0 20px' }}>
                  <li>Минимум 8 символов</li>
                  <li>Буквы в разном регистре (Аа)</li>
                  <li>Цифры (123)</li>
                  <li>Спецсимволы (!@#$%^&*)</li>
                  <li>Не используй имя, дату рождения, «пароль»</li>
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                {!isStrong && (
                  <Button
                    onClick={handleRetry}
                    variant="primary"
                    className="btn-xl"
                    style={{ background: ACCENT, color: 'white', fontSize: '1.35rem', padding: '18px 42px' }}
                  >
                    🔄 Попробовать снова
                  </Button>
                )}
                {isStrong && (
                  <Button
                    onClick={onSuccess}
                    variant="primary"
                    className="btn-xl"
                    style={{ background: ACCENT, color: 'white', fontSize: '1.35rem', padding: '18px 42px' }}
                  >
                    Продолжить →
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollTo>
    </div>
  )
}