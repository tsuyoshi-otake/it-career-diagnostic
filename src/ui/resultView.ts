// Builds the result screen view-model. Ported from resultVals() + buildResult().

import { LAYERS, LVJP, SKILLJP, STATES, TRANSJP } from '../engine/data'
import { buildMemo, buildResult, computeAll, reasonText } from '../engine/diagnose'
import type { LayerKey, TransitionType } from '../engine/types'

const PH_COL: Record<number, string> = { 1: '#2e6be6', 2: '#6a5be2', 3: '#c24a4a', 4: '#2f9268', 5: '#b07a2e' }

export interface KvVM {
  k: string
  v: string
  vc: string
}
export interface ChainRowVM {
  mono: string
  jp: string
  bg: string
  bd: string
  cl: string
  mk: string
  mkCl: string
}
export interface LogRowVM {
  c: string
  ph: string
  q: string
  a: string
  fx: string
}
export interface SkillVM {
  mono: string
  jp: string
}

export interface ResultVM {
  resPrimaryMono: string
  resPrimaryJp: string
  resPrimaryType: string
  resPrimaryDesc: string
  riskChipText: string
  riskChipCl: string
  riskChipBg: string
  resSummary: string
  resReason: string
  resKv: KvVM[]
  resLevelText: string
  resMeter: { bg: string }[]
  resSecondaryLine: string
  chainView: ChainRowVM[]
  resTransChip: string
  resTransChipBg: string
  resTransChipCl: string
  resTransLine: string
  resTransNote: string
  riskShow: boolean
  riskBadge: string
  riskMono: string
  riskJp: string
  riskDesc: string
  riskEsc: { t: string }[]
  resLog: LogRowVM[]
  resActions: { n: string; t: string }[]
  resAvoids: { t: string }[]
  resSkills: SkillVM[]
  resSkillNote: string
  resMemo: string
}

const nick = (id: string, satire: boolean) => (satire ? STATES[id].jp : '要注意状態')

