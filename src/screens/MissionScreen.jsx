import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button.jsx'
import ChatDialog from '../components/ui/ChatDialog.jsx'
import { useGame } from '../context/GameContext.jsx'
import { useSound } from '../context/SoundContext.jsx'

import Mission01_Phishing from '../missions/Mission01_Phishing.jsx'
import Mission02_Flood from '../missions/Mission02_Flood.jsx'
import Mission03_Shadow from '../missions/Mission03_Shadow.jsx'
import Mission04_Worm from '../missions/Mission04_Worm.jsx'
import Mission05_Mirage from '../missions/Mission05_Mirage.jsx'
import Mission06_Cracker from '../missions/Mission06_Cracker.jsx'
import Mission07_Watcher from '../missions/Mission07_Watcher.jsx'
import Mission08_Illusionist from '../missions/Mission08_Illusionist.jsx'
import Mission09_Clone from '../missions/Mission09_Clone.jsx'

// ============================================================
// Метаданные о миссиях
// ============================================================
const missionsMeta = {
  1: {
    title: 'Бухта Фишинга',
    villain: 'Крючок',
    villainImg: '/images/1-hook.png',
    emoji: '🎣',
    intro: 'Злодей Крючок ловит ребят на поддельные письма. Найди его фальшивку!',
    tip: {
      messages: [
        { from: 'ogonek', text: 'Молодец! Ты справился с Крючком. Но запомни главное правило безопасности.' },
        { from: 'pioneer', text: 'А что делать, если мне придёт странное письмо?' },
        { from: 'ogonek', text: 'Вот тут-то и нужна смекалка. Как ты думаешь, что безопаснее?' },
      ],
      question: {
        text: 'Что делать с подозрительным письмом?',
        options: [
          { id: 'open', label: '📬 Открыть и посмотреть, что там', reply: 'Ой, не советую! Даже одно открытие письма может быть опасно — там может быть вирус. Лучше сразу удалять!' },
          { id: 'click', label: '🔗 Перейти по ссылке и проверить', reply: 'Ни в коем случае! Так ты попадёшь прямо в ловушку. Мошенники только этого и ждут.' },
          { id: 'delete', label: '🗑 Удалить и рассказать взрослым', reply: 'Вот это правильно! Удалить, не открывая, и рассказать взрослым — лучшая защита. Молодец!' },
        ],
      },
    },
    Component: Mission01_Phishing,
  },

  2: {
    title: 'Поток Сообщений',
    villain: 'Поток',
    villainImg: '/images/2-flood.png',
    emoji: '📱',
    intro: 'Злодей Поток заваливает школьников спамом и мошенническими SMS. Помоги отличить настоящие сообщения от подделок!',
    tip: {
      messages: [
        { from: 'ogonek', text: 'Ты справился с Потоком! Но помни: мошенники каждый день придумывают новые схемы.' },
        { from: 'pioneer', text: 'А как понять, что SMS от мошенника?' },
        { from: 'ogonek', text: 'Есть несколько признаков. А как ты сам думаешь, что делать с подозрительным SMS?' },
      ],
      question: {
        text: 'Пришло SMS: «Вы выиграли приз! Перейдите по ссылке…». Что делать?',
        options: [
          { id: 'click', label: '🔗 Перейти по ссылке и посмотреть', reply: 'Опасно! По ссылке может быть поддельный сайт, который украдёт твои данные. Мошенники только этого и ждут.' },
          { id: 'reply', label: '✉️ Ответить и узнать подробности', reply: 'Не стоит! Так ты подтвердишь, что номер активный, и тебе начнут присылать ещё больше спама.' },
          { id: 'delete', label: '🗑 Удалить и никому не пересылать', reply: 'Правильно! Удалить и не пересылать — лучший вариант. Настоящие призы не приходят по SMS от незнакомых номеров.' },
        ],
      },
    },
    Component: Mission02_Flood,
  },

  3: {
    title: 'Тёмный Чат',
    villain: 'Тень',
    villainImg: '/images/3-shadow.png',
    emoji: '👤',
    intro: 'Злодей Тень любит травить ребят в чатах. Он думает, что за экраном его не видно. Помоги разобраться с ситуацией!',
    tip: {
      messages: [
        { from: 'ogonek', text: 'Ты справился с Тенью! Но в жизни бывает сложнее — важно знать, как реагировать на обиды в сети.' },
        { from: 'pioneer', text: 'А если меня будут травить в интернете — что делать?' },
        { from: 'ogonek', text: 'Хороший вопрос. Вот смотри — представь ситуацию. Как ты поступишь?' },
      ],
      question: {
        text: 'Ты получил обидное сообщение в чате. Что ты сделаешь?',
        options: [
          { id: 'scream', label: '💢 Напишу обидчику всё, что о нём думаю', reply: 'Не лучший вариант! Так конфликт только усилится. Ты имеешь право злиться, но отвечать грубостью — не выход.' },
          { id: 'block-report', label: '🚫 Заблокирую и расскажу взрослым', reply: 'Правильно! Блокировка остановит поток сообщений, а взрослые помогут разобраться. Ты не один.' },
          { id: 'nothing', label: '🤐 Промолчу и сделаю вид, что ничего не было', reply: 'Понимаю, но так буллинг может усилиться. Лучше не молчать — расскажи тому, кому доверяешь.' },
        ],
      },
    },
    Component: Mission03_Shadow,
  },

  4: {
    title: 'Логово Вирусов',
    villain: 'Червь',
    villainImg: '/images/4-worm.png',
    emoji: '🐛',
    intro: 'Злодей Червь заражает компьютеры через опасные сайты и файлы. Проведи пионера по безопасному пути!',
    tip: {
      messages: [
        { from: 'ogonek', text: 'Отлично! Ты обошёл Червя и не попал в его ловушки!' },
        { from: 'pioneer', text: 'А как вообще понять, что сайт опасный?' },
        { from: 'ogonek', text: 'Есть несколько признаков. Как ты думаешь, что должно насторожить?' },
      ],
      question: {
        text: 'Ты открыл сайт, и он сразу просит «скачать файл для просмотра». Что делать?',
        options: [
          { id: 'download', label: '💾 Скачать — вдруг это важно', reply: 'Опасно! Файлы с незнакомых сайтов часто содержат вирусы. Никогда не скачивай их просто так.' },
          { id: 'click-ads', label: '🖱 Кликнуть по ярким баннерам', reply: 'Не стоит! Яркие баннеры часто ведут на мошеннические сайты или запускают вирусы.' },
          { id: 'close', label: '❌ Закрыть сайт и не скачивать', reply: 'Правильно! Если сайт требует что-то скачать — это подозрительно. Лучше закрыть и не рисковать.' },
        ],
      },
    },
    Component: Mission04_Worm,
  },

  5: {
    title: 'Зеркальный Зал',
    villain: 'Мираж',
    villainImg: '/images/5-mirage.png',
    emoji: '📰',
    intro: 'Злодей Мираж подсовывает школьникам фейковые новости. Он любит пугать и обманывать. Помоги найти подделку!',
    tip: {
      messages: [
        { from: 'ogonek', text: 'Ты справился с Миражом! Теперь ты умеешь отличать настоящие новости от фейков.' },
        { from: 'pioneer', text: 'А если я увижу новость, но не уверен — правда это или нет?' },
        { from: 'ogonek', text: 'Хороший вопрос. Как ты думаешь, что нужно делать?' },
      ],
      question: {
        text: 'Ты видишь новость: «Врачи нашли чудо-таблетку от всех болезней». Что делать?',
        options: [
          { id: 'share', label: '📤 Сразу поделиться с друзьями', reply: 'Опасно! Если новость фейковая, ты станешь её распространителем. Сначала проверь!' },
          { id: 'believe', label: '😮 Поверить, ведь это врачи', reply: 'Не спеши! Слова «врачи нашли» без имён и источников — типичный признак фейка.' },
          { id: 'check', label: '🔍 Проверить на официальных сайтах', reply: 'Правильно! Зайти на сайт Минздрава или известного издания и проверить, есть ли там такая новость.' },
        ],
      },
    },
    Component: Mission05_Mirage,
  },

  6: {
    title: 'Сейф Аккаунтов',
    villain: 'Взломщик',
    villainImg: '/images/6-cracker.png',
    emoji: '🔐',
    intro: 'Злодей Взломщик подбирает пароли к аккаунтам за секунды. Помоги пионеру собрать надёжный пароль!',
    tip: {
      messages: [
        { from: 'ogonek', text: 'Отлично! Взломщик не сможет подобрать такой пароль.' },
        { from: 'pioneer', text: 'А если я забыл пароль — можно записать его в блокноте?' },
        { from: 'ogonek', text: 'Интересный вопрос. А как ты сам думаешь, что безопаснее?' },
      ],
      question: {
        text: 'Где хранить пароль от своего аккаунта?',
        options: [
          { id: 'notebook', label: '📓 В бумажном блокноте рядом с компьютером', reply: 'Не очень надёжно. Если блокнот потеряется или его увидят другие — пароль раскроют.' },
          { id: 'shared', label: '📱 Отправить себе в общий чат', reply: 'Опасно! В общих чатах пароли легко перехватить или случайно показать другим.' },
          { id: 'manager', label: '🔑 Использовать менеджер паролей', reply: 'Правильно! Менеджер паролей хранит их в зашифрованном виде под одним главным паролем.' },
        ],
      },
    },
    Component: Mission06_Cracker,
  },

  7: {
    title: 'Око Сети',
    villain: 'Соглядатай',
    villainImg: '/images/7-watcher.png',
    emoji: '👁️',
    intro: 'Злодей Соглядатай собирает личные данные школьников. Помоги настроить профиль так, чтобы он ничего не смог узнать!',
    tip: {
      messages: [
        { from: 'ogonek', text: 'Отлично! Теперь Соглядатай не получит твои личные данные.' },
        { from: 'pioneer', text: 'А что вообще нельзя публиковать в соцсетях?' },
        { from: 'ogonek', text: 'Есть список. А как ты думаешь, что самое опасное?' },
      ],
      question: {
        text: 'Какую информацию точно НЕЛЬЗЯ публиковать в открытом профиле?',
        options: [
          { id: 'books', label: '📚 Список любимых книг', reply: 'Это безопасно — книги не помогут мошенникам. А вот адрес или телефон — нельзя!' },
          { id: 'address', label: '🏠 Домашний адрес', reply: 'Правильно! Адрес, номер школы, телефон — личные данные. Их нельзя показывать всем.' },
          { id: 'hobby', label: '⚽ Любимый вид спорта', reply: 'Это безопасно. Хобби можно показывать. Опасны личные данные: адрес, телефон, дата рождения.' },
        ],
      },
    },
    Component: Mission07_Watcher,
  },

  8: {
    title: 'Базар Обмана',
    villain: 'Иллюзионист',
    villainImg: '/images/8-illusionist.png',
    emoji: '🎩',
    intro: 'Злодей Иллюзионист любит обманывать людей через объявления. Помоги распознать мошенников!',
    tip: {
      messages: [
        { from: 'ogonek', text: 'Отлично! Иллюзионист больше не обманет тебя.' },
        { from: 'pioneer', text: 'А какие признаки у мошенников в объявлениях?' },
        { from: 'ogonek', text: 'Есть несколько. А как ты думаешь, что самое подозрительное?' },
      ],
      question: {
        text: 'Продавец просит перевести 50% стоимости вперёд. Что делать?',
        options: [
          { id: 'pay', label: '💳 Перевести предоплату', reply: 'Опасно! После перевода продавец часто пропадает. Так работает большинство мошенников.' },
          { id: 'trust', label: '🤝 Договориться оплатить при встрече', reply: 'Умно! Но если продавец отказывается от встречи и требует перевод — это точно мошенник.' },
          { id: 'refuse', label: '❌ Отказаться от сделки', reply: 'Правильно! Никогда не переводи деньги незнакомым. Реальные продавцы согласны на встречу и оплату при получении.' },
        ],
      },
    },
    Component: Mission08_Illusionist,
  },

  9: {
    title: 'Зал Двойников',
    villain: 'Клон',
    villainImg: '/images/9-clone.png',
    emoji: '👥',
    intro: 'Злодей Клон создаёт фейковые аккаунты и притворяется твоими друзьями. Научись их разоблачать!',
    tip: {
      messages: [
        { from: 'ogonek', text: 'Отлично! Клон больше не обманет тебя.' },
        { from: 'pioneer', text: 'А что делать, если я получил запрос в друзья от подозрительного аккаунта?' },
        { from: 'ogonek', text: 'Хороший вопрос! Как ты думаешь, что безопаснее?' },
      ],
      question: {
        text: 'Незнакомый аккаунт от имени твоего друга просит добавить его в друзья. Что делать?',
        options: [
          { id: 'accept', label: '✅ Добавить — вдруг это правда друг', reply: 'Опасно! Сначала убедись, что это точно твой друг — напиши ему в другом мессенджере или спроси лично.' },
          { id: 'money', label: '💸 Если попросит денег — переведу', reply: 'Ни в коем случае! Просьба денег от «друга» в сети — главный признак взлома или клона.' },
          { id: 'check', label: '🔍 Проверить у друга лично и не добавлять', reply: 'Правильно! Позвони или спроси лично, действительно ли это его аккаунт. Только после этого решай.' },
        ],
      },
    },
    Component: Mission09_Clone,
  },
}

