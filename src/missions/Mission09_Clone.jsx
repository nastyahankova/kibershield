import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import { useSound } from '../context/SoundContext.jsx'

// Настоящий профиль
const realProfile = {
  avatar: '🧑',
  name: 'Максим Петров',
  fields: [
    { id: 'nick',    emoji: '🏷', label: 'Ник',              value: '@maxim_petrov_2012' },
    { id: 'since',   emoji: '📅', label: 'На сайте',         value: 'с 2019 года' },
    { id: 'friends', emoji: '👥', label: 'Друзья',           value: '247 друзей, 12 общих с тобой' },
    { id: 'posts',   emoji: '📝', label: 'Записи',           value: '15 записей' },
    { id: 'last',    emoji: '💬', label: 'Последняя запись', value: '«Кто идёт на футбол в субботу?»' },
  ],
}

// Фейковый профиль — 3 «красных флага»
const cloneProfile = {
  avatar: '🧑',
  name: 'Максим Петров',
  fields: [
    { id: 'nick',    emoji: '🏷', label: 'Ник',              value: '@maxim_petrov_2012',                       suspicious: false },
    { id: 'since',   emoji: '📅', label: 'На сайте',         value: '3 дня назад',                              suspicious: true,  reason: 'Настоящий Максим на сайте с 2019 года. Клон создал профиль только что — типичный признак фейка.' },
    { id: 'friends', emoji: '👥', label: 'Друзья',           value: '247 друзей, 0 общих с тобой',              suspicious: true,  reason: 'У настоящего Максима 12 общих друзей с тобой, а у клона — ни одного. Это странно.' },
    { id: 'posts',   emoji: '📝', label: 'Записи',           value: '15 записей',                               suspicious: false },
    { id: 'last',    emoji: '💬', label: 'Последняя запись', value: '«Привет! Дай в долг 100 рублей, срочно!»', suspicious: true,  reason: 'Просьба денег в личку — классический приём клонов и взломанных аккаунтов. Настоящий друг так не напишет.' },
  ],
}

const ACCENT = '#5B6FE0'
const ACCENT_DARK = '#3B4FA0'
const DANGER = '#E85C5C'
const SAFE = '#4CB86C'
const TOTAL_SUSPICIOUS = 3

export default function Mission09_Clone({ onSuccess }) {
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

  const toggle = (id) => {
    if (checked) return
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleCheck = () => {
    if (selected.length === 0) return
    setChecked(true)
    const suspiciousIds = cloneProfile.fields.filter(f => f.suspicious).map(f => f.id)
    const correctlyFound = selected.filter(id => suspiciousIds.includes(id)).length
    const wrongFound = selected.filter(id => !suspiciousIds.includes(id)).length
    const isPerfect = correctlyFound === TOTAL_SUSPICIOUS && wrongFound === 0
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

  const handleContinue = () => onSuccess()

  const suspiciousIds = cloneProfile.fields.filter(f => f.suspicious).map(f => f.id)
  const correctlyFound = selected.filter(id => suspiciousIds.includes(id)).length
  const wrongFound = selected.filter(id => !suspiciousIds.includes(id)).length
  const isPerfect = correctlyFound === TOTAL_SUSPICIOUS && wrongFound === 0

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
          boxShadow: `0 16px 40px ${ACCENT}40`,
          border: `3px solid ${ACCENT}`,
          maxWidth: '100%',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ marginBottom: 8, fontSize: 'clamp(1.3rem, 5vw, 2rem)', color: ACCENT_DARK }}>
          👥 Разоблачи двойника
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: 'clamp(0.9rem, 3.5vw, 1.2rem)', margin: 0, lineHeight: 1.4 }}>
          Клон создал фейковый аккаунт твоего друга Максима. Профили выглядят почти одинаково —
          но есть <b>{TOTAL_SUSPICIOUS} подозрительных признака</b> в профиле клона. Найди их!
        </p>
      </div>

      {/* Два профиля */}
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
        <ProfileCard
          title="Настоящий Максим"
          subtitle="✅ Проверенный аккаунт"
          avatar={realProfile.avatar}
          avatarBg="linear-gradient(135deg, #B5E6C3, #4CB86C)"
          borderColor={SAFE}
          fields={realProfile.fields}
          interactive={false}
        />

        <ProfileCard
          title="Максим Петров"
          subtitle="❗ Аккаунт под вопросом"
          avatar={cloneProfile.avatar}
          avatarBg="linear-gradient(135deg, #F5C5C5, #E85C5C)"
          borderColor={ACCENT}
          fields={cloneProfile.fields}
          interactive={true}
          selected={selected}
          onToggle={toggle}
          checked={checked}
        />
      </div>

      {/* Статус */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 4px',
        }}
      >
        <StatusPill color={ACCENT} icon="🔍" label={`Найдено признаков: ${selected.length} / ${TOTAL_SUSPICIOUS}`} />
      </div>

      {/* Кнопки управления */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        {!checked && (
          <Button
            onClick={handleCheck}
            variant="primary"
            className="btn-xl"
            disabled={selected.length === 0}
            style={{ background: ACCENT, color: 'white' }}
          >
            🔍 Проверить ({selected.length})
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

      {/* Итог — автоскролл */}
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
                borderLeft: `10px solid ${isPerfect ? SAFE : DANGER}`,
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
                {isPerfect
                  ? '✅ Отлично! Ты разоблачил клона'
                  : '❌ Есть ошибки в выборе'}
              </h3>
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-soft)',
                  marginBottom: isPerfect ? 20 : 0,
                  fontSize: 'clamp(0.95rem, 3.5vw, 1.15rem)',
                }}
              >
                Ты нашёл {correctlyFound} из {TOTAL_SUSPICIOUS} признаков
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

