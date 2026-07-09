// LIVE hint text shown under the selected option — ported from hintFor().

import { LAYERS, LVJP, STATES, TRANSJP } from '../engine/data'
import { resolveEnd } from '../engine/diagnose'
import type { DiagContext, RuntimeOption, RuntimeQuestion } from '../engine/types'

export interface Hint {
  fx: string
  note: string
}

export function hintFor(q: RuntimeQuestion, o: RuntimeOption, ctx: DiagContext): Hint {
  const S = STATES
  const L = LAYERS
  if (q.kind === 'p1') {
    if (!o.w || !o.w.length)
      return { fx: 'no signal', note: 'レイヤー加点なし。判断領域を持たない場合、上位状態には判定されません。' }
    const n = o.w.map((w) => L[w[0]].name + ' +' + w[1]).join('、')
    return {
      fx: o.w.map((w) => w[0] + ' +' + w[1]).join(' '),
      note: n + ' に加点します。' + (o.m ? '判断の所在として成熟度にも加点。' : ''),
    }
  }
  if (q.kind === 'p2') return { fx: 'L' + o.v + ' シグナル', note: '「' + LVJP[o.v!] + '」の兆候として成熟度判定に反映します。' }
  if (q.kind === 'g1') {
    const g = L[ctx.layer!].gate
    if (o.p === 3) return { fx: 'gate 3/3', note: '強制ゲート該当。' + g + '(' + S[g].jp + ')が付与されます。スコアよりゲートが優先。' }
    if (o.p === 2) return { fx: 'gate 2/3', note: 'ゲート接近。改善・標準化の証跡がなければ該当扱いになります。' }
    return { fx: 'gate ' + o.p + '/3', note: 'ゲート通過圏内です。' }
  }
  if (q.kind === 'g2')
    return {
      fx: o.r === 2 ? 'market_risk' : 'portfolio',
      note: o.r === 2 ? '市場価値リスクが付きます。成果物の整理が最優先アクションになります。' : '外部に説明できる成果物は、遷移の担保になります。',
    }
  if (q.kind === 'g3') return { fx: 'improvement', note: '改善の証跡がない場合、遷移タイプが補償寄りになります。' }
  if (q.kind === 'tree') {
    if (o.go) return { fx: '分岐継続', note: '条件を満たすため、より上位の分岐へ進みます。' }
    const e = resolveEnd(o, ctx)!
    return { fx: '→ ' + e, note: 'この回答で ' + S[e].jp + '(' + S[e].tp + ')が確定します。' }
  }
  if (q.kind === 'p5a') return { fx: TRANSJP[o.tt!], note: '遷移タイプ(隣接・上位・補償・撤退)の判定に使います。' }
  return { fx: 'memo', note: '診断メモの書き方に反映します。' }
}
