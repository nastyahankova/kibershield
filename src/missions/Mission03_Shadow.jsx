import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import ScrollTo from '../components/ScrollTo.jsx'
import { useSound } from '../context/SoundContext.jsx'

const actions = [
  {
    id: 'screenshot',
    emoji: '📸',
    label: 'Сохранить скриншоты сообщений',
    isCorrect: true,
    reason: 'Скриншоты — это доказательства. Они помогут взрослым разобраться в ситуации.',
  },
  {
    id: 'tell-adults',
    emoji: '🗣️',
    label: 'Рассказать родителям или учителю',
    isCorrect: true,
    reason: 'Нельзя оставаться одному с такой проблемой. Взрослые помогут и защитят.',
  },
  {
    id: 'block',
    emoji: '🚫',
    label: 'Заблокировать обидчика',
    isCorrect: true,
    reason: 'Блокировка прекратит поток сообщений — обидчик больше не сможет писать.',
  },
  {
    id: 'answer-back',
    emoji: '💢',
    label: 'Ответить обидчику тем же',
    isCorrect: false,
    reason: 'Ответная агрессия разжигает конфликт. Ты не виноват, но и мстить не нужно.',
  },
  {
    id: 'delete',
    emoji: '🗑️',
    label: 'Удалить чат и забыть',
    isCorrect: false,
    reason: 'Проблема не уйдёт сама. И без доказательств будет сложно помочь.',
  },
  {
    id: 'silent',
    emoji: '🤐',
    label: 'Промолчать и никому не говорить',
    isCorrect: false,
    reason: 'Молчание — не защита. Буллинг может усилиться, а ты останешься один.',
  },
]

const ACCENT = '#8B5FBF'
const ACCENT_DARK = '#6A4595'
const ACCENT_LIGHT = '#F0EAF8'

