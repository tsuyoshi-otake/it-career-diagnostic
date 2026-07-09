// The 5-layer diagnostic engine, ported from the design source as pure functions.
// Value layer (1) → responsibility maturity (2) → degeneration gate (3) →
// layer-specific branch tree (4) → transition decision (5).

import { LAYERS, LAYER_KEYS, LVJP, P1, P2, SKILLJP, STATES, TRANSJP } from './data'
import type {
  DiagContext,
  DiagnosisResult,
  LayerKey,
  MaturityLevel,
  RuntimeOption,
  RuntimeQuestion,
  TransitionType,
} from './types'

export function initCtx(): DiagContext {
  const scores = {} as Record<LayerKey, number>
  LAYER_KEYS.forEach((k) => {
    scores[k] = 0
  })
  return {
    p1: 0, p2: 0, g: 0, p5: 0, scores, mPts: [], mBonus: 0, layer: null, apt: null,
    gateP: -1, mkt: -1, imp: -1, treeNode: null, treeDone: false, terminal: null,
    flags: {}, skills: [], failT: null, env: null, use: null, log: [], p2Labels: [],
  }
}

export function primaryOf(scores: Record<LayerKey, number>): LayerKey {
  let best = LAYER_KEYS[0]
  LAYER_KEYS.forEach((k) => {
    if (scores[k] > scores[best]) best = k
  })
  return best
}

export function sortedLayers(scores: Record<LayerKey, number>): LayerKey[] {
  return LAYER_KEYS.slice().sort((a, b) => scores[b] - scores[a])
}

export function questionAt(ctx: DiagContext): RuntimeQuestion | null {
  const L = LAYERS
  if (ctx.p1 < P1.length) {
    const q = P1[ctx.p1]
    return { kind: 'p1', phase: 1, idx: ctx.p1, t: q.t, h: q.h, grid: q.grid, opts: q.opts as RuntimeOption[] }
  }
  if (!ctx.layer) ctx.layer = primaryOf(ctx.scores)
  if (ctx.p2 < 4) {
    const q = P2[ctx.p2]
    return { kind: 'p2', phase: 2, idx: ctx.p2, t: q.t, h: q.h || 'L0(受動実行)からL4(責任所有)を判定します。', opts: q.opts as RuntimeOption[] }
  }
  const lay = L[ctx.layer]
  if (ctx.g === 0)
    return { kind: 'g1', phase: 3, t: lay.gq, h: 'ここはスコアではなく強制ゲートです。該当すると職種名に関係なく退化状態が付与されます。正直に。', opts: [
      { l: 'ほぼ 0割', p: 0 }, { l: '3割未満', p: 1 }, { l: '半分くらい', p: 2 }, { l: 'ほぼ全部', p: 3 }] }
  if (ctx.g === 1)
    return { kind: 'g2', phase: 3, t: '直近1年の仕事を、社外の人に「成果物」で説明できますか?', h: '職務経歴書に書ける形で残っているか、です。', opts: [
      { l: '公開・共有できる成果物がある', r: 0, skill: 'explainable_portfolio' }, { l: '整理すれば出せる', r: 1 },
      { l: '守秘で出せないが、口頭でなら説明できる', r: 1 }, { l: '成果物と呼べるものがない', r: 2 }] }
  if (ctx.g === 2)
    return { kind: 'g3', phase: 3, t: '直近半年で、仕組み・自動化・標準化を何か残しましたか?', h: '「自分がいなくても回るもの」を残したか。', opts: [
      { l: '残した(いまも使われている)', r: 0, skill: 'improvement_legacy' }, { l: '提案したが定着していない', r: 1 }, { l: '残していない', r: 2 }] }
  if (!ctx.terminal) {
    const node = lay.tree.nodes[ctx.treeNode || lay.tree.start]
    return { kind: 'tree', phase: 4, t: node.t, h: node.h || lay.name + 'レイヤーの分岐です。実態で答えてください。', opts: node.opts as RuntimeOption[] }
  }
  if (ctx.p5 === 0)
    return { kind: 'p5a', phase: 5, t: 'いまの現場で、この半年に現実的に起きそうなことは?', h: '願望ではなく、構造的にありえる変化を。', opts: [
      { l: 'より重い責任を任されつつある', tt: 'upgrade' }, { l: '隣の領域に手を伸ばせる余地がある', tt: 'adjacent' },
      { l: '弱点を埋める時間・機会は作れる', tt: 'compensate' }, { l: '作業内容は、たぶん何も変わらない', tt: 'retreat' }] }
  if (ctx.p5 === 1)
    return { kind: 'p5b', phase: 5, t: 'この診断結果を、まず何に使いますか?', h: '', opts: [
      { l: 'いまの現場で評価を上げる材料にする', u: 'internal' }, { l: '案件・配属を変える判断材料にする', u: 'move' },
      { l: '転職・市場価値の確認に使う', u: 'market' }, { l: 'まだ決めていない', u: 'tbd' }] }
  return null
}

