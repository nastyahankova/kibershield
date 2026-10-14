import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import ScrollTo from '../components/ScrollTo.jsx'
import { useSound } from '../context/SoundContext.jsx'

const letters = [
  {
    id: 'real',
    isFake: false,
    from: 'school1-gorki@edu.by',
    fromLabel: 'Школа №1 г. Горки',
    subject: 'Приглашаем на олимпиаду по информатике',
    body: 'Здравствуй, ученик!\n\nПриглашаем тебя на школьный этап олимпиады по информатике. Она пройдёт 15 ноября в кабинете №12.\n\nПодробности — на сайте школы: school1-gorki.by',
    sign: 'С уважением, Администрация школы',
  },
  {
    id: 'fake',
    isFake: true,
    from: 'priz-centr-info@mail.ru',
    fromLabel: 'Приз-Центр',
    subject: '🎉 ПОЗДРАВЛЯЕМ! ВЫ ВЫИГРАЛИ IPHONE 15!',
    body: 'Дорогой друг!\n\nВы стали победителем розыгрыша! Чтобы получить iPhone 15, срочно перейдите по ссылке и введите логин и пароль от своего аккаунта:\n\nwww.iphone-priz.xyz/win\n\nТолько сегодня!',
    sign: 'Не упустите шанс!',
  },
]

const signs = [
  { emoji: '📧', title: 'Незнакомый адрес', text: 'Письмо пришло с mail.ru, а не с адреса школы.' },
  { emoji: '💰', title: 'Слишком заманчиво', text: 'Настоящие розыгрыши не сообщают о выигрыше iPhone по почте.' },
  { emoji: '🔗', title: 'Странная ссылка', text: 'www.iphone-priz.xyz — не официальный сайт.' },
]

