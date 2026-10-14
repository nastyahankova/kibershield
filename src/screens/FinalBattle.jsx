import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import ChatDialog from '../components/ui/ChatDialog.jsx'
import { useSound } from '../context/SoundContext.jsx'

// ============ Щиты Хаоса ============
const shields = [
  {
    id: 1,
    emoji: '📱',
    title: 'Щит «Взлом друга»',
    situation: 'Ты получил сообщение от друга: «Привет! Это мой новый аккаунт, старый заблокировали. Дай в долг 200 рублей, верну завтра». Что делать?',
    options: [
      { id: 'a', text: 'Перевести 200 рублей — это же друг', correct: false, wrongReason: 'Взломанные аккаунты часто просят денег от имени друзей. Если переведёшь — деньги уйдут мошенникам.' },
      { id: 'b', text: 'Позвонить другу по телефону и уточнить', correct: true, rightReason: 'Правильно! Живой звонок — самый надёжный способ проверить, действительно ли это твой друг.' },
      { id: 'c', text: 'Добавить в друзья и написать в чат', correct: false, wrongReason: 'Если это мошенник — он будет отвечать от имени друга. Нельзя верить переписке, нужен живой контакт.' },
      { id: 'd', text: 'Ответить: «Что случилось?» — и ждать', correct: false, wrongReason: 'Мошенник может придумать любую историю. Лучше позвонить другу и проверить лично.' },
    ],
  },
  {
    id: 2,
    emoji: '🔗',
    title: 'Щит «Ссылка из комментария»',
    situation: 'Под видео на YouTube кто-то написал: «Бесплатные скины для игры! Жми → free-skins.xyz». Что делать?',
    options: [
      { id: 'a', text: 'Перейти — вдруг правда', correct: false, wrongReason: 'По таким ссылкам обычно крадут аккаунты или заражают устройства вирусами.' },
      { id: 'b', text: 'Скачать и проверить, что там', correct: false, wrongReason: 'Скачивать файлы с незнакомых сайтов опасно — там могут быть вирусы.' },
      { id: 'c', text: 'Не переходить и отметить как спам', correct: true, rightReason: 'Правильно! Ссылки в комментариях — почти всегда мошенничество. Жми «Пожаловаться — спам».' },
      { id: 'd', text: 'Скинуть ссылку друзьям', correct: false, wrongReason: 'Так ты распространишь мошенническую ссылку. Друзья могут пострадать.' },
    ],
  },
  {
    id: 3,
    emoji: '📋',
    title: 'Щит «Странный опрос»',
    situation: 'В классном чате кто-то с незнакомого номера пишет: «Привет! Мы проводим опрос от школы. Напишите ваш адрес, номер телефона и имена родителей». Что делать?',
    options: [
      { id: 'a', text: 'Ответить всё, раз это от школы', correct: false, wrongReason: 'Школы не собирают личные данные через незнакомые номера. Это мошенники.' },
      { id: 'b', text: 'Ответить только адрес', correct: false, wrongReason: 'Даже один адрес — уже опасно. По нему можно вычислить, где ты живёшь.' },
      { id: 'c', text: 'Ответить только имя', correct: false, wrongReason: 'Имя — тоже личные данные, но главное — сам факт ответа мошеннику. Лучше не отвечать.' },
      { id: 'd', text: 'Не отвечать и показать сообщение учителю', correct: true, rightReason: 'Правильно! Учитель подтвердит — это не от школы. Незнакомца нужно заблокировать.' },
    ],
  },
  {
    id: 4,
    emoji: '🎮',
    title: 'Щит «Незнакомец в игре»',
    situation: 'В онлайн-игре незнакомый игрок предлагает тебе «крутые скины бесплатно». Он просит зайти на его сайт и ввести логин и пароль от игрового аккаунта. Что делать?',
    options: [
      { id: 'a', text: 'Ввести — это же просто игра', correct: false, wrongReason: 'Пароль от игрового аккаунта — как ключ от дома. Если его украдут, потеряешь и аккаунт, и всё в нём.' },
      { id: 'b', text: 'Ввести и сразу сменить пароль', correct: false, wrongReason: 'Сменить пароль не поможет — данные уже у мошенника. А бесплатных скинов ты всё равно не получишь.' },
      { id: 'c', text: 'Отказаться и не вводить пароль', correct: true, rightReason: 'Правильно! Бесплатные скины — приманка. Настоящие скины дают только внутри игры.' },
      { id: 'd', text: 'Спросить у него ещё скинов', correct: false, wrongReason: 'Чем дольше общаешься с мошенником, тем больше он пытается тебя обмануть. Лучше заблокировать.' },
    ],
  },
  {
    id: 5,
    emoji: '💰',
    title: 'Щит «Слишком щедро»',
    situation: 'На сайте «новостей» пишут: «Правительство раздаёт 500 рублей школьникам! Перейдите и введите данные карты родителей». Что делать?',
    options: [
      { id: 'a', text: 'Перейти и ввести данные', correct: false, wrongReason: 'Это классическая схема мошенников. Введёшь данные карты — потеряете деньги.' },
      { id: 'b', text: 'Спросить у родителей разрешения', correct: false, wrongReason: 'Даже с разрешения родителей вводить данные карты по чужой ссылке нельзя. Это мошенничество.' },
      { id: 'c', text: 'Не верить и не вводить данные', correct: true, rightReason: 'Правильно! Настоящие выплаты не раздают по ссылке с требованием данных карты. Никогда не вводи их.' },
      { id: 'd', text: 'Проверить эту новость на другом сайте', correct: false, wrongReason: 'Проверять новости — хорошо, но данные карты нельзя вводить ни при каких условиях. Если просят — это мошенничество.' },
    ],
  },
]

