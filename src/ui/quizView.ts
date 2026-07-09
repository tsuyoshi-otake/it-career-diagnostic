// Builds the quiz screen view-model: the live flowchart band (camera offset,
// layer cards, L-chips, gate, branch states, transition chips, path trail) plus
// the question panel. Ported from quizVals().

import { LAYERS, P1, PHASES, STATES, TRANSJP } from '../engine/data'
import { computeAll, maturity, reachSet, sortedLayers } from '../engine/diagnose'
import type { DiagContext, LayerKey, RuntimeOption, RuntimeQuestion } from '../engine/types'
import { hintFor } from './hints'

// A degeneration state's display nickname (satire vs. neutral).
function stateNick(jp: string, satire: boolean): string {
  return satire ? jp : '要注意状態'
}

export interface OptionVM {
  l: string
  d: string
  bg: string
  bd: string
  sh: string
  rb: string
  lw: number
}

export interface LayerCardVM {
  pct: string
  track: string
  barCl: string
  gain: string
  gainOp: string
  name: string
  sub: string
  chk: string
  bg: string
  bd: string
  cl: string
  subCl: string
}

export interface ChipVM {
  t: string
  cl: string
  bg: string
  bd: string
}

export interface StateCardVM {
  mono: string
  jp: string
  bg: string
  bd: string
  cl: string
  subCl: string
}

export interface DiamondVM {
  border: string
  shadow: string
  color: string
  anim: string
  sub: string
}

export interface QuizVM {
  qPhaseLabel: string
  qPhaseColor: string
  qCounter: string
  qTitle: string
  qHelp: string
  optDisplay: string
  optCols: string
  qOptions: OptionVM[]
  hintChipShow: boolean
  hintFx: string
  hintNote: string
  hintFxCl: string
  hintFxBg: string
  canBack: boolean
  proceedBg: string
  proceedShadow: string
  proceedCursor: string
  chartY: number
  segs: { bg: string }[]
  d1: DiamondVM
  d2: DiamondVM
  d3: DiamondVM
  chartLayers: LayerCardVM[]
  lchips: ChipVM[]
  gateMono: string
  gateSub: string
  gateSubCl: string
  gateBg: string
  gateBd: string
  gateCl: string
  chartStates: StateCardVM[]
  transChips: ChipVM[]
  trailP1: string
  trailP2: string
  trailP3: string
  trailP4: string
  trailP5: string
}

interface Glow {
  bd: string
  sh: string
  cl: string
}

function glow(on: boolean, col: string, rgb: string): Glow {
  return {
    bd: on ? '2px solid ' + col : '1.5px solid #b6c6e8',
    sh: on
      ? '0 0 0 7px rgba(' + rgb + ',.10),0 10px 26px rgba(' + rgb + ',.22)'
      : '0 4px 14px rgba(46,107,230,.08)',
    cl: on ? col : '#17233a',
  }
}

export interface QuizViewInput {
  history: number[]
  sel: number | null
  bandH: number
  satire: boolean
  showHints: boolean
}