export function resolveEnd(o: RuntimeOption, ctx: DiagContext): string | null {
  if (o.end) return o.end
  if (o.endIf) return ctx.flags[o.endIf.flag] ? o.endIf.yes : o.endIf.no
  return null
}

export function applyAnswer(ctx: DiagContext, q: RuntimeQuestion, i: number): void {
  const o = q.opts[Math.min(i, q.opts.length - 1)]
  const ph = q.phase
  let fx = ''
  ctx.lastW = q.kind === 'p1' ? o.w || [] : null
  if (q.kind === 'p1') {
    ;(o.w || []).forEach((w) => {
      ctx.scores[w[0]] += w[1]
    })
    if (o.m) ctx.mBonus += 0.15
    if (q.idx === 2 && o.w && o.w.length) ctx.apt = o.w[0][0]
    ctx.p1++
    fx = (o.w || []).map((w) => w[0] + ' +' + w[1]).join(' ') || 'no signal'
  } else if (q.kind === 'p2') {
    ctx.mPts.push(o.v!)
    ctx.p2Labels.push(o.l)
    ctx.p2++
    fx = 'L' + o.v + ' シグナル'
  } else if (q.kind === 'g1') {
    ctx.gateP = o.p!
    ctx.g++
    fx = 'gate ' + o.p + '/3'
  } else if (q.kind === 'g2') {
    ctx.mkt = o.r!
    if (o.skill) ctx.skills.push(o.skill)
    ctx.g++
    fx = o.r === 2 ? 'market_risk' : o.r === 0 ? 'portfolio ✓' : 'portfolio 要整理'
  } else if (q.kind === 'g3') {
    ctx.imp = o.r!
    if (o.skill) ctx.skills.push(o.skill)
    ctx.g++
    fx = o.r === 0 ? 'improvement ✓' : o.r === 1 ? 'improvement 未定着' : 'improvement なし'
  } else if (q.kind === 'tree') {
    ;(o.skills || []).forEach((s) => ctx.skills.push(s))
    if (o.flag) ctx.flags[o.flag] = 1
    if (o.go) {
      ctx.treeNode = o.go
      fx = '分岐継続'
    } else {
      ctx.terminal = resolveEnd(o, ctx)
      ctx.failT = q.t
      fx = '→ ' + ctx.terminal
    }
  } else if (q.kind === 'p5a') {
    ctx.env = o.tt!
    ctx.p5++
    fx = TRANSJP[o.tt!] + ' 候補'
  } else if (q.kind === 'p5b') {
    ctx.use = o.u!
    ctx.p5++
    fx = 'output 調整'
  }
  ctx.log.push({ ph, q: q.t, a: o.l, fx })
}

/** Replay the full answer history into a fresh context, returning it and the next question. */
export function computeAll(history: number[]): { ctx: DiagContext; nextQ: RuntimeQuestion | null } {
  const ctx = initCtx()
  for (const h of history) {
    const q = questionAt(ctx)
    if (!q) break
    applyAnswer(ctx, q, h)
  }
  const nextQ = questionAt(ctx)
  return { ctx, nextQ }
}

export function maturity(ctx: DiagContext): MaturityLevel | null {
  if (ctx.mPts.length < 4) return null
  let lv = Math.round(ctx.mPts.reduce((a, b) => a + b, 0) / 4 + ctx.mBonus)
  if (ctx.mPts[3] <= 1) lv = Math.min(lv, 2)
  return Math.max(0, Math.min(4, lv)) as MaturityLevel
}

export function reachSet(layer: (typeof LAYERS)[LayerKey], nodeId: string): Set<string> {
  const out = new Set<string>()
  const walk = (nid: string) => {
    const n = layer.tree.nodes[nid]
    n.opts.forEach((o) => {
      if (o.go) walk(o.go)
      else if (o.end) out.add(o.end)
      else if (o.endIf) {
        out.add(o.endIf.yes)
        out.add(o.endIf.no)
      }
    })
  }
  walk(nodeId)
  return out
}