// ============================================================
// Экран миссии
// ============================================================
export default function MissionScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { progress, completeMission, isMissionCompleted } = useGame()
  const { playSuccess } = useSound()
  const missionId = parseInt(id, 10)

  const [stage, setStage] = useState('intro')
  const meta = missionsMeta[missionId]

  // Отслеживаем ширину экрана
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Автоскролл при СМЕНЕ стадии (не при первом рендере)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stage])

  // Если миссия не готова — заглушка
  if (!meta) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          background: 'var(--grad-bg)',
        }}
      >
        <div className="card" style={{ textAlign: 'center', maxWidth: 500 }}>
          <div style={{ fontSize: '4rem', marginBottom: 12 }}>🚧</div>
          <h2 style={{ marginBottom: 12 }}>Миссия пока не готова</h2>
          <p style={{ margin: '0 0 24px', color: 'var(--text-soft)' }}>
            Эта локация ещё в разработке. Заходите позже!
          </p>
          <Button onClick={() => navigate('/map')} variant="primary" className="btn-xl">
            ← На карту
          </Button>
        </div>
      </div>
    )
  }

  const { title, villain, villainImg, emoji, intro, tip, Component } = meta

  const handleSuccess = () => {
    playSuccess()
    if (!isMissionCompleted(missionId)) {
      completeMission(missionId)
    }
    setStage('tip')
  }

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
        justifyContent: isMobile ? 'flex-start' : 'center',
      }}
    >
      {/* Радужные полосы */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #A8D8EA, #A5E0B8, #FFEBA0, #FFCC91, #FFA8A8, #C8A8EB)', zIndex: 100 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #C8A8EB, #FFA8A8, #FFCC91, #FFEBA0, #A5E0B8, #A8D8EA)', zIndex: 100 }} />

      {/* Кнопка «На карту» */}
      <button
        onClick={() => navigate('/map')}
        style={{
          position: 'fixed',
          top: isMobile ? 14 : 22,
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
          zIndex: 200,
        }}
      >
        <span style={{ fontSize: isMobile ? '1.1rem' : '1.3rem' }}>🗺</span>
        <span>{isMobile ? '' : 'На карту'}</span>
      </button>

      <AnimatePresence mode="wait">
        {/* ===== СТАДИЯ 1: Заставка ===== */}
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? 12 : 'clamp(20px, 5vw, 60px)',
              maxWidth: isMobile ? '100%' : 1200,
              width: '100%',
              flexDirection: isMobile ? 'column' : 'row',
              flexWrap: 'wrap',
              padding: isMobile ? '0' : 'clamp(8px, 2vh, 20px)',
              marginTop: isMobile ? 70 : 0,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : -60, y: isMobile ? -20 : 0, rotate: -10 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 100 }}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <img
                src={villainImg}
                alt={villain}
                style={{
                  height: isMobile
                    ? 'clamp(140px, 22vh, 200px)'
                    : 'clamp(280px, 55vh, 620px)',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 24px 40px rgba(46, 58, 89, 0.3))',
                }}
                onError={e => (e.target.style.display = 'none')}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : 60, y: isMobile ? 20 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 100 }}
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: isMobile ? 22 : 28,
                padding: isMobile
                  ? 'clamp(16px, 2.5vh, 22px)'
                  : 'clamp(24px, 4vh, 44px)',
                boxShadow: '0 24px 60px rgba(46, 58, 89, 0.22)',
                border: '2px solid rgba(255, 255, 255, 0.95)',
                maxWidth: isMobile ? '100%' : 560,
                flex: isMobile ? '1 1 100%' : '1 1 400px',
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? 10 : 16,
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  alignSelf: 'flex-start',
                  background: 'linear-gradient(135deg, #4A90E2, #9B6BC9)',
                  color: 'white',
                  padding: isMobile ? '4px 14px' : '6px 18px',
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: isMobile ? '0.8rem' : '0.95rem',
                  letterSpacing: '0.05em',
                }}
              >
                ЛОКАЦИЯ {missionId}
              </div>

              <h1
                style={{
                  fontSize: isMobile
                    ? 'clamp(1.4rem, 5vw, 1.8rem)'
                    : 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  margin: 0,
                  lineHeight: 1.15,
                  fontWeight: 900,
                }}
              >
                {title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#FFF4E0',
                  border: '2px dashed #F0C24B',
                  padding: isMobile ? '8px 12px' : '10px 16px',
                  borderRadius: 14,
                  fontSize: isMobile ? '0.9rem' : 'clamp(1rem, 1.5vw, 1.2rem)',
                  fontWeight: 700,
                  color: '#9B6B00',
                }}
              >
                <span style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>😈</span>
                <span>Злодей: {villain}</span>
              </div>

              <p
                style={{
                  fontSize: isMobile
                    ? 'clamp(0.92rem, 3.5vw, 1.05rem)'
                    : 'clamp(1.05rem, 1.6vw, 1.3rem)',
                  color: 'var(--text-dark)',
                  lineHeight: 1.5,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {intro}
              </p>

              <Button
                onClick={() => setStage('game')}
                variant="primary"
                className="btn-xl"
                style={{
                  marginTop: 8,
                  fontSize: isMobile ? '1rem' : '1.35rem',
                  padding: isMobile ? '14px 24px' : '20px 40px',
                  width: isMobile ? '100%' : 'auto',
                }}
              >
                ▶ Начать задание
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* ===== СТАДИЯ 2: Игра ===== */}
        {/* ===== СТАДИЯ 2: Игра ===== */}
        {stage === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              width: '100%',
              maxWidth: isMobile ? '100%' : 1100,
              marginTop: isMobile ? 60 : 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Прогресс-бар — только в стадии игры */}
            <MissionProgressBar
              currentMission={missionId}
              completedMissions={progress.completedMissions}
            />
            <Component onSuccess={handleSuccess} />
          </motion.div>
        )}

        {/* ===== СТАДИЯ 3: Диалог ===== */}
        {stage === 'tip' && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              width: '100%',
              maxWidth: isMobile ? '100%' : 1200,
              display: 'flex',
              justifyContent: 'center',
              marginTop: isMobile ? 60 : 0,
            }}
          >
            <ChatDialog
              messages={tip.messages}
              question={tip.question}
              onComplete={() => setStage('done')}
            />
          </motion.div>
        )}

        {/* ===== СТАДИЯ 4: Финал ===== */}
        {stage === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              maxWidth: isMobile ? '100%' : 640,
              width: '100%',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: isMobile ? 22 : 28,
              padding: isMobile ? '24px 18px' : 'clamp(28px, 5vh, 48px)',
              boxShadow: '0 24px 60px rgba(46, 58, 89, 0.22)',
              border: '2px solid rgba(255, 255, 255, 0.95)',
              textAlign: 'center',
              marginTop: isMobile ? 60 : 0,
            }}
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1 }}
              style={{
                fontSize: isMobile ? '3.5rem' : 'clamp(3.5rem, 9vw, 6rem)',
                marginBottom: 12,
              }}
            >
              🧩
            </motion.div>
            <h2
              style={{
                marginBottom: 16,
                color: 'var(--accent-green)',
                fontSize: isMobile ? '1.4rem' : 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 900,
              }}
            >
              Фрагмент карты собран!
            </h2>
            <p
              style={{
                fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.5vw, 1.25rem)',
                color: 'var(--text-soft)',
                marginBottom: 32,
              }}
            >
              Ты справился с локацией №{missionId}. Так держать!
            </p>
            <Button
              onClick={() => navigate('/map')}
              variant="primary"
              className="btn-xl"
              style={{
                fontSize: isMobile ? '1rem' : '1.35rem',
                padding: isMobile ? '14px 24px' : '20px 40px',
                width: isMobile ? '100%' : 'auto',
              }}
            >
              🗺 На карту
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
// ============================================================
// Прогресс-бар миссий (статичный, без мерцания)
// ============================================================
function MissionProgressBar({ currentMission, completedMissions }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        width: '100%',
        maxWidth: 800,
        padding: '0 8px',
      }}
    >
      {/* Текст: "Миссия X из 9" */}
      <div
        style={{
          fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)',
          fontWeight: 700,
          color: 'var(--text-soft)',
          letterSpacing: '0.05em',
        }}
      >
        📍 Миссия {currentMission} из 9
      </div>

      {/* Полоска с 9 точками — без анимации */}
      <div
        style={{
          display: 'flex',
          gap: 'clamp(4px, 1vw, 10px)',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(id => {
          const isDone = completedMissions.includes(id)
          const isCurrent = id === currentMission

          let bg = '#E5E9F0'          // будущая — светло-серая
          if (isDone) bg = '#4CB86C'                          // пройдена — зелёная (сплошная)
          else if (isCurrent) bg = '#4A90E2'                  // текущая — синяя

          return (
            <div
              key={id}
              style={{
                flex: 1,
                height: 'clamp(6px, 1vh, 10px)',
                borderRadius: 999,
                background: bg,
                transition: 'background 0.4s',
                maxWidth: 80,
                opacity: isCurrent ? 1 : isDone ? 0.85 : 0.5,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}