import type { CSSProperties } from 'react'
import { buildResultView } from '../ui/resultView'

interface ResultProps {
  grad: string
  history: number[]
  satire: boolean
  copied: boolean
  onCopied: (v: boolean) => void
  onHome: () => void
  onRestart: () => void
}

const mono = "'JetBrains Mono',monospace"

const card: CSSProperties = {
  background: 'rgba(255,255,255,.9)',
  border: '1px solid rgba(255,255,255,.95)',
  borderRadius: '18px',
  boxShadow: '0 12px 34px rgba(35,60,110,.07)',
  padding: '24px 26px',
}

const sectionLabel: CSSProperties = { fontSize: '10.5px', fontWeight: 700, color: '#8493ab', letterSpacing: '.1em' }

function fallbackCopy(text: string, done: () => void) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
  } catch {
    /* ignore */
  }
  document.body.removeChild(ta)
  done()
}

export function Result({ grad, history, satire, copied, onCopied, onHome, onRestart }: ResultProps) {
  const vm = buildResultView(history, satire)
  if (!vm) return null

  const copyMemo = () => {
    const done = () => {
      onCopied(true)
      setTimeout(() => onCopied(false), 2000)
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(vm.resMemo).then(done).catch(() => fallbackCopy(vm.resMemo, done))
    } else {
      fallbackCopy(vm.resMemo, done)
    }
  }

  return (
    <div className="dd-resultpad" style={{ minHeight: '100vh', background: grad, padding: '36px 24px 80px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
        <div
          className="dd-backlink"
          onClick={onHome}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#fff', border: '1px solid #e3e9f5', borderRadius: '999px', padding: '7px 15px', fontSize: '11.5px', fontWeight: 600, color: '#5f6f8a', cursor: 'pointer', boxShadow: '0 2px 8px rgba(35,60,110,.06)' }}
        >
          ← トップに戻る
        </div>
        <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#2e6be6', letterSpacing: '.1em', marginTop: '26px' }}>回答に基づく状態判定</div>
        <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#17233a', margin: '6px 0 18px' }}>診断結果</h1>

        {/* summary card */}
        <div className="dd-sum" style={{ background: 'rgba(255,255,255,.9)', border: '1px solid rgba(255,255,255,.95)', borderRadius: '18px', boxShadow: '0 16px 44px rgba(35,60,110,.09)', padding: '26px 30px', display: 'flex', gap: '34px', flexWrap: 'wrap', animation: 'ddfadeup .4s ease' }}>
          <div className="dd-sum-main" style={{ flex: 1, minWidth: '380px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#2e6be6', background: '#e9f0fd', borderRadius: '5px', padding: '3px 9px' }}>主状態</div>
              <div style={{ font: `600 10px ${mono}`, color: '#2563c9', background: '#eef4fd', borderRadius: '5px', padding: '3px 9px' }}>{vm.resPrimaryMono}</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: vm.riskChipCl, background: vm.riskChipBg, borderRadius: '5px', padding: '3px 9px' }}>{vm.riskChipText}</div>
            </div>
            <div style={{ fontSize: '19px', fontWeight: 800, color: '#17233a', lineHeight: 1.85 }}>{vm.resSummary}</div>
            <div style={{ fontSize: '12px', lineHeight: 1.9, color: '#5f6f8a', marginTop: '12px' }}>{vm.resReason}</div>
          </div>
          <div className="dd-sum-kv" style={{ width: '300px', flex: 'none', display: 'flex', flexDirection: 'column', gap: 0, borderLeft: '1px solid #edf1f8', paddingLeft: '30px' }}>
            {vm.resKv.map((kv, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '9px 0', borderBottom: '1px solid #f1f4fa' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#8493ab', flex: 'none' }}>{kv.k}</div>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: kv.vc, textAlign: 'right', lineHeight: 1.5 }}>{kv.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* primary + transition */}
        <div className="dd-grid2" style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
          <div style={card}>
            <div style={{ ...sectionLabel }}>主状態 / PRIMARY STATE</div>
            <div style={{ font: `700 21px ${mono}`, color: '#2563c9', marginTop: '12px', wordBreak: 'break-all' }}>{vm.resPrimaryMono}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '9px', marginTop: '5px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#17233a' }}>{vm.resPrimaryJp}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#2f9268', background: '#edf7f2', borderRadius: '5px', padding: '2px 8px' }}>{vm.resPrimaryType}</div>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#5f6f8a', marginTop: '9px' }}>{vm.resPrimaryDesc}</div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#8493ab' }}>責任成熟度</div>
                <div style={{ font: `600 10.5px ${mono}`, color: '#6a5be2' }}>{vm.resLevelText}</div>
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '7px' }}>
                {vm.resMeter.map((mt, i) => (
                  <div key={i} style={{ flex: 1, height: '8px', borderRadius: '4px', background: mt.bg }} />
                ))}
              </div>
            </div>
            <div style={{ fontSize: '11px', lineHeight: 1.7, color: '#8493ab', marginTop: '14px', borderTop: '1px solid #eef2f9', paddingTop: '11px' }}>{vm.resSecondaryLine}</div>
          </div>

          <div style={card}>
            <div style={{ ...sectionLabel }}>遷移マップ / TRANSITION</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px' }}>
              {vm.chainView.map((ch, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: ch.bg, border: ch.bd, borderRadius: '10px', padding: '8px 13px', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '9px', minWidth: 0 }}>
                      <div style={{ font: `600 11px ${mono}`, color: ch.cl, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.mono}</div>
                      <div style={{ fontSize: '10.5px', color: '#8493ab', flex: 'none' }}>{ch.jp}</div>
                    </div>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: ch.mkCl, flex: 'none' }}>{ch.mk}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '15px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 800, color: vm.resTransChipCl, background: vm.resTransChipBg, borderRadius: '6px', padding: '4px 10px' }}>{vm.resTransChip}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#17233a' }}>{vm.resTransLine}</div>
            </div>
            <div style={{ fontSize: '11.5px', lineHeight: 1.8, color: '#5f6f8a', marginTop: '8px' }}>{vm.resTransNote}</div>
          </div>
        </div>

        {/* risk */}
        {vm.riskShow ? (
          <div style={{ background: '#fdf7f7', border: '1px solid #f0d5d5', borderRadius: '18px', boxShadow: '0 12px 34px rgba(194,74,74,.07)', padding: '24px 26px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#fff', background: '#c24a4a', borderRadius: '5px', padding: '3px 9px' }}>{vm.riskBadge}</div>
              <div style={{ font: `700 15px ${mono}`, color: '#b84a4a' }}>{vm.riskMono}</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#17233a' }}>{vm.riskJp}</div>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.8, color: '#6b5555', marginTop: '9px' }}>{vm.riskDesc}</div>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#2f9268', marginTop: '14px' }}>脱出条件</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: '8px' }}>
              {vm.riskEsc.map((re, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '13px', height: '13px', flex: 'none', border: '1.5px solid #b6cfc2', borderRadius: '4px', marginTop: '2px', background: '#fff' }} />
                  <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#41618c' }}>{re.t}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* reasoning log */}
        <div style={{ ...card, marginTop: '16px' }}>
          <div style={{ ...sectionLabel }}>回答ごとの判定根拠</div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
            {vm.resLog.map((lg, i) => (
              <div key={i} className="dd-logrow" style={{ display: 'flex', gap: '12px', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid #f2f5fa' }}>
                <div style={{ width: '8px', height: '8px', flex: 'none', borderRadius: '50%', background: lg.c, position: 'relative', top: '-1px' }} />
                <div style={{ width: '64px', flex: 'none', fontSize: '10px', fontWeight: 700, color: lg.c }}>{lg.ph}</div>
                <div className="dd-log-q" style={{ flex: 1, fontSize: '11.5px', lineHeight: 1.6, color: '#5f6f8a', minWidth: '200px' }}>{lg.q}</div>
                <div className="dd-log-a" style={{ width: '230px', flex: 'none', fontSize: '11.5px', fontWeight: 700, color: '#17233a', lineHeight: 1.5 }}>{lg.a}</div>
                <div className="dd-log-fx" style={{ width: '120px', flex: 'none', font: `600 9.5px ${mono}`, color: '#7c8aa5', textAlign: 'right' }}>{lg.fx}</div>
              </div>
            ))}
          </div>
        </div>

        {/* actions + avoids */}
        <div className="dd-grid2" style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
          <div style={card}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#2e6be6', letterSpacing: '.1em' }}>次のアクション</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              {vm.resActions.map((ac, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ font: `700 11px ${mono}`, color: '#2e6be6', background: '#e9f0fd', borderRadius: '6px', padding: '3px 7px', flex: 'none' }}>{ac.n}</div>
                  <div style={{ fontSize: '12.5px', lineHeight: 1.7, color: '#2b3b57' }}>{ac.t}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#c24a4a', letterSpacing: '.1em' }}>避けるべき案件</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              {vm.resAvoids.map((av, i) => (
                <div key={i} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#c24a4a', flex: 'none', marginTop: '1px' }}>✕</div>
                  <div style={{ fontSize: '12.5px', lineHeight: 1.7, color: '#2b3b57' }}>{av.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* portable skills */}
        <div style={{ ...card, marginTop: '16px' }}>
          <div style={{ ...sectionLabel }}>ポータブルスキル</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {vm.resSkills.map((sk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '7px', background: '#eef4fd', border: '1px solid #d9e5f8', borderRadius: '8px', padding: '6px 11px' }}>
                <div style={{ font: `600 10.5px ${mono}`, color: '#2563c9' }}>{sk.mono}</div>
                <div style={{ fontSize: '10.5px', color: '#5f6f8a' }}>{sk.jp}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: '#9aa7bd', marginTop: '10px' }}>{vm.resSkillNote}</div>
        </div>

        {/* memo */}
        <div style={{ ...card, marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ ...sectionLabel }}>診断メモ</div>
              <div style={{ fontSize: '11px', color: '#9aa7bd', marginTop: '4px' }}>キャリア面談・案件選定・上長との1on1にそのまま貼れるMarkdownです。</div>
            </div>
            <div className="dd-copy" onClick={copyMemo} style={{ background: '#3a6fe0', color: '#fff', fontSize: '12px', fontWeight: 700, borderRadius: '999px', padding: '9px 20px', boxShadow: '0 6px 18px rgba(46,107,230,.25)', cursor: 'pointer', flex: 'none' }}>
              {copied ? 'コピーしました ✓' : 'Markdownをコピー'}
            </div>
          </div>
          <div style={{ font: `500 10.5px/1.75 ${mono}`, color: '#41618c', background: '#f7f9fd', border: '1px solid #e8edf6', borderRadius: '12px', padding: '16px 18px', marginTop: '14px', whiteSpace: 'pre-wrap', maxHeight: '280px', overflow: 'auto' }}>
            {vm.resMemo}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '28px' }}>
          <div className="dd-restart" onClick={onRestart} style={{ background: '#17233a', color: '#fff', fontSize: '13px', fontWeight: 700, borderRadius: '999px', padding: '12px 28px', boxShadow: '0 8px 22px rgba(23,35,58,.22)', cursor: 'pointer' }}>
            もう一度診断する
          </div>
        </div>
      </div>
    </div>
  )
}