// ============================================
// Карточка профиля
// ============================================
function ProfileCard({
  title,
  subtitle,
  avatar,
  avatarBg,
  borderColor,
  fields,
  interactive = false,
  selected = [],
  onToggle,
  checked = false,
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: 24,
        padding: 'clamp(14px, 3vh, 26px)',
        boxShadow: `0 16px 40px ${borderColor}30`,
        border: `4px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Шапка профиля */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(10px, 3vw, 14px)',
          paddingBottom: 'clamp(12px, 2vh, 16px)',
          borderBottom: `2px dashed #D5DEEC`,
          marginBottom: 'clamp(12px, 2vh, 16px)',
        }}
      >
        <div
          style={{
            width: 'clamp(52px, 14vw, 64px)',
            height: 'clamp(52px, 14vw, 64px)',
            borderRadius: '50%',
            background: avatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
            flexShrink: 0,
          }}
        >
          {avatar}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 'clamp(1rem, 3.8vw, 1.25rem)',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 'clamp(0.75rem, 2.8vw, 0.85rem)',
              color: 'var(--text-soft)',
              wordBreak: 'break-word',
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      {/* Поля */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vh, 10px)', flex: 1 }}>
        {fields.map(field => {
          const isSelected = selected.includes(field.id)
          const isSuspicious = !!field.suspicious

          let bc = '#E5EAF3'
          let bg = 'white'
          let sh = 'none'
          let cursor = 'default'

          if (interactive && !checked) {
            cursor = 'pointer'
            if (isSelected) {
              bc = ACCENT
              bg = '#F0F3FF'
              sh = `0 6px 18px ${ACCENT}30`
            }
          } else if (interactive && checked) {
            if (isSelected && isSuspicious) { bc = SAFE; bg = '#F0FBF5' }
            else if (!isSelected && isSuspicious) { bc = DANGER; bg = '#FFF5F5' }
            else if (isSelected && !isSuspicious) { bc = DANGER; bg = '#FFF5F5' }
          }

          return (
            <motion.div
              key={field.id}
              onClick={() => interactive && !checked && onToggle && onToggle(field.id)}
              whileHover={interactive && !checked ? { scale: 1.01 } : {}}
              whileTap={interactive && !checked ? { scale: 0.99 } : {}}
              style={{
                border: `3px solid ${bc}`,
                borderRadius: 14,
                background: bg,
                boxShadow: sh,
                padding: 'clamp(8px, 2.5vw, 14px) clamp(10px, 3vw, 14px)',
                cursor,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(8px, 2.5vw, 12px)',
                position: 'relative',
                boxSizing: 'border-box',
                width: '100%',
                maxWidth: '100%',
              }}
            >
              <span style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', flexShrink: 0 }}>
                {field.emoji}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)',
                    fontWeight: 700,
                    color: 'var(--text-soft)',
                    letterSpacing: '0.05em',
                    marginBottom: 2,
                    wordBreak: 'break-word',
                  }}
                >
                  {field.label.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 'clamp(0.85rem, 3.3vw, 1.05rem)',
                    color: 'var(--text-dark)',
                    fontWeight: 600,
                    lineHeight: 1.35,
                    wordBreak: 'break-word',
                  }}
                >
                  {field.value}
                </div>

                {interactive && checked && isSelected && isSuspicious && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{
                      marginTop: 6,
                      fontSize: 'clamp(0.72rem, 2.8vw, 0.88rem)',
                      color: '#2A8B4E',
                      lineHeight: 1.45,
                      wordBreak: 'break-word',
                    }}
                  >
                    <b>✅ Верно: </b>
                    {field.reason}
                  </motion.div>
                )}

                {interactive && checked && !isSelected && isSuspicious && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      marginTop: 6,
                      fontSize: 'clamp(0.72rem, 2.8vw, 0.88rem)',
                      color: '#C33C3C',
                      lineHeight: 1.45,
                      wordBreak: 'break-word',
                    }}
                  >
                    <b>❌ Пропущено: </b>
                    {field.reason}
                  </motion.div>
                )}

                {interactive && checked && isSelected && !isSuspicious && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      marginTop: 6,
                      fontSize: 'clamp(0.72rem, 2.8vw, 0.88rem)',
                      color: '#C33C3C',
                      lineHeight: 1.45,
                      wordBreak: 'break-word',
                    }}
                  >
                    <b>❌ Ошибка: </b>
                    Эта строка такая же, как у настоящего Максима. Ничего подозрительного.
                  </motion.div>
                )}
              </div>

              {interactive && !checked && isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: ACCENT,
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          )
        })}
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
        fontSize: 'clamp(0.72rem, 2.8vw, 1rem)',
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