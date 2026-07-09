import type { CSSProperties } from 'react'

interface LandingProps {
  grad: string
  satire: boolean
  showHints: boolean
  onToggleSatire: () => void
  onToggleHints: () => void
  onStart: () => void
}

const LAYER_LABELS = [
  '顧客獲得', '技術普及', '課題定義', '構造設計', '推進責任', '実装責任',
  '品質責任', '基盤責任', '通信責任', 'データ責任', '運用改善', '専門統制',
  '研究開発', '技術経営',
]

const chip: CSSProperties = {
  fontSize: '10.5px',
  fontWeight: 500,
  color: '#6b7a94',
  background: 'rgba(255,255,255,.65)',
  border: '1px solid #e0e7f3',
  borderRadius: '999px',
  padding: '4px 11px',
}

export function Landing({ grad, satire, showHints, onToggleSatire, onToggleHints, onStart }: LandingProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: grad,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '78px 24px 60px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ font: "600 10.5px 'JetBrains Mono',monospace", letterSpacing: '.22em', color: '#7c8aa5', marginBottom: '16px' }}>
        IT CAREER APTITUDE DIAGNOSTICS
      </div>
      <h1 style={{ fontSize: '46px', fontWeight: 900, color: '#17233a', letterSpacing: '.02em', lineHeight: 1.2, margin: 0, textAlign: 'center' }}>
        IT職種適性診断
      </h1>
      <div style={{ fontSize: '14px', lineHeight: 1.9, color: '#5f6f8a', maxWidth: '620px', textAlign: 'center', marginTop: '14px' }}>
        職種名を当てる診断ではありません。いまの仕事がどの価値レイヤーにあり、
        <br />
        作業なのか判断なのか、次にどこへ遷移できる状態なのかを判定します。
      </div>

      <div style={{ display: 'flex', gap: '28px', marginTop: '44px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div
          className="dd-card"
          onClick={onStart}
          style={{
            width: '320px',
            height: '290px',
            background: 'rgba(255,255,255,.78)',
            border: '1px solid rgba(255,255,255,.9)',
            borderRadius: '20px',
            boxShadow: '0 18px 50px rgba(35,60,110,.10),0 2px 6px rgba(35,60,110,.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2e6be6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: '14px' }}
          >
            <rect width="8" height="8" x="3" y="3" rx="2" />
            <path d="M7 11v4a2 2 0 0 0 2 2h4" />
            <rect width="8" height="8" x="13" y="13" rx="2" />
          </svg>
          <div style={{ fontSize: '17px', fontWeight: 700, color: '#17233a' }}>診断をはじめる</div>
          <div style={{ fontSize: '12px', color: '#8493ab' }}>最大20問 · 約7分 · 5層判定</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', justifyContent: 'center', maxWidth: '720px', marginTop: '40px' }}>
        {LAYER_LABELS.map((l) => (
          <div key={l} style={chip}>
            {l}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '34px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Toggle label="風刺表現" on={satire} onClick={onToggleSatire} />
        <Toggle label="LIVEヒント" on={showHints} onClick={onToggleHints} />
      </div>

      <div style={{ fontSize: '10.5px', color: '#9aa7bd', marginTop: '18px' }}>
        診断はブラウザ内で完結します。回答が外部に送信されることはありません。
      </div>
    </div>
  )
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        userSelect: 'none',
        background: 'rgba(255,255,255,.6)',
        border: '1px solid #e0e7f3',
        borderRadius: '999px',
        padding: '5px 12px 5px 10px',
      }}
    >
      <div
        style={{
          width: '26px',
          height: '15px',
          borderRadius: '999px',
          background: on ? '#3a6fe0' : '#c6cfdd',
          position: 'relative',
          transition: 'background .2s',
          flex: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: on ? '13px' : '2px',
            width: '11px',
            height: '11px',
            borderRadius: '50%',
            background: '#fff',
            transition: 'left .2s',
            boxShadow: '0 1px 2px rgba(0,0,0,.2)',
          }}
        />
      </div>
      <span style={{ fontSize: '11px', fontWeight: 600, color: '#5f6f8a' }}>{label}</span>
    </div>
  )
}