export function buildResult(ctx: DiagContext): DiagnosisResult {
  const S = STATES
  const L = LAYERS
  const lay = L[ctx.layer!]
  const lv = maturity(ctx) as MaturityLevel
  const sorted = sortedLayers(ctx.scores)
  const sec = ctx.scores[sorted[1]] >= 3 ? sorted[1] : null
  let terminal = ctx.terminal!
  const termIsDeg = !!S[terminal].deg
  const confirmed = termIsDeg || ctx.gateP === 3 || (ctx.gateP === 2 && ctx.imp === 2)
  const near = !confirmed && ctx.gateP === 2
  const degId = termIsDeg ? terminal : lay.gate
  const chain = lay.chain
  let ti = chain.indexOf(terminal)
  let demoted = false
  const orig = terminal
  if (lv <= 1 && ti > 1) {
    demoted = true
    terminal = chain[1]
    ti = 1
  }
  let type: TransitionType
  if (confirmed && ctx.env === 'retreat') type = 'retreat'
  else if (confirmed) type = 'compensate'
  else if (ctx.env === 'retreat') type = 'retreat'
  else if (lv <= 1) type = 'compensate'
  else if (ctx.env === 'adjacent') type = 'adjacent'
  else if (ctx.env === 'compensate') type = 'compensate'
  else type = ti >= chain.length - 1 ? 'adjacent' : 'upgrade'
  let target: string
  let adjLayer: LayerKey | null = null
  if (type === 'adjacent') {
    adjLayer = ctx.apt && ctx.apt !== ctx.layer ? ctx.apt : sec || lay.adj
    target = L[adjLayer].chain[Math.min(1, L[adjLayer].chain.length - 1)]
  } else if (type === 'upgrade') {
    target = chain[Math.min(ti < 0 ? 0 : ti + 1, chain.length - 1)]
  } else {
    target = ti < 0 ? chain[0] : chain[Math.min(ti + 1, chain.length - 1)]
  }
  return { ctx, lv, sorted, sec, terminal, orig, demoted, confirmed, near, degId, chain, ti, type, target, adjLayer }
}

export function reasonText(r: DiagnosisResult): string {
  const S = STATES
  const L = LAYERS
  const ctx = r.ctx
  const lay = L[ctx.layer!]
  const t = S[r.terminal]
  const tg = S[r.target]
  let s = lay.name + 'レイヤーが主戦場(スコア' + ctx.scores[ctx.layer!] + '点' + (r.sec ? '、次点は' + L[r.sec].name : '') + ')。'
  s += '責任について「' + ctx.p2Labels[3] + '」と回答しているため L' + r.lv + '(' + LVJP[r.lv] + ')。'
  if (r.confirmed) s += 'ただし強制ゲートに該当し、' + r.degId + '(' + S[r.degId].jp + ')が付与される。職種名よりゲートが優先。'
  else if (r.near) s += '単純作業の比率が高く、' + r.degId + '(' + S[r.degId].jp + ')への接近が見られる。'
  if (r.demoted) s += '成熟度がL' + r.lv + 'のため、分岐上の' + S[r.orig].jp + 'ではなく実行寄りの状態に補正。'
  s += '職種分岐では' + t.jp + '(' + t.tp + ')。' + t.d
  s += '推奨は' + TRANSJP[r.type] + 'で、次の状態候補は' + tg.jp + '(' + r.target + ')。'
  return s
}

export function buildMemo(r: DiagnosisResult): string {
  const S = STATES
  const L = LAYERS
  const ctx = r.ctx
  const lay = L[ctx.layer!]
  const t = S[r.terminal]
  const tg = S[r.target]
  const lines: string[] = []
  lines.push('# IT職種適性診断 結果')
  lines.push('')
  lines.push('- 主状態: ' + r.terminal + '(' + t.jp + ' / ' + t.tp + ')')
  lines.push('- 価値レイヤー: ' + lay.name + '(スコア ' + ctx.scores[ctx.layer!] + '点)' + (r.sec ? ' / 副戦場: ' + L[r.sec].name : ''))
  lines.push('- 責任成熟度: L' + r.lv + '(' + LVJP[r.lv] + ')')
  lines.push('- 退化リスク: ' + (r.confirmed ? r.degId + ' 該当' : r.near ? r.degId + ' 接近' : 'なし'))
  lines.push('- 市場価値リスク: ' + (ctx.mkt === 2 ? 'あり(外部説明可能な成果物なし)' : ctx.mkt === 1 ? '要整理' : 'なし'))
  lines.push('- 遷移タイプ: ' + TRANSJP[r.type] + ' → ' + r.target + '(' + tg.jp + ')')
  lines.push('')
  lines.push('## 判定理由')
  lines.push(reasonText(r))
  lines.push('')
  lines.push('## ポータブルスキル')
  const sk = [...new Set(ctx.skills)]
  if (sk.length) sk.forEach((s) => lines.push('- ' + s + '(' + SKILLJP[s] + ')'))
  else lines.push('- (回答から確認できた移転可能スキルはありません — まず証跡づくりから)')
  lines.push('')
  lines.push('## 次のアクション')
  t.a.forEach((a, i) => lines.push(i + 1 + '. ' + a))
  lines.push('')
  lines.push('## 避けるべき案件')
  lay.avoid.forEach((a) => lines.push('- ' + a))
  lines.push('')
  lines.push('## 回答ログ')
  ctx.log.forEach((g) => lines.push('- [第' + g.ph + '層] ' + g.q + ' → ' + g.a + '(' + g.fx + ')'))
  return lines.join('\n')
}
