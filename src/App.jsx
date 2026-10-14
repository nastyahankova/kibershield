import { Routes, Route } from 'react-router-dom'
import StartScreen from './screens/StartScreen.jsx'
import AboutScreen from './screens/AboutScreen.jsx'
import Prologue from './screens/Prologue.jsx'
import MapScreen from './screens/MapScreen.jsx'
import MissionScreen from './screens/MissionScreen.jsx'
import FinalBattle from './screens/FinalBattle.jsx'
import TreasureScreen from './screens/TreasureScreen.jsx'
import MemoScreen from './screens/MemoScreen.jsx'
import CertificateScreen from './screens/CertificateScreen.jsx'
import SoundToggle from './components/SoundToggle.jsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/prologue" element={<Prologue />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/mission/:id" element={<MissionScreen />} />
        <Route path="/final" element={<FinalBattle />} />
        <Route path="/treasure" element={<TreasureScreen />} />
        <Route path="/memo" element={<MemoScreen />} />
        <Route path="/certificate" element={<CertificateScreen />} />
      </Routes>

      <SoundToggle position="top-right" />
    </>
  )
}