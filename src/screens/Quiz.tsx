import type { CSSProperties } from 'react'
import { buildQuizView } from '../ui/quizView'

interface QuizProps {
  grad: string
  history: number[]
  sel: number | null
  bandH: number
  bandW: number
  satire: boolean
  showHints: boolean
  onSelect: (i: number) => void
  onProceed: () => void
  onBack: () => void
  onHome: () => void
}

const mono = "'JetBrains Mono',monospace"

export function Quiz(props: QuizProps) {
  const { grad, history, sel, bandH, bandW, satire, showHints, onSelect, onProceed, onBack, onHome } = props
  const built = buildQuizView({ history, sel, bandH, bandW, satire, showHints })
  if (!built) return null
  const { vm } = built

  return (
    <div
      style={{
        minHeight: '100vh',
        background: grad,
        position: 'relative',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '20px',
      }}
    >
      {/* home button */}
      <div
        className="dd-home-btn"
        onClick={onHome}
        style={{
          position: 'fixed',
          left: '26px',
          top: '24px',
          width: '36px',
          height: '36px',
          background: '#fff',
          borderRadius: '50%',
          boxShadow: '0 3px 12px rgba(35,60,110,.14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '5px 5px', gap: '3px' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: '5px', height: '5px', borderRadius: '2px', background: '#17233a' }} />
          ))}
        </div>
      </div>

      {/* flowchart band */}
      <div id="ddChartBand" style={{ position: 'relative', flex: '1 1 auto', minHeight: '300px', overflow: 'hidden', marginTop: '4px' }}>
        {/* scaled footprint, centered horizontally */}
        <div style={{ position: 'absolute', left: '50%', top: 0, width: `${vm.footprintW}px`, height: `${vm.footprintH}px`, transform: 'translateX(-50%)' }}>
          {/* scale layer: fit the 1040-wide diagram to the viewport width */}
          <div style={{ position: 'relative', width: '1040px', height: '600px', transform: `scale(${vm.chartScale})`, transformOrigin: 'top left' }}>
            {/* camera layer: follows the current phase */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateY(${vm.chartY}px)`,
                transition: 'transform .8s cubic-bezier(.22,.8,.3,1)',
              }}
            >
              <div style={{ position: 'absolute', inset: 0 }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.8 }} viewBox="0 0 1040 600" fill="none">
              <path d="M520 106 V118 M155 118 V128 M340 118 V128 M525 118 V128 M710 118 V128 M895 118 V128 M155 118 H895" stroke="#9db9ee" strokeWidth="1.5" />
              <path d="M155 192 V204 M340 192 V204 M525 192 V204 M710 192 V204 M155 204 H710 M520 204 V226" stroke="#c3bdf0" strokeWidth="1.5" />
              <path d="M548 255 H620" stroke="#c3bdf0" strokeWidth="1.5" />
              <path d="M520 284 V356" stroke="#e3c6c6" strokeWidth="1.5" />
              <path d="M492 385 H312" stroke="#e3c6c6" strokeWidth="1.5" />
              <path d="M520 414 V444 M340 444 V456 M520 444 V456 M700 444 V456 M340 444 H700" stroke="#b6d8c6" strokeWidth="1.5" />
              <path d="M340 512 V526 M520 512 V526 M700 512 V526 M295 526 H785 M295 526 V542 M435 526 V542 M575 526 V542 M715 526 V542" stroke="#e8d5b5" strokeWidth="1.5" />
            </svg>

            <PhaseLabel left={16} top={132} color="#2e6be6" a="第1層" b="価値レイヤー" />
            <PhaseLabel left={16} top={240} color="#6a5be2" a="第2層" b="責任成熟度" />
            <PhaseLabel left={16} top={368} color="#c24a4a" a="第3層" b="退化ゲート" />
            <PhaseLabel left={16} top={466} color="#2f9268" a="第4層" b="職種固有分岐" />
            <PhaseLabel left={16} top={548} color="#b07a2e" a="第5層" b="遷移判定" />

            {/* layer cards */}
            <div style={{ position: 'absolute', left: '80px', top: '128px', width: '890px', display: 'flex', justifyContent: 'space-between' }}>
              {vm.chartLayers.map((cl, i) => (
                <div
                  key={i}
                  style={{
                    width: '150px',
                    boxSizing: 'border-box',
                    background: cl.bg,
                    border: cl.bd,
                    borderRadius: '10px',
                    textAlign: 'center',
                    padding: '9px 8px 8px',
                    boxShadow: '0 2px 8px rgba(30,60,120,.05)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-9px',
                      right: '-5px',
                      background: '#2e6be6',
                      color: '#fff',
                      font: `700 9px ${mono}`,
                      borderRadius: '999px',
                      padding: '2px 7px',
                      boxShadow: '0 3px 8px rgba(46,107,230,.3)',
                      opacity: cl.gainOp,
                      transition: 'opacity .3s',
                    }}
                  >
                    {cl.gain}
                  </div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: cl.cl }}>
                    {cl.name}
                    {cl.chk}
                  </div>
                  <div style={{ fontSize: '9px', color: cl.subCl, marginTop: '2px' }}>{cl.sub}</div>
                  <div style={{ height: '4px', borderRadius: '2px', background: cl.track, marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: cl.pct, background: cl.barCl, borderRadius: '2px', transition: 'width .5s ease' }} />
                  </div>
                </div>
              ))}
              <div style={{ width: '150px', boxSizing: 'border-box', border: '1px dashed #c6d2e8', borderRadius: '10px', textAlign: 'center', padding: '10px 6px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#97a5bd' }}>他のレイヤー</div>
                <div style={{ fontSize: '9px', color: '#a9b5c9', marginTop: '2px' }}>スコア下位</div>
              </div>
            </div>

            {/* L chips */}
            <div style={{ position: 'absolute', left: '620px', top: '241px', display: 'flex', gap: '8px' }}>
              {vm.lchips.map((lc, i) => (
                <div key={i} style={{ width: '42px', boxSizing: 'border-box', textAlign: 'center', font: `600 10px ${mono}`, color: lc.cl, background: lc.bg, border: lc.bd, borderRadius: '8px', padding: '6px 0' }}>
                  {lc.t}
                </div>
              ))}
            </div>

            {/* gate labels */}
            <div style={{ position: 'absolute', left: '380px', top: '376px', fontSize: '9px', fontWeight: 700, color: '#c24a4a', background: '#fff', border: '1px solid #f0d5d5', borderRadius: '999px', padding: '1px 8px', lineHeight: 1.5 }}>該当</div>
            <div style={{ position: 'absolute', left: '501px', top: '420px', fontSize: '9px', fontWeight: 700, color: '#2f9268', background: '#fff', border: '1px solid #cfe2d7', borderRadius: '999px', padding: '1px 8px', lineHeight: 1.5 }}>通過</div>

            {/* gate card */}
            <div style={{ position: 'absolute', left: '135px', top: '360px', width: '177px', boxSizing: 'border-box', background: vm.gateBg, border: vm.gateBd, borderRadius: '10px', textAlign: 'center', padding: '9px 6px' }}>
              <div style={{ font: `600 10px ${mono}`, color: vm.gateCl }}>{vm.gateMono}</div>
              <div style={{ fontSize: '9px', color: vm.gateSubCl, marginTop: '2px' }}>{vm.gateSub}</div>
            </div>

            {/* branch states */}
            <div style={{ position: 'absolute', left: '250px', top: '456px', width: '580px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
              {vm.chartStates.map((cs, i) => (
                <div key={i} style={{ flex: 1, maxWidth: '150px', boxSizing: 'border-box', background: cs.bg, border: cs.bd, borderRadius: '10px', textAlign: 'center', padding: '9px 5px', boxShadow: '0 2px 8px rgba(47,146,104,.06)' }}>
                  <div style={{ font: `600 9.5px ${mono}`, color: cs.cl, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cs.mono}</div>
                  <div style={{ fontSize: '9px', color: cs.subCl, marginTop: '2px' }}>{cs.jp}</div>
                </div>
              ))}
            </div>

            {/* transition chips */}
            <div style={{ position: 'absolute', left: '240px', top: '542px', width: '600px', display: 'flex', justifyContent: 'space-between' }}>
              {vm.transChips.map((tc, i) => (
                <div key={i} style={{ width: '110px', boxSizing: 'border-box', textAlign: 'center', fontSize: '10.5px', fontWeight: 700, color: tc.cl, background: tc.bg, border: tc.bd, borderRadius: '8px', padding: '7px 0' }}>
                  {tc.t}
                </div>
              ))}
            </div>
          </div>

          {/* path trail */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1040 600" fill="none">
            <path d={vm.trailP1} stroke="#2e6be6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d={vm.trailP2} stroke="#6a5be2" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d={vm.trailP3} stroke="#d64545" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d={vm.trailP4} stroke="#2f9268" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d={vm.trailP5} stroke="#b07a2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>

              {/* diamonds */}
              <Diamond top={0} d={vm.d1} title="価値レイヤー" subColor="#7c8aa5" />
              <Diamond top={200} d={vm.d2} title="責任成熟度" subColor="#7c8aa5" />
              <Diamond top={330} d={vm.d3} title="退化ゲート" subColor="#b98b8b" />
            </div>
          </div>
        </div>
      </div>

      {/* question panel */}
      <div
        className="dd-qpanel"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '880px',
          maxWidth: 'calc(100vw - 40px)',
          margin: '12px auto 0',
          flex: 'none',
          background: 'rgba(255,255,255,.94)',
          border: '1px solid rgba(255,255,255,.9)',
          borderRadius: '18px',
          boxShadow: '0 30px 80px rgba(35,60,110,.20),0 4px 12px rgba(35,60,110,.06)',
          padding: '14px 24px 16px',
          boxSizing: 'border-box',
          animation: 'ddfadeup .35s ease',
        }}
      >
        <div style={{ display: 'flex', gap: '5px', marginBottom: '12px' }}>
          {vm.segs.map((sg, i) => (
            <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: sg.bg }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div className="dd-qcol" style={{ width: '260px', flex: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: vm.qPhaseColor }}>{vm.qPhaseLabel}</div>
              <div style={{ font: `600 9.5px ${mono}`, color: '#9aa7bd' }}>{vm.qCounter}</div>
            </div>
            <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#17233a', lineHeight: 1.55, marginTop: '6px' }}>{vm.qTitle}</div>
            <div style={{ fontSize: '11px', lineHeight: 1.7, color: '#7c8aa5', marginTop: '6px' }}>{vm.qHelp}</div>
          </div>

          <div
            className={`dd-optwrap${vm.optDisplay === 'grid' ? ' dd-optgrid' : ''}`}
            style={{
              flex: 1,
              display: vm.optDisplay,
              flexDirection: 'column',
              gap: '6px',
              alignContent: 'start',
            }}
          >
            {vm.qOptions.map((o, i) => (
              <div
                key={i}
                className="dd-opt"
                onClick={() => onSelect(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '7px 11px',
                  background: o.bg,
                  border: o.bd,
                  boxShadow: o.sh,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ width: '13px', height: '13px', flex: 'none', border: o.rb, borderRadius: '50%', background: '#fff', boxSizing: 'border-box' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: o.lw, color: '#17233a', lineHeight: 1.45 }}>{o.l}</div>
                  {o.d ? <div style={{ fontSize: '10px', color: '#9aa7bd', lineHeight: 1.35 }}>{o.d}</div> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f4f7fd', borderRadius: '10px', padding: '7px 12px', minHeight: '18px' }}>
            {vm.hintChipShow ? (
              <div style={{ font: `600 9px ${mono}`, color: vm.hintFxCl, background: vm.hintFxBg, borderRadius: '6px', padding: '2px 7px', flex: 'none' }}>{vm.hintFx}</div>
            ) : null}
            <div style={{ fontSize: '11px', lineHeight: 1.55, color: '#5f6f8a' }}>{vm.hintNote}</div>
          </div>
          {vm.canBack ? (
            <div className="dd-backlink" onClick={onBack} style={{ fontSize: '11.5px', fontWeight: 500, color: '#8493ab', cursor: 'pointer', padding: '6px 2px', flex: 'none' }}>
              ← 戻る
            </div>
          ) : null}
          <div
            onClick={onProceed}
            style={{
              background: vm.proceedBg,
              color: '#fff',
              fontSize: '12.5px',
              fontWeight: 700,
              borderRadius: '999px',
              padding: '9px 22px',
              boxShadow: vm.proceedShadow,
              cursor: vm.proceedCursor,
              userSelect: 'none',
              flex: 'none',
            }}
          >
            この回答で進む
          </div>
        </div>
      </div>
    </div>
  )
}

function PhaseLabel({ left, top, color, a, b }: { left: number; top: number; color: string; a: string; b: string }) {
  return (
    <div style={{ position: 'absolute', left: `${left}px`, top: `${top}px`, fontSize: '10.5px', fontWeight: 700, color, lineHeight: 1.5 }}>
      {a}
      <br />
      {b}
    </div>
  )
}

interface DiamondVMLite {
  border: string
  shadow: string
  color: string
  anim: string
  sub: string
}

function Diamond({ top, d, title, subColor }: { top: number; d: DiamondVMLite; title: string; subColor: string }) {
  const wrap: CSSProperties = { position: 'absolute', left: '465px', top: `${top}px`, width: '110px', height: '110px', animation: d.anim }
  return (
    <div style={wrap}>
      <div style={{ position: 'absolute', inset: '16px', transform: 'rotate(45deg)', background: '#fff', border: d.border, borderRadius: '7px', boxShadow: d.shadow }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: d.color }}>{title}</div>
        <div style={{ fontSize: '8.5px', color: subColor, marginTop: '2px' }}>{d.sub}</div>
      </div>
    </div>
  )
}