// ============ Диалог перед битвой ============
const introMessages = [
  { from: 'pioneer', text: 'Ну вот мы и дошли до логова Профессора Хаоса!' },
  { from: 'ogonek', text: 'Осторожно, пионер! Он хитрый. Я чувствую, что он приготовил 5 магических щитов — по одному на каждую тему, которую мы прошли.' },
  { from: 'pioneer', text: 'Ничего! Я прошёл все 9 локаций и готов применить свои знания!' },
]

const introQuestion = {
  text: 'Профессор Хаос: «Ха-ха! Думаешь, справишься? Как ты собираешься побеждать?»',
  options: [
    { id: 'fight', label: '💪 Силой!', reply: 'Хаос смеётся: «Сила тут не поможет, глупец! Только знания!» Но ты всё равно не сдаёшься.' },
    { id: 'knowledge', label: '🧠 Знаниями, которые я получил!', reply: 'Хаос замирает: «Хм… А это уже интересно. Посмотрим, чему ты научился.»' },
    { id: 'friends', label: '🤝 С помощью Огонька!', reply: 'Огонёк подбадривает: «Я всегда рядом!» Хаос шипит: «Вы всё равно проиграете!»' },
  ],
}

const ACCENT = '#6B3FA0'
const ACCENT_DARK = '#4A1F7A'
const DANGER = '#C02942'
const SAFE = '#4CB86C'

