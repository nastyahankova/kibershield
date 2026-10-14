import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

const blocks = [
  {
    emoji: '💡',
    title: 'Идея проекта',
    color: '#4A90E2',
    bg: '#EAF4FC',
    text: '«КиберЩит: Остров Сокровищ» — интерактивная образовательная веб-игра по цифровой безопасности для школьников 5–8 классов. В игровой форме ребята знакомятся с правилами безопасного поведения в интернете, учатся защищать персональные данные, распознавать мошенников и противостоять кибербуллингу.',
  },
  {
    emoji: '🎯',
    title: 'Цель',
    color: '#4CB86C',
    bg: '#F0FBF5',
    text: 'Сформировать у подростков устойчивые навыки ответственного поведения в сети, научить защищать себя и близких от цифровых угроз, воспитать культуру безопасного общения в интернете.',
  },
  {
    emoji: '🎮',
    title: 'Особенности',
    color: '#9B6BC9',
    bg: '#F5F0FA',
    text: 'Сюжет-квест по острову сокровищ: девять увлекательных миссий и финальная битва с главным злодеем. Каждая миссия — новая игровая механика: от поиска поддельных писем и сортировки SMS до разоблачения двойников и настройки приватности. Ребята каждый раз решают новую задачу и получают новое знание.',
  },
  {
    emoji: '💬',
    title: 'Интерактив и наставничество',
    color: '#F5A623',
    bg: '#FFF7E6',
    text: 'Игрока сопровождает талисман БРПО — Огонёк. Он ведёт живой диалог с игроком, даёт подсказки и разбирает ошибки. После каждой миссии — «цифровая пятиминутка»: короткий практический совет, который ребёнок может применить в жизни.',
  },
  {
    emoji: '🏆',
    title: 'Финал',
    color: '#D4A02C',
    bg: '#FFF7E0',
    text: 'В финальной битве с Профессором Хаосом ребята применяют знания в новых ситуациях. Главное сокровище — не приз, а знания: «Ты защитил себя, свою семью и свою Родину».',
  },
  {
    emoji: '💻',
    title: 'Технические требования',
    color: '#5B6FE0',
    bg: '#EEF1FF',
    text: 'Игра разработана для использования на компьютерах, интерактивных досках и мультибордах — на большом экране весь контент читается издалека и удобно кликается. Также реализована адаптивная версия для смартфонов и планшетов: интерфейс упрощён, персонажи и карта сокровищ адаптированы под маленький экран. Для запуска достаточно любого современного браузера и подключения к интернету.',
  },
]

