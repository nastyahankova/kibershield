import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import { useSound } from '../context/SoundContext.jsx'

const ads = [
  {
    id: 1,
    emoji: '🎮',
    category: 'Игровая приставка',
    title: 'PlayStation 5 за 50 рублей',
    text: 'Продаю PS5 в отличном состоянии. Только сегодня! Отправлю почтой после предоплаты. Пишите на WhatsApp: +375 (44) XXX-XX-XX.',
    isScam: true,
    reason: 'Слишком низкая цена, требует предоплату, незнакомый номер — классические признаки мошенника.',
  },
  {
    id: 2,
    emoji: '🚲',
    category: 'Велосипед',
    title: 'Горный велосипед, 21 скорость',
    text: 'Продаю горный велосипед, почти новый. Цена 150 рублей. Самовывоз, г. Горки, район центрального рынка. Можно посмотреть перед покупкой.',
    isScam: false,
    reason: 'Реальная цена, самовывоз, можно посмотреть перед покупкой — всё честно.',
  },
  {
    id: 3,
    emoji: '🐶',
    category: 'Животные',
    title: 'Щенки в добрые руки',
    text: 'Отдам щенков в добрые руки! Оплатите только доставку — 80 рублей — и щенок ваш. Фото пришлю в личку.',
    isScam: true,
    reason: 'Просят деньги за «доставку», фото только в личке. Так работают мошенники с животными.',
  },
  {
    id: 4,
    emoji: '⚽',
    category: 'Спорт',
    title: 'Футбольный мяч Adidas',
    text: 'Продаю футбольный мяч Adidas, почти новый. Цена 25 рублей. Самовывоз, г. Горки, район центрального рынка.',
    isScam: false,
    reason: 'Реальная цена, самовывоз, конкретное место.',
  },
  {
    id: 5,
    emoji: '📱',
    category: 'Телефоны',
    title: 'iPhone 15 Pro за 200 рублей',
    text: 'Срочно! iPhone 15 Pro, новый, запечатанный. 200 рублей. Оплата переводом на карту или через ЕРИП, потом отправлю почтой. Предоплата 50%.',
    isScam: true,
    reason: 'Цена в 5 раз ниже рынка, требует предоплату переводом, срочность — всё выдаёт мошенника.',
  },
]

const ACCENT = '#B03A5B'
const ACCENT_DARK = '#7A1F3C'
const DANGER = '#C02942'
const SAFE = '#4CB86C'

