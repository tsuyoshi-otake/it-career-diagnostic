import { useCallback, useEffect, useRef, useState } from 'react'
import { computeAll } from './engine/diagnose'
import { Landing } from './screens/Landing'
import { Quiz } from './screens/Quiz'
import { Result } from './screens/Result'

type View = 'home' | 'quiz' | 'result'

const GRAD = 'linear-gradient(118deg,#e9f0fb 0%,#f8eef3 38%,#eef6f1 72%,#e9eefb 100%)'

export function App() {
  const [view, setView] = useState<View>('home')
  const [history, setHistory] = useState<number[]>([])
  const [sel, setSel] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [bandH, setBandH] = useState(0)
  const [bandW, setBandW] = useState(0)

  // Tweaks (surfaced as toggles on the landing screen).
  const [satire, setSatire] = useState(true)
  const [showHints, setShowHints] = useState(true)

  const bandHRef = useRef(bandH)
  bandHRef.current = bandH
  const bandWRef = useRef(bandW)
  bandWRef.current = bandW

  // Measure the flowchart band so the camera can center rather than over-scroll,
  // and so the diagram can scale to fit narrow (tablet / mobile) viewports.
  useEffect(() => {
    if (view !== 'quiz') return
    const measure = () => {
      const el = document.getElementById('ddChartBand')
      if (!el) return
      const h = el.clientHeight
      const w = el.clientWidth
      if (h && Math.abs(h - bandHRef.current) > 2) setBandH(h)
      if (w && Math.abs(w - bandWRef.current) > 2) setBandW(w)
    }
    window.addEventListener('resize', measure)
    const id = window.setInterval(measure, 400)
    measure()
    return () => {
      window.removeEventListener('resize', measure)
      window.clearInterval(id)
    }
  }, [view])

  const startQuiz = useCallback(() => {
    setHistory([])
    setSel(null)
    setCopied(false)
    setView('quiz')
  }, [])

  const goHome = useCallback(() => {
    setSel(null)
    setCopied(false)
    setView('home')
  }, [])

  const proceed = useCallback(() => {
    setSel((currentSel) => {
      if (currentSel === null) return currentSel
      setHistory((h) => {
        const next = h.concat([currentSel])
        const done = !computeAll(next).nextQ
        setView(done ? 'result' : 'quiz')
        return next
      })
      return null
    })
  }, [])

  const goBack = useCallback(() => {
    setHistory((h) => h.slice(0, -1))
    setSel(null)
  }, [])

  // Derive the effective screen: the engine, not the raw view flag, decides
  // whether a quiz has more questions or should show its result.
  const { nextQ } = computeAll(history)

  if (view === 'home') {
    return (
      <Landing
        grad={GRAD}
        satire={satire}
        showHints={showHints}
        onToggleSatire={() => setSatire((s) => !s)}
        onToggleHints={() => setShowHints((s) => !s)}
        onStart={startQuiz}
      />
    )
  }

  if (view === 'quiz' && nextQ) {
    return (
      <Quiz
        grad={GRAD}
        history={history}
        sel={sel}
        bandH={bandH}
        bandW={bandW}
        satire={satire}
        showHints={showHints}
        onSelect={setSel}
        onProceed={proceed}
        onBack={goBack}
        onHome={goHome}
      />
    )
  }

  // view === 'result', or quiz with no remaining questions.
  return (
    <Result
      grad={GRAD}
      history={history}
      satire={satire}
      copied={copied}
      onCopied={setCopied}
      onHome={goHome}
      onRestart={startQuiz}
    />
  )
}
