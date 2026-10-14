import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { useSound } from '../context/SoundContext.jsx'

export default function CertificateScreen() {
  const navigate = useNavigate()
  const { playSuccess } = useSound()
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const certRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kibershield_certificate_name')
      if (saved) {
        setName(saved)
        setSubmitted(true)
      }
    } catch {}
  }, [])

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    setSubmitted(true)
    playSuccess()
    try {
      localStorage.setItem('kibershield_certificate_name', trimmed)
    } catch {}
  }

  // Авто-размер шрифта
  const getNameFontSize = (nameText) => {
    const len = nameText.trim().length
    if (len <= 10) return { mobile: '1rem', desktop: '1.25rem' }
    if (len <= 14) return { mobile: '0.95rem', desktop: '1.2rem' }
    if (len <= 18) return { mobile: '0.9rem', desktop: '1.15rem' }
    if (len <= 22) return { mobile: '0.85rem', desktop: '1.1rem' }
    if (len <= 26) return { mobile: '0.8rem', desktop: '1.05rem' }
    if (len <= 30) return { mobile: '0.75rem', desktop: '1rem' }
    return { mobile: '0.7rem', desktop: '0.95rem' }
  }

  const nameFontSize = getNameFontSize(name)

  // ============ СКАЧИВАНИЕ PDF (jspdf + html2canvas) ============
  const handleDownloadPDF = async () => {
    if (!certRef.current || isGenerating) return
    setIsGenerating(true)

    try {
      const element = certRef.current

      // 1) Делаем скриншот блока в высоком разрешении
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFF9EC',
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.98)

      // 2) Создаём PDF формата A4 (210×297 мм)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()   // 210 мм
      const pdfHeight = pdf.internal.pageSize.getHeight() // 297 мм

      // 3) Считаем размеры картинки, чтобы вписать в A4, сохраняя пропорции
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Центрируем по вертикали (если картинка ниже 297 мм)
      const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0

      // 4) Помещаем картинку на страницу
      pdf.addImage(imgData, 'JPEG', 0, yOffset, imgWidth, imgHeight)

      // 5) Сохраняем с красивым именем
      const safeName = name
        .trim()
        .replace(/[^\wа-яёА-ЯЁ\s-]/g, '')
        .replace(/\s+/g, '-')
      const filename = `Грамота-${safeName || 'пионер'}.pdf`

      pdf.save(filename)
    } catch (err) {
      console.error('Ошибка при создании PDF:', err)
      alert('Не получилось создать PDF. Попробуйте ещё раз.')
    } finally {
      setIsGenerating(false)
    }
  }

  // ============ ЭКРАН ВВОДА ИМЕНИ ============
  if (!submitted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: 'var(--grad-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '60px 16px 20px' : '40px 24px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #A8D8EA, #A5E0B8, #FFEBA0, #FFCC91, #FFA8A8, #C8A8EB)', zIndex: 100 }} />
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #C8A8EB, #FFA8A8, #FFCC91, #FFEBA0, #A5E0B8, #A8D8EA)', zIndex: 100 }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            maxWidth: 640,
            width: '100%',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(14px)',
            borderRadius: 32,
            padding: isMobile ? '24px 20px' : '40px 48px',
            boxShadow: '0 24px 60px rgba(46, 58, 89, 0.22)',
            border: '3px solid white',
            textAlign: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <motion.img
            src="/images/ogonek.png"
            alt="Огонёк"
            animate={{ y: [0, -12, 0], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              height: isMobile ? 'clamp(120px, 20vh, 180px)' : 'clamp(160px, 25vh, 240px)',
              objectFit: 'contain',
              marginBottom: 16,
              filter: 'drop-shadow(0 10px 20px rgba(46, 58, 89, 0.25))',
            }}
            onError={e => (e.target.style.display = 'none')}
          />

          <h1
            style={{
              fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem, 3vw, 2.4rem)',
              background: 'linear-gradient(135deg, #4A90E2, #9B6BC9, #EE85B5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              marginBottom: 12,
              fontWeight: 900,
            }}
          >
            🏆 Ты победил!
          </h1>

          <p
            style={{
              fontSize: isMobile ? '1rem' : 'clamp(1.1rem, 1.5vw, 1.3rem)',
              color: 'var(--text-dark)',
              lineHeight: 1.55,
              margin: 0,
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            Хаос повержен, клад найден, а знания — с тобой навсегда! 💛
            <br />
            Напиши своё имя и фамилию, чтобы получить грамоту:
          </p>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Имя и фамилия"
            maxLength={40}
            autoFocus
            style={{
              width: '100%',
              padding: isMobile ? '14px 18px' : '16px 22px',
              borderRadius: 16,
              border: '3px solid var(--pastel-blue)',
              fontSize: isMobile ? '1.1rem' : '1.25rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              color: 'var(--text-dark)',
              background: 'white',
              textAlign: 'center',
              outline: 'none',
              boxShadow: '0 6px 18px rgba(46, 58, 89, 0.08)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxSizing: 'border-box',
              marginBottom: 16,
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--accent-blue)'
              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(74, 144, 226, 0.15)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'var(--pastel-blue)'
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(46, 58, 89, 0.08)'
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: isMobile ? '14px 28px' : '16px 40px',
              borderRadius: 999,
              background: name.trim()
                ? 'linear-gradient(135deg, #4CB86C, #2A8B4E)'
                : '#C5CCDA',
              color: 'white',
              fontSize: isMobile ? '1.05rem' : '1.2rem',
              fontWeight: 800,
              border: 'none',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              boxShadow: name.trim() ? '0 8px 22px rgba(76, 184, 108, 0.4)' : 'none',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              minHeight: 48,
              width: '100%',
              maxWidth: 340,
            }}
            onMouseEnter={e => {
              if (name.trim()) e.currentTarget.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>🎓</span>
            <span>Получить грамоту</span>
          </button>

          <div style={{ marginTop: 14 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-soft)',
                fontSize: '0.9rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: 'inherit',
                padding: 8,
              }}
            >
              ← На главную
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ============ ЭКРАН ГРАМОТЫ ============
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'var(--grad-bg)',
        padding: isMobile ? '60px 12px 20px' : '40px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #A8D8EA, #A5E0B8, #FFEBA0, #FFCC91, #FFA8A8, #C8A8EB)', zIndex: 100 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #C8A8EB, #FFA8A8, #FFCC91, #FFEBA0, #A5E0B8, #A8D8EA)', zIndex: 100 }} />

      <button
        onClick={() => setSubmitted(false)}
        style={{
          position: 'fixed',
          top: isMobile ? 12 : 22,
          left: isMobile ? 12 : 22,
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
        <span>{isMobile ? '' : 'Изменить имя'}</span>
      </button>

      {/* ГРАМОТА */}
      <motion.div
        ref={certRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : 'min(800px, calc((100vh - 220px) * 0.707))',
          background: 'white',
          borderRadius: isMobile ? 16 : 24,
          boxShadow: '0 30px 80px rgba(46, 58, 89, 0.3)',
          overflow: 'hidden',
          position: 'relative',
          marginTop: isMobile ? 60 : 20,
          marginBottom: 20,
          zIndex: 10,
        }}
      >
        <img
          src="/certificate-template.png"
          alt="Грамота"
          crossOrigin="anonymous"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
          onError={e => (e.target.style.display = 'none')}
        />

        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: '"Russo One", "Montserrat", sans-serif',
              fontSize: isMobile ? nameFontSize.mobile : nameFontSize.desktop,
              fontWeight: 900,
              color: '#E67E22',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </div>
        </div>
      </motion.div>

      {/* Кнопки */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: isMobile ? '14px 28px' : '18px 44px',
            borderRadius: 999,
            background: isGenerating
              ? '#C5CCDA'
              : 'linear-gradient(135deg, #4CB86C, #2A8B4E)',
            color: 'white',
            fontSize: isMobile ? '1.05rem' : '1.25rem',
            fontWeight: 800,
            border: 'none',
            cursor: isGenerating ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: isGenerating ? 'none' : '0 8px 22px rgba(76, 184, 108, 0.4)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            minHeight: 48,
          }}
          onMouseEnter={e => {
            if (!isGenerating) e.currentTarget.style.transform = 'translateY(-3px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>{isGenerating ? '⏳' : '📥'}</span>
          <span>{isGenerating ? 'Создаём PDF…' : 'Скачать грамоту (PDF)'}</span>
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

      <p
        style={{
          fontSize: isMobile ? '0.85rem' : '0.95rem',
          color: 'var(--text-soft)',
          marginTop: 16,
          textAlign: 'center',
          maxWidth: 500,
          zIndex: 10,
        }}
      >
        💡 Нажми «📥 Скачать грамоту (PDF)» — файл PDF с твоим именем
        сохранится на компьютер. Можно распечатать или отправить родителям.
      </p>
    </div>
  )
}