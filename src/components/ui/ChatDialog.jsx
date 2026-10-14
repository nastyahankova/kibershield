import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button.jsx'
import TypewriterText from '../TypewriterText.jsx'

export default function ChatDialog({ messages = [], question, onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [typingDone, setTypingDone] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showReply, setShowReply] = useState(false)
  const bottomRef = useRef(null)

  // Отслеживаем ширину экрана
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleCount, showReply, selectedOption])

  useEffect(() => {
    if (visibleCount === 0 && messages.length > 0) {
      setVisibleCount(1)
      setTypingDone(false)
    }
  }, [messages])

  const handleNext = () => {
    if (visibleCount < messages.length) {
      setVisibleCount(visibleCount + 1)
      setTypingDone(false)
    }
  }

  const handleChoose = (option) => {
    setSelectedOption(option)
    setTimeout(() => setShowReply(true), 300)
  }

  const handleFinish = () => {
    if (onComplete) onComplete()
  }

  const allShown = visibleCount >= messages.length
  const waitingForAnswer = allShown && question && !selectedOption

  return (
    <div
      style={{
        width: '100%',
        maxWidth: isMobile ? '100%' : 1200,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(14px)',
        borderRadius: isMobile ? 20 : 32,
        padding: isMobile ? '14px 12px' : 'clamp(20px, 3vh, 36px)',
        boxShadow: '0 28px 70px rgba(46, 58, 89, 0.25)',
        border: '2px solid rgba(255, 255, 255, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: isMobile ? 'calc(100vh - 110px)' : '88vh',
      }}
    >
      {/* Заголовок чата */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? 8 : 14,
          paddingBottom: isMobile ? 10 : 18,
          borderBottom: '2px solid #EEF1F7',
          marginBottom: isMobile ? 12 : 22,
        }}
      >
        <span style={{ fontSize: isMobile ? '1.4rem' : '2.2rem' }}>💡</span>
        <span
          style={{
            fontSize: isMobile
              ? 'clamp(1.05rem, 4vw, 1.3rem)'
              : 'clamp(1.6rem, 2.8vw, 2.4rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #F0C24B, #E8A317)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.01em',
          }}
        >
          Цифровая пятиминутка
        </span>
      </div>

      {/* Сообщения */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '0 2px' : '0 6px',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 12 : 20,
        }}
      >
        {messages.slice(0, visibleCount).map((msg, i) => (
          <MessageBubble
            key={`${msg.from}-${i}`}
            from={msg.from}
            text={msg.text}
            isLast={i === visibleCount - 1 && !typingDone}
            onTypingDone={() => setTypingDone(true)}
            isMobile={isMobile}
          />
        ))}

        {/* Вопрос с вариантами */}
        <AnimatePresence>
          {waitingForAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                alignSelf: 'center',
                maxWidth: '100%',
                background: '#F0F7FF',
                border: '2.5px solid #B8D4EE',
                borderRadius: isMobile ? 16 : 24,
                padding: isMobile ? 12 : 'clamp(20px, 2.5vh, 28px)',
                marginTop: 6,
                width: '100%',
              }}
            >
              <div
                style={{
                  fontSize: isMobile
                    ? 'clamp(0.95rem, 3.5vw, 1.1rem)'
                    : 'clamp(1.3rem, 1.9vw, 1.7rem)',
                  fontWeight: 800,
                  marginBottom: isMobile ? 10 : 18,
                  color: 'var(--text-dark)',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                ❓ {question.text}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? 8 : 14,
                }}
              >
                {question.options.map(opt => (
                  <motion.button
                    key={opt.id}
                    onClick={() => handleChoose(opt)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: isMobile
                        ? '10px 14px'
                        : 'clamp(16px, 2vh, 22px) clamp(20px, 3vw, 30px)',
                      borderRadius: isMobile ? 12 : 18,
                      background: 'white',
                      border: '3px solid #B8D4EE',
                      cursor: 'pointer',
                      fontSize: isMobile
                        ? 'clamp(0.88rem, 3.2vw, 1rem)'
                        : 'clamp(1.1rem, 1.6vw, 1.4rem)',
                      fontWeight: 700,
                      color: 'var(--text-dark)',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      transition: 'border-color 0.2s, background 0.2s',
                      boxShadow: '0 4px 12px rgba(74,144,226,0.1)',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#4A90E2'
                      e.currentTarget.style.background = '#EAF4FC'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#B8D4EE'
                      e.currentTarget.style.background = 'white'
                    }}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ответ Огонька */}
        <AnimatePresence>
          {selectedOption && showReply && (
            <MessageBubble
              from="ogonek"
              text={selectedOption.reply}
              isLast={true}
              onTypingDone={() => setTypingDone(true)}
              autoStart={true}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Кнопки управления */}
      <div
        style={{
          marginTop: isMobile ? 12 : 22,
          paddingTop: isMobile ? 12 : 20,
          borderTop: '2px solid #EEF1F7',
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? 10 : 14,
          minHeight: isMobile ? 60 : 96,
          alignItems: 'center',
        }}
      >
        {!allShown && (
          <Button
            onClick={handleNext}
            variant="primary"
            className="btn-xl"
            disabled={!typingDone && visibleCount > 0}
            style={{
              fontSize: isMobile ? '1rem' : '1.5rem',
              padding: isMobile ? '12px 28px' : '18px 48px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? 320 : 'none',
            }}
          >
            Далее →
          </Button>
        )}
        {waitingForAnswer && (
          <span
            style={{
              color: 'var(--text-soft)',
              fontSize: isMobile
                ? 'clamp(0.9rem, 3vw, 1.05rem)'
                : 'clamp(1.2rem, 1.6vw, 1.4rem)',
              alignSelf: 'center',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            👆 Выбери свой ответ
          </span>
        )}
        {selectedOption && showReply && typingDone && (
          <Button
            onClick={handleFinish}
            variant="primary"
            className="btn-xl"
            style={{
              fontSize: isMobile ? '1rem' : '1.5rem',
              padding: isMobile ? '12px 24px' : '18px 48px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? 320 : 'none',
            }}
          >
            Продолжить →
          </Button>
        )}
      </div>
    </div>
  )
}

function MessageBubble({ from, text, isLast, onTypingDone, autoStart = false, isMobile = false }) {
  const isPioneer = from === 'pioneer'
  const [typing, setTyping] = useState(autoStart || isLast)

  useEffect(() => {
    if (!isLast && !autoStart) {
      setTyping(false)
    }
  }, [isLast, autoStart])

  const avatar = isPioneer ? '/images/hero.png' : '/images/ogonek.png'
  const alt = isPioneer ? 'Пионер' : 'Огонёк'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: isMobile ? 8 : 14,
        flexDirection: isPioneer ? 'row-reverse' : 'row',
      }}
    >
      <img
        src={avatar}
        alt={alt}
        style={{
          width: isMobile ? 42 : 'clamp(72px, 6vw, 96px)',
          height: isMobile ? 42 : 'clamp(72px, 6vw, 96px)',
          objectFit: 'contain',
          flexShrink: 0,
          filter: 'drop-shadow(0 6px 12px rgba(46,58,89,0.2))',
        }}
        onError={e => (e.target.style.display = 'none')}
      />
      <div
        style={{
          maxWidth: isMobile ? '82%' : '76%',
          padding: isMobile
            ? '10px 14px'
            : 'clamp(16px, 2vh, 24px) clamp(22px, 2.5vw, 32px)',
          borderRadius: isPioneer
            ? isMobile ? '18px 18px 4px 18px' : '26px 26px 6px 26px'
            : isMobile ? '18px 18px 18px 4px' : '26px 26px 26px 6px',
          background: isPioneer
            ? 'linear-gradient(135deg, #4A90E2, #5BA8D4)'
            : 'linear-gradient(135deg, #FFF6DD, #FFEBA0)',
          color: isPioneer ? 'white' : 'var(--text-dark)',
          fontSize: isMobile
            ? 'clamp(0.9rem, 3.3vw, 1.05rem)'
            : 'clamp(1.15rem, 1.6vw, 1.45rem)',
          fontWeight: 600,
          lineHeight: 1.5,
          boxShadow: isPioneer
            ? '0 8px 22px rgba(74,144,226,0.35)'
            : '0 8px 22px rgba(240,194,75,0.4)',
          border: isPioneer ? 'none' : '3px solid #F5D77A',
        }}
      >
        {typing ? (
          <TypewriterText
            text={text}
            speed={isMobile ? 15 : 22}
            onComplete={() => {
              setTyping(false)
              if (onTypingDone) onTypingDone()
            }}
          />
        ) : (
          <span>{text}</span>
        )}
      </div>
    </motion.div>
  )
}