export default function Mission03_Shadow({ onSuccess }) {
  const [selected, setSelected] = useState([])
  const [checked, setChecked] = useState(false)
  const { playSuccess, playFail } = useSound()

  const toggle = (id) => {
    if (checked) return
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleCheck = () => {
    if (selected.length === 0) return
    setChecked(true)
    const correctIds = actions.filter(a => a.isCorrect).map(a => a.id)
    const correctlyFound = selected.filter(id => correctIds.includes(id)).length
    const wrongFound = selected.filter(id => !correctIds.includes(id)).length
    const isPerfect = correctlyFound === correctIds.length && wrongFound === 0
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

  const correctIds = actions.filter(a => a.isCorrect).map(a => a.id)
  const correctlyFound = selected.filter(id => correctIds.includes(id)).length
  const wrongFound = selected.filter(id => !correctIds.includes(id)).length
  const isPerfect = correctlyFound === correctIds.length && wrongFound === 0

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
        <h2 style={{ marginBottom: 8, fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', color: ACCENT_DARK }}>
          🕵️ Кибер-детектив
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', margin: 0 }}>
          Твой одноклассник получает обидные сообщения. Выбери <b>3 правильных действия</b>, которые ему помогут.
        </p>
      </div>

      {/* Превью ситуации */}
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: 'clamp(16px, 2.5vh, 24px)',
          boxShadow: `0 12px 32px ${ACCENT}30`,
          border: `2px solid ${ACCENT_LIGHT}`,
          maxWidth: 720,
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
            paddingBottom: 12,
            borderBottom: '2px solid #EEF1F7',
          }}
        >
          <div
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: ACCENT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem',
            }}
          >
            💬
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-dark)' }}>Чат класса</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>4 участника</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ChatBubble from="Обидчик" color="#E85C5C">
            Эй, ты чего такой странный? Все над тобой смеются 😂
          </ChatBubble>
          <ChatBubble from="Обидчик" color="#E85C5C">
            Лучше вообще не появляйся в школе, тебя никто не любит
          </ChatBubble>
          <ChatBubble from="Обидчик" color="#E85C5C">
            Что, молчишь? Значит, всё правда 🤣
          </ChatBubble>
          <ChatBubble from="Одноклассник" color="#4A90E2" align="right">
            Ребята, мне очень неприятно. Прекратите, пожалуйста.
          </ChatBubble>
        </div>
      </div>

      {/* Вопрос */}
      <div
        style={{
          background: ACCENT_LIGHT,
          border: `3px solid ${ACCENT}`,
          borderRadius: 20,
          padding: '14px 24px',
          maxWidth: 1000,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)', fontWeight: 800, color: ACCENT_DARK }}>
          ❓ Что делать однокласснику?
        </div>
      </div>

      {/* Сетка вариантов */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14,
          width: '100%',
          maxWidth: 1000,
        }}
      >
        {actions.map(action => {
          const isSelected = selected.includes(action.id)
          const isCorrect = action.isCorrect

          let borderColor = 'transparent'
          let shadowColor = 'rgba(46,58,89,0.12)'
          let bgColor = 'white'

          if (checked) {
            if (isCorrect && isSelected) {
              borderColor = '#4CB86C'; shadowColor = 'rgba(76,184,108,0.35)'; bgColor = '#F0FBF5'
            } else if (isCorrect && !isSelected) {
              borderColor = '#4CB86C'; shadowColor = 'rgba(76,184,108,0.25)'; bgColor = '#F0FBF5'
            } else if (!isCorrect && isSelected) {
              borderColor = '#E85C5C'; shadowColor = 'rgba(232,92,92,0.35)'; bgColor = '#FFF0F0'
            }
          } else if (isSelected) {
            borderColor = ACCENT; shadowColor = `${ACCENT}55`; bgColor = ACCENT_LIGHT
          }

          return (
            <motion.button
              key={action.id}
              onClick={() => toggle(action.id)}
              whileHover={!checked ? { y: -4, scale: 1.02 } : {}}
              whileTap={!checked ? { scale: 0.98 } : {}}
              style={{
                cursor: checked ? 'default' : 'pointer',
                border: `4px solid ${borderColor}`,
                borderRadius: 20,
                background: bgColor,
                boxShadow: `0 10px 26px ${shadowColor}`,
                padding: 'clamp(16px, 2.2vh, 22px) clamp(16px, 2vw, 24px)',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                textAlign: 'left',
                fontFamily: 'inherit',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)', lineHeight: 1 }}>
                  {action.emoji}
                </span>
                <span
                  style={{
                    fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    lineHeight: 1.35,
                  }}
                >
                  {action.label}
                </span>
                {isSelected && !checked && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      marginLeft: 'auto',
                      background: ACCENT, color: 'white', borderRadius: '50%',
                      width: 30, height: 30, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 800, fontSize: '1rem',
                    }}
                  >
                    ✓
                  </motion.span>
                )}
              </div>

              {checked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
                    color: isCorrect ? '#2A8B4E' : '#C33C3C',
                    lineHeight: 1.5,
                    borderTop: `2px dashed ${isCorrect ? '#B5E6C3' : '#F5C5C5'}`,
                    paddingTop: 10,
                    marginTop: 4,
                  }}
                >
                  <b>{isCorrect ? '✅ Верно: ' : '❌ Не подходит: '}</b>
                  {action.reason}
                </motion.div>
              )}
            </motion.button>
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
            disabled={selected.length !== 3}
            style={{
              background: selected.length === 3 ? ACCENT : '#B8A0D8',
              color: 'white',
              fontSize: '1.35rem',
              padding: '18px 42px',
            }}
          >
            {selected.length !== 3
              ? `Выбери 3 действия (${selected.length}/3)`
              : '🔍 Проверить'}
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

      {/* Итог с автоскроллом */}
      <ScrollTo trigger={checked}>
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                maxWidth: 900,
                width: '100%',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderLeft: `10px solid ${isPerfect ? '#4CB86C' : '#E85C5C'}`,
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
                  ? '✅ Отлично! Ты настоящий кибер-детектив'
                  : '❌ Некоторые варианты не подходят'}
              </h3>
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-soft)',
                  marginBottom: isPerfect ? 20 : 0,
                  fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                }}
              >
                Ты выбрал {correctlyFound} из 3 правильных действий
                {wrongFound > 0 && `, и ${wrongFound} неверных`}.
              </p>
              {isPerfect && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={onSuccess}
                    variant="primary"
                    className="btn-xl"
                    style={{ background: ACCENT, color: 'white', fontSize: '1.35rem', padding: '18px 42px' }}
                  >
                    Продолжить →
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollTo>
    </div>
  )
}

function ChatBubble({ from, color, align = 'left', children }) {
  const isRight = align === 'right'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isRight ? 'flex-end' : 'flex-start',
        gap: 4,
      }}
    >
      <span style={{ fontSize: '0.85rem', color, fontWeight: 700, padding: '0 8px' }}>
        {from}
      </span>
      <div
        style={{
          maxWidth: '85%',
          background: isRight ? '#EAF4FC' : '#FFF0F0',
          color: 'var(--text-dark)',
          padding: '10px 16px',
          borderRadius: isRight ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
          lineHeight: 1.5,
          border: isRight ? '2px solid #B8D4EE' : '2px solid #F5C5C5',
        }}
      >
        {children}
      </div>
    </div>
  )
}