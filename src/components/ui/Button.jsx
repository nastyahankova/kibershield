import { useNavigate } from 'react-router-dom'
import { useSound } from '../../context/SoundContext'

export default function Button({ children, onClick, to, variant = 'primary', className = '', style = {} }) {
  const navigate = useNavigate()
  const { playClick } = useSound()

  const handleClick = () => {
    playClick()
    if (onClick) onClick()
    if (to) navigate(to)
  }

  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={handleClick}
      style={style}
    >
      {children}
    </button>
  )
}