/** Returns null when there is no next question (diagnosis complete). */
export function buildQuizView(input: QuizViewInput): { vm: QuizVM; q: RuntimeQuestion; ctx: DiagContext } | null {
  const { history, sel, bandH, satire, showHints } = input
  const L = LAYERS
  const { ctx, nextQ } = computeAll(history)
  if (!nextQ) return null
  const q = nextQ
  const phase = q.phase
  const P = PHASES[phase]
  const answered = history.length

  const treeMax: Record<LayerKey, number> = {
    sales: 3, evangelism: 3, consulting: 3, architecture: 3, delivery: 3,
    implementation: 4, quality: 4, infrastructure: 4, network: 4, data: 4, operations: 4, governance: 3,
    research: 4, leadership: 4,
  }
  const est = P1.length + 4 + 3 + (ctx.layer ? treeMax[ctx.layer] : 4) + 2

  const selCl = phase === 3 ? '#d64545' : '#2e6be6'
  const selBg = phase === 3 ? '#fdf7f7' : '#f5f8fe'
  const selShRGB = phase === 3 ? '214,69,69' : '46,107,230'
  const qOptions: OptionVM[] = q.opts.map((o: RuntimeOption, i: number) => ({
    l: o.l,
    d: o.d || '',
    bg: sel === i ? selBg : '#fff',
    bd: sel === i ? '1.5px solid ' + selCl : '1px solid #e3e9f5',
    sh: sel === i ? '0 0 0 3px rgba(' + selShRGB + ',.10)' : 'none',
    rb: sel === i ? '4.5px solid ' + selCl : '1.5px solid #b9c7de',
    lw: sel === i ? 700 : 500,
  }))

  const hint = sel !== null && showHints ? hintFor(q, q.opts[sel], ctx) : null

  const H = bandH || 318
  const bandCenter = ({ 1: 120, 2: 255, 3: 385, 4: 487, 5: 559 } as Record<number, number>)[phase]
  const yTarget = H / 2 - bandCenter
  const yMin = Math.min(0, H - 600)
  const yMax = Math.max(0, H - 600)
  const chartY = Math.round(Math.max(yMin, Math.min(yMax, yTarget)))

  const segCols = ['#2e6be6', '#6a5be2', '#d64545', '#2f9268', '#b07a2e']
  const segs = segCols.map((c, i) => ({ bg: i + 1 < phase ? c : i + 1 === phase ? c : '#e3e9f5' }))

  const g1 = glow(phase === 1, '#2e6be6', '46,107,230')
  const g2 = glow(phase === 2, '#6a5be2', '106,91,226')
  const g3 = glow(phase === 3, '#d64545', '214,69,69')
  const d1: DiamondVM = {
    border: g1.bd, shadow: g1.sh, color: g1.cl,
    anim: phase === 1 ? 'ddpulseB 2.4s ease-in-out infinite' : 'none',
    sub: phase === 1 ? '判定中 · ' + (ctx.p1 + 1) + '/' + P1.length : ctx.layer ? L[ctx.layer].name + ' に確定' : 'どこで価値を出すか',
  }
  const d2: DiamondVM = {
    border: g2.bd, shadow: g2.sh, color: g2.cl,
    anim: phase === 2 ? 'ddpulseP 2.4s ease-in-out infinite' : 'none',
    sub: phase < 2 ? '作業か 判断か' : phase === 2 ? '判定中 · ' + (ctx.p2 + 1) + '/4' : 'L' + maturity(ctx) + ' に確定',
  }
  const d3: DiamondVM = {
    border: g3.bd, shadow: g3.sh, color: phase === 3 ? '#d64545' : '#c24a4a',
    anim: phase === 3 ? 'ddpulseR 2.4s ease-in-out infinite' : 'none',
    sub: phase < 3 ? 'スコアより優先' : phase === 3 ? '判定中 · ' + (ctx.g + 1) + '/3' : ctx.gateP >= 3 ? '該当' : ctx.gateP === 2 ? '接近' : '通過',
  }

  const sortedL = sortedLayers(ctx.scores)
  const anyScore = sortedL.some((k) => ctx.scores[k] > 0)
  const top4: LayerKey[] = anyScore ? sortedL.slice(0, 4) : ['consulting', 'implementation', 'infrastructure', 'data']
  const scoreRef = Math.max(4, ctx.scores[sortedL[0]] || 0)
  const chartLayers: LayerCardVM[] = top4.map((k) => {
    const locked = ctx.layer === k
    const lead = !ctx.layer && anyScore && k === sortedL[0]
    const gainW = (ctx.lastW || []).find((w) => w[0] === k)
    return {
      pct: Math.round((ctx.scores[k] / scoreRef) * 100) + '%',
      track: phase === 1 ? 'rgba(46,107,230,.10)' : 'transparent',
      barCl: phase !== 1 ? 'transparent' : locked || lead ? '#2e6be6' : '#b9c9e8',
      gain: gainW ? '+' + gainW[1] : '',
      gainOp: gainW ? '1' : '0',
      name: L[k].name,
      sub: locked ? L[k].ex : anyScore ? ctx.scores[k] + '点 · ' + L[k].ex : L[k].ex,
      chk: locked ? ' ✓' : '',
      bg: locked ? '#e7f0ff' : lead ? '#eef4fd' : 'rgba(255,255,255,.7)',
      bd: locked ? '2px solid #2e6be6' : lead ? '1.5px solid #7ea3ef' : '1px solid #dbe3f2',
      cl: locked ? '#1d55c4' : lead ? '#2e6be6' : '#5f6f8a',
      subCl: locked || lead ? '#6b87c2' : 'rgba(132,147,171,.8)',
    }
  })

  let lvShow: number | null = null
  let lvFinal = false
  if (ctx.p2 >= 4) {
    lvShow = maturity(ctx)
    lvFinal = true
  } else if (ctx.mPts.length > 0) {
    lvShow = Math.max(0, Math.min(4, Math.round(ctx.mPts.reduce((a, b) => a + b, 0) / ctx.mPts.length + ctx.mBonus)))
  }
  const lchips: ChipVM[] = [0, 1, 2, 3, 4].map((i) => ({
    t: 'L' + i,
    cl: lvShow === i ? (lvFinal ? '#fff' : '#6a5be2') : '#a5b0c4',
    bg: lvShow === i ? (lvFinal ? '#6a5be2' : '#f4f2fd') : 'rgba(255,255,255,.5)',
    bd: lvShow === i ? (lvFinal ? '1px solid #6a5be2' : '1.5px dashed #9c8fe8') : '1px solid rgba(226,224,244,.8)',
  }))

  const gLayer: LayerKey = ctx.layer || 'data'
  const gHot = ctx.gateP >= 2
  const gPass = ctx.g >= 1 && ctx.gateP >= 0 && ctx.gateP <= 1
  let gateMono: string, gateSub: string, gateSubCl: string, gateBg: string, gateBd: string, gateCl: string
  if (!ctx.layer) {
    gateMono = '???'
    gateSub = '第1層の結果で決まる'
    gateSubCl = 'rgba(179,191,210,.9)'
    gateBg = 'rgba(255,255,255,.3)'
    gateBd = '1px dashed rgba(198,210,232,.8)'
    gateCl = '#b3bfd2'
  } else {
    gateMono = L[gLayer].gate
    gateSub = stateNick(nickJp(L[gLayer].gate), satire) + ' — 退化状態'
    gateSubCl = '#c08585'
    gateBg = gHot ? '#fbecec' : gPass ? 'rgba(255,255,255,.35)' : 'rgba(253,246,246,.6)'
    gateBd = gHot ? '2px solid #d64545' : gPass ? '1px dashed rgba(220,201,201,.8)' : '1px solid rgba(238,191,191,.65)'
    gateCl = gHot ? '#c23d3d' : gPass ? '#c4a8a8' : 'rgba(184,74,74,.6)'
  }

  let rset: Set<string> | null = null
  if (ctx.g >= 3 && !ctx.terminal) rset = reachSet(L[gLayer], ctx.treeNode || L[gLayer].tree.start)
  let chartStates: StateCardVM[]
  if (!ctx.layer) {
    chartStates = [0, 1, 2, 3].map(() => ({
      mono: '─', jp: '第1層で確定', bg: 'rgba(255,255,255,.3)', bd: '1px dashed rgba(198,210,232,.7)', cl: '#b3bfd2', subCl: 'rgba(179,191,210,.85)',
    }))
  } else {
    chartStates = L[gLayer].chain.map((id) => {
      const isT = ctx.terminal === id
      const out = (ctx.terminal && !isT) || (rset && !rset.has(id))
      return {
        mono: id,
        jp: stateTp(id),
        bg: isT ? '#e9f7f0' : out ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.7)',
        bd: isT ? '2px solid #2f9268' : out ? '1px dashed rgba(191,213,201,.7)' : '1px solid #cfe2d7',
        cl: isT ? '#1f7a4f' : out ? '#b9c4d6' : '#2563c9',
        subCl: isT ? '#4d9271' : out ? 'rgba(185,196,214,.7)' : 'rgba(132,147,171,.75)',
      }
    })
  }

  const transChips: ChipVM[] = (
    [
      ['adjacent', TRANSJP.adjacent],
      ['upgrade', TRANSJP.upgrade],
      ['compensate', TRANSJP.compensate],
      ['retreat', TRANSJP.retreat],
    ] as [string, string][]
  ).map((p) => {
    const on = ctx.env === p[0]
    return {
      t: p[1],
      cl: on ? '#8a5d13' : 'rgba(154,107,35,.5)',
      bg: on ? '#f9edd2' : 'rgba(255,253,248,.45)',
      bd: on ? '2px solid #c8963d' : '1px solid rgba(236,217,189,.6)',
    }
  })

  // ---- selected path trail ----
  let t1 = '', t2 = '', t3 = '', t4 = '', t5 = ''
  const li = ctx.layer ? top4.indexOf(ctx.layer) : -1
  if (li >= 0) {
    const lx = 155 + 185 * li
    t1 = 'M520 106 V118 H' + lx + ' V128'
    t2 = 'M' + lx + ' 192 V204 H520 V226'
  }
  if (lvFinal && lvShow !== null) {
    const cx = 641 + 50 * lvShow
    t2 += ' M548 255 H' + (cx - 23)
    t3 = 'M520 284 V356'
  }
  let sx = 520
  const chain2 = L[gLayer].chain
  if (ctx.g >= 1 && ctx.gateP >= 2) t3 += ' M492 385 H316'
  if (ctx.g >= 3) t4 = 'M520 414 V444'
  if (ctx.terminal) {
    const ti2 = chain2.indexOf(ctx.terminal)
    if (ti2 >= 0) {
      const n = chain2.length
      const itemW = n >= 4 ? (580 - 12 * (n - 1)) / n : 150
      const startX = 250 + (580 - (itemW * n + 12 * (n - 1))) / 2
      sx = Math.round(startX + itemW / 2 + (itemW + 12) * ti2)
      t4 += ' M520 444 H' + sx + ' V456'
    }
  }
  if (ctx.env) {
    const ei = ({ adjacent: 0, upgrade: 1, compensate: 2, retreat: 3 } as Record<string, number>)[ctx.env]
    const tx = Math.round(240 + 163.33 * ei + 55)
    t5 = ctx.terminal && chain2.indexOf(ctx.terminal) >= 0 ? 'M' + sx + ' 508 V526 H' + tx + ' V542' : 'M520 444 V526 H' + tx + ' V542'
  }

  const vm: QuizVM = {
    qPhaseLabel: P.l,
    qPhaseColor: P.c,
    qCounter: 'Q' + (answered + 1) + ' / 約' + est + '問',
    qTitle: q.t,
    qHelp: q.h || '',
    optDisplay: q.grid ? 'grid' : 'flex',
    optCols: q.grid ? '1fr 1fr' : 'none',
    qOptions,
    hintChipShow: !!(hint && hint.fx),
    hintFx: hint ? hint.fx : '',
    hintNote: hint ? hint.note : showHints ? '回答を選ぶと、判定への影響をここに表示します。' : '回答を選んで「この回答で進む」を押してください。',
    hintFxCl: phase === 3 ? '#c24a4a' : '#2563c9',
    hintFxBg: phase === 3 ? '#f9e9e9' : '#e7eefb',
    canBack: answered > 0,
    proceedBg: sel === null ? '#b9c7de' : '#3a6fe0',
    proceedShadow: sel === null ? 'none' : '0 8px 22px rgba(46,107,230,.28)',
    proceedCursor: sel === null ? 'default' : 'pointer',
    chartY,
    segs,
    d1, d2, d3,
    chartLayers,
    lchips,
    gateMono, gateSub, gateSubCl, gateBg, gateBd, gateCl,
    chartStates,
    transChips,
    trailP1: t1, trailP2: t2, trailP3: t3, trailP4: t4, trailP5: t5,
  }
  return { vm, q, ctx }
}

function nickJp(id: string): string {
  return STATES[id].jp
}
function stateTp(id: string): string {
  return STATES[id].tp
}
