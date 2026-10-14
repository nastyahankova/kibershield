import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function MemoScreen() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/memo.pdf'
    link.download = 'Памятка-пионеру.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'var(--grad-bg)',
        position: 'relative',
        padding: isMobile ? '70px 12px 20px' : '80px 24px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Радужные полосы */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #A8D8EA, #A5E0B8, #FFEBA0, #FFCC91, #FFA8A8, #C8A8EB)', zIndex: 100 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #C8A8EB, #FFA8A8, #FFCC91, #FFEBA0, #A5E0B8, #A8D8EA)', zIndex: 100 }} />

      {/* Логотип БРПО — левый верхний */}
      <img
        src="/images/brpo-logo.png"
        alt="БРПО"
        style={{
          position: 'fixed',
          top: isMobile ? 12 : 20,
          left: isMobile ? 12 : 24,
          height: isMobile ? 'clamp(60px, 10vh, 90px)' : 'clamp(80px, 12vh, 140px)',
          objectFit: 'contain',
          zIndex: 30,
          filter: 'drop-shadow(0 6px 14px rgba(46, 58, 89, 0.2))',
          pointerEvents: 'none',
        }}
        onError={e => (e.target.style.display = 'none')}
      />

      {/* Кнопка «Назад» — правый верхний */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'fixed',
          top: isMobile ? 12 : 22,
          right: isMobile ? 12 : 24,
          height: isMobile ? 44 : 52,
          padding: isMobile ? '0 16px' : '0 22px 0 18px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.95)',
          border: '2.5px solid var(--pastel-blue)',
          boxShadow: '0 6px 18px rgba(46, 58, 89, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: isMobile ? '0.9rem' : '1.05rem',
          fontWeight: 700,
          color: 'var(--text-dark)',
          fontFamily: 'inherit',
          zIndex: 30,
        }}
      >
        <span style={{ fontSize: isMobile ? '1.1rem' : '1.3rem' }}>←</span>
        <span>{isMobile ? '' : 'Назад'}</span>
      </button>

      {/* Заголовок */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: isMobile ? '1.4rem' : 'clamp(1.8rem, 3vw, 2.4rem)',
          background: 'linear-gradient(135deg, #4A90E2, #9B6BC9, #EE85B5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          marginBottom: 6,
          textAlign: 'center',
          fontWeight: 900,
          zIndex: 10,
        }}
      >
        📘 Памятка пионеру
      </motion.h1>

      {/* Подсказка */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{
          fontSize: isMobile ? '0.9rem' : '1.05rem',
          color: 'var(--text-soft)',
          margin: 0,
          marginBottom: 16,
          textAlign: 'center',
          fontWeight: 700,
          zIndex: 10,
        }}
      >
        12 правил цифровой безопасности
      </motion.p>

      {/* Просмотрщик PDF */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          width: '100%',
          maxWidth: 950,
          height: isMobile ? '55vh' : '70vh',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(46, 58, 89, 0.25)',
          border: '3px solid rgba(255, 255, 255, 0.95)',
          overflow: 'hidden',
          marginBottom: 20,
          zIndex: 10,
        }}
      >
        <iframe
          src="/memo.pdf#view=FitH"
          title="Памятка пионеру"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        >
          {/* Fallback для старых браузеров */}
          <p style={{ padding: 20 }}>
            Ваш браузер не поддерживает просмотр PDF.
            <a href="/memo.pdf" download>Скачайте памятку</a>.
          </p>
        </iframe>
      </motion.div>

      {/* Кнопки управления */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <button
          onClick={handleDownload}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: isMobile ? '14px 28px' : '18px 44px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #4CB86C, #2A8B4E)',
            color: 'white',
            fontSize: isMobile ? '1.05rem' : '1.25rem',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 8px 22px rgba(76, 184, 108, 0.4)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            minHeight: 48,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(76, 184, 108, 0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 22px rgba(76, 184, 108, 0.4)'
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>📥</span>
          <span>Скачать памятку</span>
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: isMobile ? '14px 28px' : '18px 40px',
            borderRadius: 999,
            background: 'white',
            color: 'var(--text-dark)',
            fontSize: isMobile ? '1.05rem' : '1.2rem',
            fontWeight: 800,
            border: '2.5px solid var(--pastel-blue)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 6px 18px rgba(46, 58, 89, 0.12)',
            transition: 'transform 0.15s ease',
            minHeight: 48,
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <span style={{ fontSize: '1.3rem' }}>🏠</span>
          <span>На главную</span>
        </button>
      </motion.div>
    </div>
  )
}