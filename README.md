# IT職種適性診断 (IT Career Aptitude Diagnostic)

A single-page, fully client-side career diagnostic for IT professionals. Instead of
guessing a job title, it judges **state transitions**: which value layer your work sits
in, whether it's execution / judgement / ownership, and where your experience can
transition to next.

Built with **React + TypeScript + Vite**. The diagnosis runs entirely in the browser —
no answers are ever sent anywhere.

## The diagnostic model

The engine runs five layers (`src/engine/`):

1. **価値レイヤー判定** — score which of 12 value layers your work lives in
   (顧客獲得 / 技術普及 / 課題定義 / 構造設計 / 推進責任 / 実装責任 / 品質責任 /
   基盤責任 / 通信責任 / データ責任 / 運用改善 / 専門統制).
2. **責任成熟度判定** — L0 (受動実行) → L4 (責任所有).
3. **退化リスクゲート** — forced gates that override the score. Fail one and you're
   assigned a degeneration state (e.g. `sql_execution_clerk`, `powerpoint_consultant`)
   regardless of the title you claim.
4. **職種固有分岐** — a per-layer decision tree resolving the concrete career state.
5. **遷移判定** — the recommended transition type (隣接 / 上位 / 補償 / 撤退) and target.

The result reports the primary state (snake_case id + Japanese name), maturity meter,
degeneration risk with escape conditions, a transition map, a per-answer reasoning log,
next actions, projects to avoid, portable skills, and a copyable Markdown memo.

## Project layout

```
src/
  engine/          Framework-agnostic diagnostic engine (pure functions + typed data)
    types.ts       Domain types (LayerKey, CareerState, DiagnosisResult, …)
    data.ts        All static tables: STATES, LAYERS, P1/P2 questions, skills
    diagnose.ts    The 5-layer engine (questionAt, applyAnswer, buildResult, …)
  ui/              Presentation view-models (map engine state → styled view objects)
    quizView.ts    Flowchart band + question panel view-model
    resultView.ts  Result screen view-model
    hints.ts       Live per-option hint text
  screens/         React components
    Landing.tsx
    Quiz.tsx        Camera-following flowchart + docked question panel
    Result.tsx
  App.tsx          View routing + answer history state
```

The engine is deliberately decoupled from React: `src/engine/` has no UI dependencies,
so the diagnostic logic can be reused or tested independently of the components.

## Development

```bash
npm install
npm run dev        # start the dev server
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck  # type-check only
```

## Tweaks

Two toggles on the landing screen mirror the original design's options:

- **風刺表現** — show the satirical degeneration-state nicknames vs. a neutral label.
- **LIVEヒント** — show the live "how this affects the diagnosis" hint under each option.

## Design source

This app was implemented from a Claude Design handoff bundle. The original HTML/CSS/JS
prototype and the design conversation are preserved under [`project/`](./project/) and
[`chats/`](./chats/) for reference.