export default function Mission01_Phishing({ onSuccess }) {
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [showSigns, setShowSigns] = useState(false)
  const { playSuccess, playFail } = useSound()

  const handleCheck = () => {
    if (!selected) return
    setChecked(true)
    const isCorrect = letters.find(l => l.id === selected)?.isFake
    if (isCorrect) {
      playSuccess()
      setTimeout(() => setShowSigns(true), 600)
    } else {
      playFail()
    }
  }

  const handleRetry = () => {
    setSelected(null)
    setChecked(false)
  }

  const isCorrect = checked && letters.find(l => l.id === selected)?.isFake

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      {/* Задание */}
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: 24,
          padding: 'clamp(16px, 2.5vh, 28px) clamp(24px, 4vw, 48px)',
          boxShadow: '0 16px 40px rgba(46, 58, 89, 0.18)',
          maxWidth: 1000,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            marginBottom: 8,
            fontSize: 'clamp(1.4rem, 2.8vw, 2rem)',
            background: 'linear-gradient(135deg, #4A90E2, #9B6BC9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          🎣 Найди поддельное письмо
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', margin: 0 }}>
          Одно письмо — настоящее, другое — от Крючка. Кликни на подозрительное!
        </p>
      </div>

      {/* Письма */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
          width: '100%',
          maxWidth: 1100,
        }}
      >
        {letters.map(letter => {
          const isSelected = selected === letter.id
          const isFake = letter.isFake

          let borderColor = 'transparent'
          let shadowColor = 'rgba(46,58,89,0.12)'
          if (checked) {
            if (isFake && isSelected) { borderColor = '#4CB86C'; shadowColor = 'rgba(76,184,108,0.4)' }
            else if (isFake && !isSelected) { borderColor = '#E85C5C'; shadowColor = 'rgba(232,92,92,0.4)' }
            else if (!isFake && isSelected) { borderColor = '#E85C5C'; shadowColor = 'rgba(232,92,92,0.4)' }
          } else if (isSelected) {
            borderColor = '#4A90E2'
            shadowColor = 'rgba(74,144,226,0.4)'
          }

          return (
            <motion.div
              key={letter.id}
              onClick={() => !checked && setSelected(letter.id)}
              whileHover={!checked ? { y: -6, scale: 1.02 } : {}}
              whileTap={!checked ? { scale: 0.98 } : {}}
              style={{
                cursor: checked ? 'default' : 'pointer',
                position: 'relative',
                border: `5px solid ${borderColor}`,
                borderRadius: 24,
                background: 'white',
                boxShadow: `0 12px 32px ${shadowColor}`,
                overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  background: isSelected && !checked ? 'linear-gradient(135deg, #EAF4FC, #D5EAF8)' : '#F5F7FB',
                  padding: '16px 20px',
                  borderBottom: '3px solid #EEF1F7',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'white',
                    background: isFake ? '#E85C5C' : '#4A90E2',
                    padding: '4px 12px',
                    borderRadius: 999,
                    marginBottom: 8,
                    letterSpacing: '0.05em',
                  }}
                >
                  ОТ: {letter.fromLabel.toUpperCase()}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 'clamp(1.05rem, 1.5vw, 1.25rem)',
                    color: 'var(--text-dark)',
                    lineHeight: 1.3,
                  }}
                >
                  {letter.subject}
                </div>
              </div>

              <div
                style={{
                  padding: '18px 22px',
                  fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                  color: 'var(--text-dark)',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {letter.body}
              </div>

              <div
                style={{
                  padding: '12px 22px 16px',
                  fontSize: '0.9rem',
                  color: 'var(--text-soft)',
                  fontStyle: 'italic',
                  borderTop: '2px dashed #EEF1F7',
                }}
              >
                {letter.sign}
              </div>

              {checked && isFake && (
                <motion.div
                  initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: -15, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  style={{
                    position: 'absolute',
                    top: '38%',
                    right: '-20px',
                    background: '#E85C5C',
                    color: 'white',
                    padding: '12px 30px',
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    borderRadius: 10,
                    boxShadow: '0 8px 24px rgba(232,92,92,0.55)',
                    pointerEvents: 'none',
                    letterSpacing: '0.1em',
                  }}
                >
                  ⚠ ФИШИНГ
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        {!checked && (
          <Button onClick={handleCheck} variant="primary" className="btn-xl" disabled={!selected}>
            🔍 Проверить выбор
          </Button>
        )}
        {checked && !isCorrect && (
          <Button onClick={handleRetry} variant="primary" className="btn-xl">
            🔄 Попробовать снова
          </Button>
        )}
      </div>

      {/* Ошибка */}
      <AnimatePresence>
        {checked && !isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              maxWidth: 760,
              width: '100%',
              background: 'white',
              borderLeft: '8px solid #E85C5C',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 12px 30px rgba(232,92,92,0.2)',
            }}
          >
            <h3 style={{ color: '#E85C5C', marginBottom: 10, fontSize: '1.4rem' }}>
              ❌ Не совсем так
            </h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', margin: 0 }}>
              Это письмо — настоящее. А подделка — письмо про выигрыш iPhone.
              Присмотрись к нему: незнакомый адрес, странная ссылка. Попробуй ещё!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Успех + признаки с автоскроллом */}
      <ScrollTo trigger={showSigns}>
        <AnimatePresence>
          {showSigns && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                maxWidth: 1100,
                width: '100%',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderLeft: '10px solid #4CB86C',
                borderRadius: 24,
                padding: 'clamp(24px, 4vh, 36px)',
                boxShadow: '0 20px 50px rgba(76,184,108,0.25)',
              }}
            >
              <h3
                style={{
                  color: 'var(--accent-green)',
                  marginBottom: 8,
                  textAlign: 'center',
                  fontSize: 'clamp(1.4rem, 2.6vw, 2rem)',
                }}
              >
                ✅ Молодец! Ты нашёл фишинг
              </h3>
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-soft)',
                  marginBottom: 24,
                  fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                }}
              >
                Вот три признака, которые выдают подделку:
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                {signs.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.15 * i, type: 'spring' }}
                    style={{
                      padding: 20,
                      background: 'linear-gradient(135deg, #F0FBF5, #E4F7EC)',
                      borderRadius: 18,
                      border: '2.5px solid #B5E6C3',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '2.8rem', marginBottom: 8 }}>{s.emoji}</div>
                    <div
                      style={{
                        fontWeight: 800,
                        marginBottom: 8,
                        fontSize: '1.1rem',
                        color: 'var(--text-dark)',
                      }}
                    >
                      {s.title}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-soft)', lineHeight: 1.4 }}>
                      {s.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={onSuccess} variant="primary" className="btn-xl">
                  Продолжить →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollTo>
    </div>
  )
}