// ============ Кнопка «На карту» ============
function BackToMapButton({ navigate }) {
  return (
    <button
      onClick={() => navigate('/map')}
      style={{
        position: 'fixed',
        top: 22,
        left: 22,
        height: 52,
        padding: '0 22px 0 18px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.95)',
        border: '2.5px solid var(--pastel-blue)',
        boxShadow: '0 6px 18px rgba(46, 58, 89, 0.15)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: '1.05rem',
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
      <span style={{ fontSize: '1.3rem' }}>🗺</span>
      <span>На карту</span>
    </button>
  )
}

export default function FinalBattle() {
  const navigate = useNavigate()
  const { playBattleMusic, playMainMusic, playSuccess, playFail } = useSound()

  const [stage, setStage] = useState('intro')
  const [currentShield, setCurrentShield] = useState(0)
  const [brokenShields, setBrokenShields] = useState([])
  const [hp, setHp] = useState(3)
  const [lastAttempt, setLastAttempt] = useState(null)
  const [attemptResult, setAttemptResult] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [gameWin, setGameWin] = useState(false)

  const explanationRef = useRef(null)

  // Боевая музыка при входе, обычная при выходе
  useEffect(() => {
    playBattleMusic()
    return () => {
      playMainMusic()
    }
  }, [])

  // Автоскролл к разбору
  useEffect(() => {
    if (attemptResult && explanationRef.current) {
      setTimeout(() => {
        const rect = explanationRef.current.getBoundingClientRect()
        const y = rect.top + window.scrollY - 80
        window.scrollTo({ top: y, behavior: 'smooth' })
      }, 200)
    }
  }, [attemptResult])

  const shield = shields[currentShield]

  const handleAnswer = (option) => {
    if (attemptResult === 'correct' || gameOver || gameWin) return

    if (option.correct) {
      playSuccess()
      setLastAttempt({ optionId: option.id, correct: true, reason: option.rightReason })
      setAttemptResult('correct')
      setBrokenShields([...brokenShields, shield.id])
    } else {
      playFail()
      setLastAttempt({ optionId: option.id, correct: false, reason: option.wrongReason })
      setAttemptResult('wrong')
      const newHp = hp - 1
      setHp(newHp)
      if (newHp <= 0) {
        setTimeout(() => setGameOver(true), 900)
      }
    }
  }

  const handleTryAgain = () => {
    setLastAttempt(null)
    setAttemptResult(null)
  }

  const handleNextShield = () => {
    if (brokenShields.length === shields.length) {
      setGameWin(true)
      setTimeout(() => setStage('victory'), 1200)
      return
    }
    const nextIndex = shields.findIndex(s => !brokenShields.includes(s.id))
    if (nextIndex !== -1) {
      setCurrentShield(nextIndex)
      setLastAttempt(null)
      setAttemptResult(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleRetry = () => {
    setCurrentShield(0)
    setBrokenShields([])
    setHp(3)
    setLastAttempt(null)
    setAttemptResult(null)
    setGameOver(false)
    setGameWin(false)
  }

  const handleFinale = () => {
    navigate('/treasure')
  }

  // ============ СТАДИЯ 1: Диалог ============
  if (stage === 'intro') {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: 'radial-gradient(circle at 50% 20%, #4A1F7A 0%, #2D1B4E 40%, #1A0F2E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(16px, 2vh, 32px)',
          boxSizing: 'border-box',
        }}
      >
        <BackToMapButton navigate={navigate} />
        <div style={{ width: '100%', maxWidth: 1000, display: 'flex', justifyContent: 'center' }}>
          <ChatDialog
            messages={introMessages}
            question={introQuestion}
            onComplete={() => setStage('battle')}
          />
        </div>
      </div>
    )
  }

  // ============ СТАДИЯ 3: Победа ============
  if (stage === 'victory') {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: 'radial-gradient(circle at 50% 20%, #4A1F7A 0%, #2D1B4E 40%, #1A0F2E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <BackToMapButton navigate={navigate} />

        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.1 }}
            style={{
              position: 'absolute',
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              fontSize: '1rem',
              color: 'white',
            }}
          >
            ✨
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
            borderRadius: 32,
            padding: 'clamp(30px, 5vh, 50px)',
            maxWidth: 800,
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 30px 80px rgba(107, 63, 160, 0.4)',
            border: '3px solid white',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <motion.div
            animate={{ rotate: [0, -15, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5 }}
            style={{ fontSize: 'clamp(4rem, 9vw, 7rem)', marginBottom: 12 }}
          >
            🏆
          </motion.div>
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              background: 'linear-gradient(135deg, #6B3FA0, #B03A5B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 16,
            }}
          >
            Профессор Хаос побеждён!
          </h1>
          <p style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)', color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: 28 }}>
            Ты разбил все 5 магических щитов, применив знания о безопасности.
            Хаос разоружён! Путь к главному сокровищу свободен.
          </p>
          <Button
            onClick={handleFinale}
            variant="primary"
            className="btn-xl"
            style={{
              background: 'linear-gradient(135deg, #6B3FA0, #B03A5B)',
              color: 'white',
              fontSize: '1.4rem',
              padding: '20px 48px',
            }}
          >
            🎁 Открыть сундук →
          </Button>
        </motion.div>
      </div>
    )
  }

  // ============ СТАДИЯ 2: Битва ============
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(circle at 50% 20%, #4A1F7A 0%, #2D1B4E 40%, #1A0F2E 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 2vh, 32px)',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BackToMapButton navigate={navigate} />

      {/* Мистические звёзды */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{ opacity: [0.15, 0.8, 0.15], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.15 }}
          style={{
            position: 'absolute',
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            fontSize: '0.8rem',
            color: 'white',
            pointerEvents: 'none',
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Магические искры */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            bottom: `${(i * 23) % 60}%`,
            left: `${(i * 31) % 100}%`,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#B03A5B',
            boxShadow: '0 0 12px #B03A5B, 0 0 24px #6B3FA0',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Тёмный вихрь */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(600px, 80vw)',
          height: 'min(600px, 80vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(176,58,91,0.25) 0%, rgba(107,63,160,0.15) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Профессор Хаос */}
      <div style={{ position: 'relative', marginBottom: 12, zIndex: 5 }}>
        <motion.img
          src="/images/10-chaos.png"
          alt="Профессор Хаос"
          animate={
            attemptResult === 'wrong'
              ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
              : attemptResult === 'correct'
              ? { scale: [1, 0.9, 1], rotate: [0, 3, -3, 0] }
              : { y: [0, -8, 0] }
          }
          transition={
            attemptResult
              ? { duration: 0.6 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{
            height: 'clamp(140px, 22vh, 260px)',
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 40px rgba(107, 63, 160, 0.5))',
          }}
          onError={e => (e.target.style.display = 'none')}
        />
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            gap: 6,
            justifyContent: 'center',
          }}
        >
          {shields.map(s => (
            <motion.div
              key={s.id}
              animate={{
                scale: brokenShields.includes(s.id) ? [1, 1.4, 0] : 1,
                opacity: brokenShields.includes(s.id) ? 0 : 1,
              }}
              transition={{ duration: 0.5 }}
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: 'linear-gradient(135deg, #B03A5B, #6B3FA0)',
                boxShadow: '0 0 12px rgba(176, 58, 91, 0.6)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Карточка текущего щита */}
      <AnimatePresence mode="wait">
        {!gameOver && !gameWin && (
          <motion.div
            key={shield.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(14px)',
              borderRadius: 28,
              padding: 'clamp(20px, 3.5vh, 36px)',
              maxWidth: 950,
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
              border: `3px solid ${ACCENT}`,
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: '2.2rem' }}>{shield.emoji}</span>
              <h2
                style={{
                  fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)',
                  color: ACCENT_DARK,
                  margin: 0,
                }}
              >
                {shield.title}
              </h2>
            </div>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.5vw, 1.3rem)',
                lineHeight: 1.55,
                textAlign: 'center',
                color: 'var(--text-dark)',
                marginBottom: 24,
                padding: '12px 20px',
                background: '#F5F0FA',
                borderRadius: 14,
                borderLeft: `5px solid ${ACCENT}`,
              }}
            >
              {shield.situation}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 12,
              }}
            >
              {shield.options.map(opt => {
                const isChosenWrong = attemptResult === 'wrong' && lastAttempt?.optionId === opt.id
                const isChosenCorrect = attemptResult === 'correct' && lastAttempt?.optionId === opt.id

                let bc = ACCENT
                let bg = 'white'
                let sh = `0 6px 18px ${ACCENT}20`
                let opacity = 1

                if (isChosenCorrect) {
                  bc = SAFE; bg = '#F0FBF5'; sh = '0 6px 18px rgba(76,184,108,0.3)'
                } else if (isChosenWrong) {
                  bc = DANGER; bg = '#FFF5F5'; sh = '0 6px 18px rgba(192,41,66,0.3)'
                } else if (attemptResult === 'correct') {
                  opacity = 0.5
                }

                return (
                  <motion.button
                    key={opt.id}
                    onClick={() => handleAnswer(opt)}
                    whileHover={attemptResult === 'correct' ? {} : { y: -4, scale: 1.02 }}
                    whileTap={attemptResult === 'correct' ? {} : { scale: 0.98 }}
                    disabled={attemptResult === 'correct'}
                    style={{
                      padding: 'clamp(14px, 2vh, 20px)',
                      borderRadius: 16,
                      border: `3px solid ${bc}`,
                      background: bg,
                      cursor: attemptResult === 'correct' ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                      fontWeight: 700,
                      color: 'var(--text-dark)',
                      textAlign: 'left',
                      boxShadow: sh,
                      transition: 'all 0.2s',
                      opacity,
                    }}
                  >
                    {opt.text}
                  </motion.button>
                )
              })}
            </div>

            <AnimatePresence>
              {attemptResult && lastAttempt && (
                <motion.div
                  ref={explanationRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: 20,
                    padding: '16px 20px',
                    borderRadius: 16,
                    background: lastAttempt.correct ? '#F0FBF5' : '#FFF5F5',
                    borderLeft: `6px solid ${lastAttempt.correct ? SAFE : DANGER}`,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      color: lastAttempt.correct ? '#2A8B4E' : '#C33C3C',
                      marginBottom: 8,
                      fontSize: 'clamp(1.05rem, 1.4vw, 1.2rem)',
                    }}
                  >
                    {lastAttempt.correct
                      ? '⚔ Щит разбит!'
                      : `❌ Хаос атакует! −1 HP (${hp}/3)`}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                      color: 'var(--text-dark)',
                      lineHeight: 1.55,
                    }}
                  >
                    {lastAttempt.reason}
                  </div>

                  {lastAttempt.correct && brokenShields.length < shields.length && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                      <Button
                        onClick={handleNextShield}
                        variant="primary"
                        className="btn-xl"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                          color: 'white',
                          fontSize: '1.25rem',
                          padding: '16px 36px',
                        }}
                      >
                        К следующему щиту →
                      </Button>
                    </div>
                  )}

                  {lastAttempt.correct && brokenShields.length === shields.length && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                      <Button
                        onClick={handleNextShield}
                        variant="primary"
                        className="btn-xl"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                          color: 'white',
                          fontSize: '1.3rem',
                          padding: '18px 42px',
                        }}
                      >
                        🏆 Победа!
                      </Button>
                    </div>
                  )}

                  {!lastAttempt.correct && hp > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                      <Button
                        onClick={handleTryAgain}
                        variant="primary"
                        className="btn-xl"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                          color: 'white',
                          fontSize: '1.25rem',
                          padding: '16px 36px',
                        }}
                      >
                        Попробовать снова →
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HP пионера */}
      <div
        style={{
          marginTop: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(255,255,255,0.15)',
          padding: '10px 24px',
          borderRadius: 999,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>🧒</span>
        <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>HP пионера:</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                fontSize: '1.6rem',
                filter: i < hp ? 'none' : 'grayscale(1) opacity(0.3)',
                transition: 'all 0.3s',
              }}
            >
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Game over */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(26, 15, 46, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              zIndex: 100,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                background: 'white',
                borderRadius: 28,
                padding: 'clamp(24px, 4vh, 44px)',
                maxWidth: 600,
                textAlign: 'center',
                boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', marginBottom: 12 }}>💀</div>
              <h2
                style={{
                  color: ACCENT_DARK,
                  marginBottom: 16,
                  fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)',
                }}
              >
                Хаос победил...
              </h2>
              <p
                style={{
                  color: 'var(--text-soft)',
                  fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                  lineHeight: 1.55,
                  marginBottom: 28,
                }}
              >
                Ты потерял все HP, но не сдавайся! Знания — твоё оружие.
                Попробуй снова — теперь ты знаешь, какие ситуации опасны.
              </p>
              <Button
                onClick={handleRetry}
                variant="primary"
                className="btn-xl"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                  color: 'white',
                  fontSize: '1.35rem',
                  padding: '18px 42px',
                }}
              >
                ⚔ Попробовать снова
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}