import { useEffect, useRef } from 'react'

/**
 * Обёртка, которая при появлении (или изменении trigger) плавно прокручивает
 * страницу к себе.
 *
 * Важно: первый рендер НЕ вызывает прокрутку.
 * Если trigger стартует как false/0/null, скролл сработает только
 * когда он изменится на "правдивое" значение.
 */
export default function ScrollTo({ trigger, offset = 80, children }) {
  const ref = useRef(null)
  const isFirstRender = useRef(true)
  const prevTrigger = useRef(trigger)

  useEffect(() => {
    // Пропускаем самый первый рендер
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevTrigger.current = trigger
      return
    }

    // Если триггер не менялся — не скроллим
    if (prevTrigger.current === trigger) {
      return
    }
    prevTrigger.current = trigger

    // Не скроллим, если trigger «пустой» (false/0/null/undefined)
    if (!trigger) {
      return
    }

    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const y = rect.top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [trigger, offset])

  return <div ref={ref}>{children}</div>
}