export default function Mission08_Illusionist({ onSuccess }) {
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
    const scamIds = ads.filter(a => a.isScam).map(a => a.id)
    const correctlyFound = selected.filter(id => scamIds.includes(id)).length
    const wrongFound = selected.filter(id => !scamIds.includes(id)).length
    const isPerfect = correctlyFound === scamIds.length && wrongFound === 0
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

  const scamIds = ads.filter(a => a.isScam).map(a => a.id)
  const correctlyFound = selected.filter(id => scamIds.includes(id)).length
  const wrongFound = selected.filter(id => !scamIds.includes(id)).length
  const isPerfect = correctlyFound === scamIds.length && wrongFound === 0

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
          🎩 Найди мошенника
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', margin: 0 }}>
          На барахолке спрятались <b>3 мошеннических объявления</b>. Кликни на них!
        </p>
      </div>

      {/* Сетка объявлений */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: 16,
          width: '100%',
          maxWidth: 1150,
        }}
      >
        {ads.map(ad => {
          const isSelected = selected.includes(ad.id)
          const isScam = ad.isScam

          let bc = 'transparent'
          let bg = 'white'
          let sh = 'rgba(46,58,89,0.12)'

          if (checked) {
            if (isScam && isSelected) {
              bc = SAFE; bg = '#F0FBF5'; sh = 'rgba(76,184,108,0.4)'
            } else if (isScam && !isSelected) {
              bc = DANGER; bg = '#FFF5F5'; sh = 'rgba(192,41,66,0.35)'
            } else if (!isScam && isSelected) {
              bc = DANGER; bg = '#FFF5F5'; sh = 'rgba(192,41,66,0.4)'
            } else {
              bc = '#D5DEEC'; bg = '#F5F7FB'; sh = 'rgba(46,58,89,0.1)'
            }
          } else if (isSelected) {
            bc = ACCENT; bg = '#FFF5FA'; sh = `rgba(176,58,91,0.4)`
          }

          return (
            <motion.button
              key={ad.id}
              onClick={() => toggle(ad.id)}
              whileHover={!checked ? { y: -6, scale: 1.02 } : {}}
              whileTap={!checked ? { scale: 0.98 } : {}}
              disabled={checked}
              style={{
                cursor: checked ? 'default' : 'pointer',
                border: `5px solid ${bc}`,
                borderRadius: 22,
                background: bg,
                boxShadow: `0 12px 30px ${sh}`,
                padding: 0,
                overflow: 'hidden',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                fontFamily: 'inherit',
                position: 'relative',
              }}
            >
              <div
                style={{
                  padding: '14px 18px',
                  background: `linear-gradient(135deg, #FDF2F5, #F5E2EA)`,
                  borderBottom: `3px solid #E5C2CC`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: '2rem' }}>{ad.emoji}</span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: ACCENT,
                    background: 'white',
                    padding: '4px 10px',
                    borderRadius: 999,
                    letterSpacing: '0.03em',
                  }}
                >
                  {ad.category.toUpperCase()}
                </span>
              </div>

              <div
                style={{
                  padding: '16px 20px 10px',
                  fontWeight: 800,
                  fontSize: 'clamp(1.1rem, 1.5vw, 1.3rem)',
                  color: 'var(--text-dark)',
                  lineHeight: 1.3,
                }}
              >
                {ad.title}
              </div>

              <div
                style={{
                  padding: '0 20px 20px',
                  fontSize: 'clamp(0.92rem, 1.15vw, 1.05rem)',
                  color: 'var(--text-soft)',
                  lineHeight: 1.55,
                  flex: 1,
                }}
              >
                {ad.text}
              </div>

              {isSelected && !checked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: ACCENT,
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${ACCENT}66`,
                  }}
                >
                  ✓
                </motion.div>
              )}

              {checked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    padding: '12px 20px',
                    background: isScam ? '#F0FBF5' : '#F5F7FB',
                    borderTop: `3px solid ${isScam ? '#B5E6C3' : '#D5DEEC'}`,
                    fontSize: 'clamp(0.85rem, 1.05vw, 0.95rem)',
                    color: 'var(--text-soft)',
                    lineHeight: 1.5,
                  }}
                >
                  <b style={{ color: isScam ? '#2A8B4E' : '#5A6885' }}>
                    {isScam ? '⚠ Мошенничество: ' : '✓ Настоящее: '}
                  </b>
                  {ad.reason}
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        {!checked && (
          <Button
            onClick={handleCheck}
            variant="primary"
            className="btn-xl"
            disabled={selected.length === 0}
            style={{ background: ACCENT, color: 'white', fontSize: '1.35rem', padding: '18px 42px' }}
          >
            🔍 Проверить выбор ({selected.length})
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

      <AnimatePresence>
        {checked && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
                boxShadow: `0 20px 50px ${isPerfect ? 'rgba(76,184,108,0.25)' : 'rgba(192,41,66,0.25)'}`,
              }}
            >
              <h3
                style={{
                  color: isPerfect ? '#2A8B4E' : '#A01F35',
                  marginBottom: 10,
                  textAlign: 'center',
                  fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)',
                }}
              >
                {isPerfect
                  ? '✅ Отлично! Ты разоблачил всех мошенников'
                  : '❌ Есть ошибки в выборе'}
              </h3>
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-soft)',
                  marginBottom: isPerfect ? 20 : 0,
                  fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                }}
              >
                Ты нашёл {correctlyFound} из {scamIds.length} мошеннических объявлений
                {wrongFound > 0 && `, и ${wrongFound} ошибок`}.
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