export default function AboutScreen() {
  const navigate = useNavigate()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'var(--grad-bg)',
        position: 'relative',
        padding: isMobile ? '14px 12px 24px' : 'clamp(16px, 2vh, 32px)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {/* Радужные полосы */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #A8D8EA, #A5E0B8, #FFEBA0, #FFCC91, #FFA8A8, #C8A8EB)', zIndex: 100 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #C8A8EB, #FFA8A8, #FFCC91, #FFEBA0, #A5E0B8, #A8D8EA)', zIndex: 100 }} />

      {/* Логотип БРПО */}
      <img
        src="/images/brpo-logo.png"
        alt="БРПО"
        style={{
          position: 'fixed',
          top: isMobile ? 14 : 16,
          left: isMobile ? 12 : 16,
          height: isMobile
            ? 'clamp(60px, 10vh, 90px)'
            : 'clamp(140px, 20vh, 220px)',
          objectFit: 'contain',
          zIndex: 200,
          filter: 'drop-shadow(0 8px 18px rgba(46, 58, 89, 0.2))',
          pointerEvents: 'none',
        }}
        onError={e => (e.target.style.display = 'none')}
      />

      {/* Кнопка «На главную» */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: isMobile ? 14 : 22,
          right: isMobile ? 12 : 22,
          height: isMobile ? 44 : 58,
          padding: isMobile ? '0 16px' : '0 26px 0 22px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.95)',
          border: '2.5px solid var(--pastel-blue)',
          boxShadow: '0 6px 18px rgba(46, 58, 89, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: isMobile ? '0.9rem' : '1.15rem',
          fontWeight: 700,
          color: 'var(--text-dark)',
          fontFamily: 'inherit',
          zIndex: 200,
          transition: 'transform 0.15s ease, border-color 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.borderColor = 'var(--accent-blue)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.borderColor = 'var(--pastel-blue)'
        }}
      >
        <span style={{ fontSize: isMobile ? '1.1rem' : '1.4rem' }}>🏠</span>
        {!isMobile && <span>На главную</span>}
      </button>

      {/* Огонёк — только большие экраны */}
      {!isMobile && (
        <img
          src="/images/ogonek.png"
          alt="Огонёк"
          style={{
            position: 'fixed',
            bottom: 8,
            right: 8,
            height: 'clamp(240px, 36vh, 400px)',
            objectFit: 'contain',
            zIndex: 5,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 14px 28px rgba(46, 58, 89, 0.28))',
          }}
          onError={e => (e.target.style.display = 'none')}
        />
      )}

      {/* Основная карточка */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : 1000,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(14px)',
          borderRadius: isMobile ? 22 : 32,
          padding: isMobile
            ? '20px 16px'
            : 'clamp(24px, 4vh, 44px) clamp(24px, 4vw, 56px)',
          boxShadow: '0 24px 60px rgba(46, 58, 89, 0.18)',
          border: '2px solid rgba(255, 255, 255, 0.95)',
          marginTop: isMobile ? 70 : 'clamp(20px, 4vh, 50px)',
          marginBottom: isMobile ? 20 : 'clamp(180px, 28vh, 300px)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 20 : 28 }}>
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            style={{
              fontSize: isMobile ? '2rem' : 'clamp(2.5rem, 5vw, 4rem)',
              marginBottom: 4,
            }}
          >
            🛡️
          </motion.div>
          <h1
            style={{
              fontSize: isMobile ? '1.6rem' : 'clamp(2rem, 4vw, 3rem)',
              background: 'linear-gradient(135deg, #4A90E2, #9B6BC9, #EE85B5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              marginBottom: 6,
              fontWeight: 900,
            }}
          >
            О проекте
          </h1>
          <p
            style={{
              fontSize: isMobile ? '0.95rem' : 'clamp(1.05rem, 1.5vw, 1.25rem)',
              color: 'var(--text-soft)',
              margin: 0,
              fontWeight: 700,
            }}
          >
            КиберЩит: Остров Сокровищ
          </p>
        </div>

        {/* Блоки информации */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 12 : 18,
          }}
        >
          {blocks.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              style={{
                display: 'flex',
                gap: isMobile ? 10 : 18,
                padding: isMobile ? 14 : 'clamp(16px, 2.5vh, 22px)',
                background: block.bg,
                borderRadius: isMobile ? 16 : 20,
                borderLeft: `${isMobile ? 4 : 6}px solid ${block.color}`,
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? '1.5rem' : 'clamp(2rem, 3vw, 2.6rem)',
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {block.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    color: block.color,
                    margin: 0,
                    marginBottom: isMobile ? 4 : 8,
                    fontSize: isMobile ? '1rem' : 'clamp(1.15rem, 1.7vw, 1.4rem)',
                    fontWeight: 800,
                  }}
                >
                  {block.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: isMobile ? '0.88rem' : 'clamp(1rem, 1.25vw, 1.15rem)',
                    color: 'var(--text-dark)',
                    lineHeight: isMobile ? 1.5 : 1.6,
                    fontWeight: 600,
                  }}
                >
                  {block.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* В рамках чего */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: isMobile ? 14 : 20,
            padding: isMobile ? 14 : 'clamp(18px, 2.5vh, 24px)',
            background: 'linear-gradient(135deg, #F0F7FF, #EAF4FC)',
            borderRadius: isMobile ? 16 : 20,
            border: '2px dashed #B8D4EE',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: isMobile ? 8 : 12,
            }}
          >
            <span style={{ fontSize: isMobile ? '1.4rem' : '1.8rem' }}>📋</span>
            <h3
              style={{
                color: '#2A6CC0',
                margin: 0,
                fontSize: isMobile ? '0.98rem' : 'clamp(1.1rem, 1.55vw, 1.3rem)',
                fontWeight: 800,
              }}
            >
              В рамках чего разработан проект
            </h3>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: isMobile ? '0.85rem' : 'clamp(1rem, 1.25vw, 1.12rem)',
              color: 'var(--text-dark)',
              lineHeight: isMobile ? 1.5 : 1.6,
              fontWeight: 600,
            }}
          >
            Игра разработана в рамках <b>Республиканского конкурса на разработку
            методических и игровых материалов</b>, направленных на реализацию
            программ <b>«Я. Моя семья. Моя Родина»</b> и <b>«Шефская вертикаль:
            от октябрёнка до лидеров БРСМ»</b>.
          </p>
          <p
            style={{
              margin: isMobile ? '8px 0 0' : '12px 0 0',
              fontSize: isMobile ? '0.82rem' : 'clamp(0.95rem, 1.2vw, 1.08rem)',
              color: 'var(--text-soft)',
              lineHeight: 1.55,
              fontWeight: 600,
            }}
          >
            <b style={{ color: '#2A6CC0' }}>Номинация:</b> «КиберЩит». Разработки
            занятий, интерактивных игр, кейс-турниров и профилактических акций
            по цифровой безопасности для детей и подростков.
          </p>
        </motion.div>

        {/* Автор */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: isMobile ? 14 : 20,
            padding: isMobile ? 14 : 'clamp(16px, 2.5vh, 22px)',
            background: 'linear-gradient(135deg, #FFF7E6, #FFEFC7)',
            borderRadius: isMobile ? 16 : 20,
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 12 : 16,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: isMobile ? 48 : 60,
              height: isMobile ? 48 : 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFE082, #F5C242)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '1.4rem' : '1.8rem',
              flexShrink: 0,
            }}
          >
            👩‍🏫
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                fontSize: isMobile ? '0.7rem' : '0.8rem',
                color: 'var(--text-soft)',
                fontWeight: 800,
                letterSpacing: '0.05em',
                marginBottom: 4,
              }}
            >
              АВТОР ПРОЕКТА
            </div>
            <div
              style={{
                fontSize: isMobile ? '0.95rem' : 'clamp(1.05rem, 1.4vw, 1.2rem)',
                fontWeight: 800,
                color: 'var(--text-dark)',
                lineHeight: 1.35,
              }}
            >
              Понкратова Анастасия Александровна
            </div>
            <div
              style={{
                fontSize: isMobile ? '0.8rem' : 'clamp(0.9rem, 1.15vw, 1rem)',
                color: 'var(--text-soft)',
                marginTop: 2,
                fontWeight: 600,
              }}
            >
              учитель информатики ГУО «Средняя школа № 1 г. Горки»
            </div>
          </div>
        </motion.div>

        {/* Кнопки внизу */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: isMobile ? 18 : 28,
            gap: isMobile ? 10 : 14,
            flexWrap: 'wrap',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="btn-xl"
            style={{
              background: 'linear-gradient(135deg, #4A90E2, #9B6BC9)',
              color: 'white',
              fontSize: isMobile ? '1rem' : '1.3rem',
              padding: isMobile ? '14px 24px' : '18px 44px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? 340 : 'none',
            }}
          >
            🏠 На главную
          </Button>
          <Button
            onClick={() => navigate('/map')}
            variant="secondary"
            className="btn-xl"
            style={{
              fontSize: isMobile ? '1rem' : '1.2rem',
              padding: isMobile ? '14px 24px' : '18px 36px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? 340 : 'none',
            }}
          >
            🗺 К карте
          </Button>
        </motion.div>
      </motion.div>

      {!isMobile && (
        <div style={{ height: 'clamp(180px, 30vh, 320px)', flexShrink: 0 }} />
      )}
    </div>
  )
}