/** Returns null when the diagnosis is not yet complete. */
export function buildResultView(history: number[], satire: boolean): ResultVM | null {
  const S = STATES
  const L = LAYERS
  const { ctx, nextQ } = computeAll(history)
  if (nextQ) return null
  const r = buildResult(ctx)
  const lay = L[ctx.layer!]
  const t = S[r.terminal]
  const tg = S[r.target]

  const capSk = [...new Set(ctx.skills)].filter((s) => s !== 'explainable_portfolio' && s !== 'improvement_legacy')
  const capJp = capSk.length ? SKILLJP[capSk[capSk.length - 1]] : null
  let summary = '現在は' + t.jp + '(' + t.tp + ')。'
  summary += capJp ? capJp + 'ができるため L' + r.lv + '。' : '確認できた判断証跡が少なく L' + r.lv + '。'
  if (r.confirmed) summary += 'ただし' + nick(r.degId, satire) + '状態に該当 — まず補償が必要。'
  else if (r.near) summary += nick(r.degId, satire) + 'への接近に注意。'
  if (r.type === 'retreat') summary += '価値が伸びない環境からの撤退を推奨。'
  else if (r.type === 'adjacent') summary += '次は' + L[(r.adjLayer || lay.adj) as LayerKey].name + 'レイヤーの' + tg.jp + 'へ、経験を横展開する局面。'
  else if (r.target === r.terminal) summary += 'まずは今の状態の証跡を、外部に見せられる形に整えるのが先決。'
  else summary += tg.jp + 'へ進むには「' + tg.tp + '」の証跡が必要。'

  const kv: KvVM[] = [
    { k: '価値レイヤー', v: lay.name + '(' + ctx.scores[ctx.layer!] + '点)', vc: '#17233a' },
    { k: '責任成熟度', v: 'L' + r.lv + ' · ' + LVJP[r.lv], vc: '#6a5be2' },
    { k: '退化リスク', v: r.confirmed ? S[r.degId].jp + ' 該当' : r.near ? S[r.degId].jp + ' 接近' : 'なし', vc: r.confirmed || r.near ? '#c24a4a' : '#2f9268' },
    { k: '市場価値リスク', v: ctx.mkt === 2 ? 'あり(成果物なし)' : ctx.mkt === 1 ? '要整理' : 'なし', vc: ctx.mkt === 2 ? '#c24a4a' : '#17233a' },
    { k: '遷移タイプ', v: TRANSJP[r.type], vc: '#b07a2e' },
  ]

  let secLine = r.sec
    ? '副戦場: ' + L[r.sec].name + 'レイヤー(' + ctx.scores[r.sec] + '点)。隣接遷移の候補になります。'
    : '副戦場: 明確な次点レイヤーなし。主戦場に集中する局面です。'
  if (ctx.apt && ctx.apt !== ctx.layer) secLine += ' 適性シグナル(没頭)は' + L[ctx.apt].name + 'レイヤー — 現在地と別方向です。'

  const chainIds = [r.degId].concat(r.chain)
  const chainView: ChainRowVM[] = chainIds.map((id) => {
    const cur = id === r.terminal
    const next = id === r.target && !cur
    const deg = !!S[id].deg
    return {
      mono: id,
      jp: S[id].jp,
      bg: cur ? '#eef4fd' : next ? '#fffdf6' : deg ? '#fdf9f9' : '#fff',
      bd: cur ? '1.5px solid #2e6be6' : next ? '1.5px solid #d9b56a' : '1px solid #e8edf6',
      cl: deg ? '#b84a4a' : cur ? '#2563c9' : '#5f6f8a',
      mk: cur ? '現在地' : next ? '次の候補' : '',
      mkCl: cur ? '#2e6be6' : '#b07a2e',
    }
  })

  const transLines: Record<TransitionType, string> = {
    upgrade: tg.jp + '(' + r.target + ')へ、責任範囲を一段引き上げる',
    adjacent: (r.adjLayer ? L[r.adjLayer].name : L[lay.adj].name) + 'レイヤーの ' + tg.jp + ' へ、経験を横に広げる',
    compensate: '弱点を埋めてから ' + tg.jp + ' を狙う',
    retreat: '環境を変え、' + tg.jp + ' の実態を作れる案件へ移る',
  }
  const transNotes: Record<TransitionType, string> = {
    upgrade: '今の延長で届く距離です。次のアクションを成果物として残し、上位の責任を取りに行ってください。',
    adjacent: '今のスキルの多くがそのまま持ち運べます。主戦場の証跡を持って隣へ出ると強い遷移になります。',
    compensate: '不足しているのは能力ではなく証跡です。次のアクションを1つずつ成果物化すれば分岐の上位側に戻れます。',
    retreat: '今の環境では経験が市場価値に変換されません。同じ作業の継続は退化を進めます。案件・配属の変更を判断材料にしてください。',
  }

  const sk = [...new Set(ctx.skills)]

  return {
    resPrimaryMono: r.terminal,
    resPrimaryJp: t.jp,
    resPrimaryType: t.tp,
    resPrimaryDesc: t.d,
    riskChipText: r.confirmed ? '退化状態 該当' : r.near ? '退化リスク 接近' : '退化リスク なし',
    riskChipCl: r.confirmed ? '#fff' : r.near ? '#c24a4a' : '#2f9268',
    riskChipBg: r.confirmed ? '#c24a4a' : r.near ? '#f9e9e9' : '#edf7f2',
    resSummary: summary,
    resReason: reasonText(r),
    resKv: kv,
    resLevelText: 'L' + r.lv + ' · ' + LVJP[r.lv],
    resMeter: [0, 1, 2, 3, 4].map((i) => ({ bg: i <= r.lv ? '#6a5be2' : '#e8e5f6' })),
    resSecondaryLine: secLine,
    chainView,
    resTransChip: TRANSJP[r.type],
    resTransChipBg: ({ adjacent: '#fff7e9', upgrade: '#e9f0fd', compensate: '#f4f2fd', retreat: '#f9e9e9' } as Record<TransitionType, string>)[r.type],
    resTransChipCl: ({ adjacent: '#b07a2e', upgrade: '#2e6be6', compensate: '#6a5be2', retreat: '#c24a4a' } as Record<TransitionType, string>)[r.type],
    resTransLine: transLines[r.type],
    resTransNote: transNotes[r.type],
    riskShow: r.confirmed || r.near,
    riskBadge: r.confirmed ? '退化状態 該当' : '接近注意',
    riskMono: r.degId,
    riskJp: nick(r.degId, satire),
    riskDesc: S[r.degId].d + (r.confirmed ? (satire ? ' 該当中は、職種名を名乗っても市場はこの状態として評価します。' : '') : ' このままの作業比率が続くと該当に切り替わります。'),
    riskEsc: (S[r.degId].a || []).map((t2) => ({ t: t2 })),
    resLog: ctx.log.map((g) => ({ c: PH_COL[g.ph], ph: '第' + g.ph + '層', q: g.q, a: g.a, fx: g.fx })),
    resActions: t.a.map((a, i) => ({ n: '0' + (i + 1), t: a })),
    resAvoids: lay.avoid.map((a) => ({ t: a })),
    resSkills: sk.map((s) => ({ mono: s, jp: SKILLJP[s] || s })),
    resSkillNote: sk.length
      ? '回答で確認できた、次の状態にも持ち運べるスキルです。'
      : '回答から確認できた移転可能スキルはありません。まず「外部に説明できる証跡」づくりから始めてください。',
    resMemo: buildMemo(r),
  }
}
