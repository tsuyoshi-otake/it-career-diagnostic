// Domain types for the IT career state-transition diagnostic.
// Mirrors the DiagnosisResult shape sketched in the design brief, expanded to
// cover the full 5-layer engine (value layer → maturity → gate → branch → transition).

export type LayerKey =
  | 'sales'
  | 'evangelism'
  | 'consulting'
  | 'architecture'
  | 'delivery'
  | 'implementation'
  | 'quality'
  | 'infrastructure'
  | 'network'
  | 'data'
  | 'operations'
  | 'governance'

export type TransitionType = 'adjacent' | 'upgrade' | 'compensate' | 'retreat'

export type MaturityLevel = 0 | 1 | 2 | 3 | 4

/** A career state (職種 or 退化状態). `deg` marks degeneration states. */
export interface CareerState {
  jp: string
  tp: string
  d: string
  /** 1 when this is a degeneration state. */
  deg?: number
  /** Escape condition (only on degeneration states). */
  esc?: string
  /** Next-action suggestions. */
  a: string[]
}

/** A weight tuple: [layer, points]. */
export type Weight = [LayerKey, number]

// ---- Layer decision tree (第4層) ----

export interface TreeOption {
  l: string
  d?: string
  /** Terminal state id. */
  end?: string
  /** Conditional terminal based on a flag set earlier in the tree. */
  endIf?: { flag: string; yes: string; no: string }
  /** Continue to another tree node. */
  go?: string
  /** Sets a boolean flag on the context. */
  flag?: string
  /** Portable skills granted by this choice. */
  skills?: string[]
}

export interface TreeNode {
  t: string
  h?: string
  opts: TreeOption[]
}

export interface LayerTree {
  start: string
  nodes: Record<string, TreeNode>
}

export interface Layer {
  name: string
  ex: string
  /** Degeneration gate state id for this layer. */
  gate: string
  /** Adjacent layer (for 隣接遷移). */
  adj: LayerKey
  /** Gate question (第3層 Q1). */
  gq: string
  /** Ordered career chain, weakest → strongest. */
  chain: string[]
  avoid: string[]
  tree: LayerTree
}

// ---- Phase 1 & 2 questions ----

export interface P1Option {
  l: string
  /** Layer weight tuples. */
  w: Weight[]
  /** Maturity bonus flag (1 = grants a small maturity bump). */
  m?: number
}

export interface P1Question {
  t: string
  h: string
  grid: number
  opts: P1Option[]
}

export interface P2Option {
  l: string
  /** Maturity signal 0–4. */
  v: number
}

export interface P2Question {
  t: string
  h: string
  opts: P2Option[]
}

// ---- Runtime question envelope ----

export type QuestionKind = 'p1' | 'p2' | 'g1' | 'g2' | 'g3' | 'tree' | 'p5a' | 'p5b'

/** A generic option as surfaced to the UI. Carries kind-specific payload fields. */
export interface RuntimeOption {
  l: string
  d?: string
  // p1
  w?: Weight[]
  m?: number
  // p2
  v?: number
  // g1
  p?: number
  // g2 / g3
  r?: number
  skill?: string
  // tree
  end?: string
  endIf?: { flag: string; yes: string; no: string }
  go?: string
  flag?: string
  skills?: string[]
  // p5a
  tt?: TransitionType
  // p5b
  u?: string
}

export interface RuntimeQuestion {
  kind: QuestionKind
  phase: 1 | 2 | 3 | 4 | 5
  idx?: number
  t: string
  h?: string
  grid?: number
  opts: RuntimeOption[]
}

// ---- Diagnostic context (accumulated answer state) ----

export interface LogEntry {
  ph: number
  q: string
  a: string
  fx: string
}

export interface DiagContext {
  p1: number
  p2: number
  g: number
  p5: number
  scores: Record<LayerKey, number>
  mPts: number[]
  mBonus: number
  layer: LayerKey | null
  apt: LayerKey | null
  gateP: number
  mkt: number
  imp: number
  treeNode: string | null
  treeDone: boolean
  terminal: string | null
  flags: Record<string, number>
  skills: string[]
  failT: string | null
  env: TransitionType | null
  use: string | null
  log: LogEntry[]
  p2Labels: string[]
  lastW?: Weight[] | null
}

/** Final computed diagnosis. */
export interface DiagnosisResult {
  ctx: DiagContext
  lv: MaturityLevel
  sorted: LayerKey[]
  sec: LayerKey | null
  terminal: string
  orig: string
  demoted: boolean
  confirmed: boolean
  near: boolean
  degId: string
  chain: string[]
  ti: number
  type: TransitionType
  target: string
  adjLayer: LayerKey | null
}
