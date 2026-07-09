// Static diagnostic data — transcribed verbatim from the Claude Design source.
// All Japanese copy, weights, trees and thresholds are preserved exactly.

import type {
  CareerState,
  Layer,
  LayerKey,
  P1Question,
  P2Question,
  TransitionType,
} from './types'

export const LVJP = ['受動実行', '自走実行', '設計・分析', '改善・標準化', '責任所有']

export const SKILLJP: Record<string, string> = {
  customer_issue_definition: '顧客課題定義',
  contract_risk_handling: '契約リスク設計',
  solution_composition: '解決策の組成',
  live_demo_building: 'デモ実装',
  adoption_support: '導入支援',
  community_feedback_loop: '現場フィードバック接続',
  exception_mapping: '例外・制約の構造化',
  decision_facilitation: '意思決定接続',
  constraint_explanation: '制約説明',
  implementation_review: '実装レビュー',
  nonfunctional_design: '非機能設計',
  risk_forecasting: 'リスク先回り',
  decision_support: '意思決定支援',
  business_ownership: '事業接続',
  spec_intent_reading: '仕様意図の読解',
  test_ownership: 'テスト所有',
  ai_output_verification: 'AI出力検証',
  design_partitioning: '設計・分割判断',
  viewpoint_design: 'テスト観点設計',
  test_automation: 'テスト自動化',
  quality_gate_design: '品質ゲート設計',
  os_middleware_analysis: 'OS/ミドル障害解析',
  iac_reproducibility: 'IaC再現構築',
  reliability_design: '監視・復旧設計',
  route_explanation: '経路説明',
  packet_tracing: 'パケット追跡',
  boundary_design: '境界・分離設計',
  query_optimization: '実行計画・性能改善',
  transaction_design: 'ロック・トランザクション設計',
  availability_design: 'バックアップ・可用性設計',
  root_cause_analysis: '原因分析',
  recurrence_prevention: '再発防止設計',
  feedback_to_dev: '開発への改善接続',
  risk_quantification: 'リスク定量化',
  control_design: '統制設計',
  improvement_legacy: '標準化・定着',
  explainable_portfolio: '外部説明可能な成果物',
}

export const STATES: Record<string, CareerState> = {
  people_matching_sales: { jp: '人月仲介係', tp: '退化状態', deg: 1, d: '要員表と案件表の突き合わせが中心。顧客の課題には触れていない。', esc: '顧客課題と契約リスクを自分の言葉で説明できる', a: ['直近3案件の顧客課題を業務の言葉で書き直す', '単価以外の交渉論点(範囲・体制・リスク)を提案書に入れる', '失注理由を顧客課題ベースで分析し直す'] },
  ses_sales: { jp: 'SES営業', tp: '案件接続型', d: '体制・要員面の課題を説明し、案件に接続できる。', a: ['顧客の業務課題をヒアリングして提案書の冒頭に書く', '一次の課題整理を技術者に頼らず自分でやってみる', '契約範囲とリスクの条項を自分で説明できるようにする'] },
  account_sales: { jp: 'アカウント営業', tp: '顧客深耕型', d: '顧客の課題を深く掘り、関係を築ける。', a: ['技術選定の初期仮説まで自分で組み立てる', 'プリセールス同行で解決策の組み立て方を言語化する', '提案の勝敗要因を技術観点で振り返る'] },
  presales: { jp: 'プリセールス', tp: '課題解決型', d: '業務課題と技術課題を提案に変換できる。', a: ['提案から契約範囲・責任分界まで踏み込む', 'デモ・PoCの設計を自分で主導する', '失注案件の技術的敗因を資産化する'] },
  solution_sales: { jp: 'ソリューション営業', tp: '契約責任型', d: '契約範囲・責任・リスクまで握れる。', a: ['提案パターンを標準化して展開する', '後進に課題定義の型を移植する', 'デリバリー側(推進責任)への隣接遷移も選択肢に入れる'] },
  buzzword_evangelist: { jp: 'バズワード係', tp: '退化状態', deg: 1, d: '流行語と製品紹介を語るだけ。自分では動かしていない。', esc: '動くデモと導入支援の実績を持つ', a: ['紹介した技術を1つ選び、動くデモを自作する', 'ハンズオン資料を作って社内で実施する', '導入プロジェクトに1件伴走する'] },
  technical_marketer: { jp: '技術広報', tp: '発信整理型', d: '技術価値を記事・資料に整理して伝えられる。', a: ['題材を自分で動かして検証してから書く', 'デモアプリを1つ公開する', '読者の導入障壁をFAQとして体系化する'] },
  demo_engineer: { jp: 'デモエンジニア', tp: '価値実証型', d: '動くデモで技術価値を実証できる。', a: ['デモ止まりの案件を1つ導入支援まで伴走する', '導入時のつまずきを記録して改善提案に変える', '顧客の本番制約(認証・NW・運用)まで踏み込む'] },
  technology_evangelist: { jp: 'テクノロジーエバンジェリスト', tp: '普及推進型', d: 'デモと導入支援で技術の普及を進められる。', a: ['現場の声を製品・SDK・ドキュメント改善に戻す経路を作る', 'コミュニティの反応を定量化する', '開発チームとの改善サイクルを定例化する'] },
  developer_advocate: { jp: 'Developer Advocate', tp: 'コミュニティ接続型', d: '市場の反応を製品に戻し、開発者体験を改善できる。', a: ['DX改善の成果を指標(導入数・離脱点)で示す', 'SDK・ドキュメントの改善をリードする', '製品ロードマップへの提言を定例化する'] },
  powerpoint_consultant: { jp: '資料作成係', tp: '退化状態', deg: 1, d: '資料の完成がゴールになっている。意思決定に接続していない。', esc: '意思決定と業務変革に接続する', a: ['資料の結論を「決めてもらう論点」形式に書き換える', '意思決定会議に同席し、決定事項を追う役を取る', '施策の実行フェーズに1件入り込む'] },
  junior_consultant: { jp: 'ジュニアコンサル', tp: '調査整理型', d: '調査・比較・整理で議論の土台を作れる。', a: ['業務の例外パターンと制約条件を棚卸しする', 'ヒアリングで「現場が困る理由」を構造化する', '調査結果に自分の仮説と論点を必ず付ける'] },
  business_analyst: { jp: '業務アナリスト', tp: '業務整理型', d: '業務の例外と制約を構造化できる。', a: ['提言を意思決定の場に持ち込み、決定まで見届ける', '施策にKPIと実行責任者を必ず付ける', '決定後の実行フェーズに伴走する'] },
  it_consultant: { jp: 'ITコンサルタント', tp: '課題定義型', d: '論点を設定し、意思決定と実行に接続できる。', a: ['変革の実行責任(PM/PMO)側へ上位遷移する', '論点設定の型を標準化して展開する', 'AIに寄る調査業務を自動化し、判断業務に時間を移す'] },
  diagram_only_architect: { jp: '図解係', tp: '退化状態', deg: 1, d: 'きれいな構成図を描くが、実装・運用・非機能の制約を説明できない。', esc: '実装・運用・非機能の制約を説明できる', a: ['直近の構成図に非機能(性能・可用性・コスト)の根拠を書き足す', '実装チームのコードレビューに月2回参加する', '障害対応の切り分けに1件入り、運用制約を学ぶ'] },
  solution_architect: { jp: 'ソリューションアーキテクト', tp: '構想設計型', d: '要件を構成に落とし、制約を説明できる。', a: ['設計した構成の実装レビューまで踏み込む', '機能追加時の影響範囲を説明できる構造にする', 'ADR(設計判断記録)を残す習慣を作る'] },
  technical_architect: { jp: 'テクニカルアーキテクト', tp: '実装構造型', d: '実装構造・依存関係までレビューできる。', a: ['非機能要件(SLO・監視・復旧)を設計に含める', '運用チームと障害シナリオを机上演習する', 'テスト戦略まで設計範囲に入れる'] },
  architect_lead: { jp: 'アーキテクトリード', tp: '構造責任型', d: '非機能と運用まで含む構造の責任を持てる。', a: ['複数チーム横断の技術判断を標準化する', '技術負債の返済計画を事業判断に接続する', '後進の設計レビュー体制を作る'] },
  excel_pmo: { jp: '進捗表更新係', tp: '退化状態', deg: 1, d: '進捗表と議事録の更新が仕事になっている。判断に関与していない。', esc: 'リスク・依存関係・意思決定支援へ進む', a: ['進捗表に「判断が必要な事項」列を足し、会議で自分が説明する', '依存関係とクリティカルパスを可視化する', 'リスク一覧に対応オーナーと期限を付けて追う'] },
  progress_manager: { jp: '進行管理', tp: '進行管理型', d: '計画と進捗を自走で管理できる。', a: ['リスクの先行指標を設計して早期検知する', '依存関係の調整を自分から仕掛ける', '課題ごとに意思決定の期限を逆算して設定する'] },
  project_manager: { jp: 'プロジェクトマネージャー', tp: '推進責任型', d: 'リスクを先回りし、意思決定を支援できる。', a: ['スコープ・優先順位の判断を自分の提案から通す', '契約・収支の観点を計画に組み込む', 'ステークホルダーの利害調整を主導する'] },
  delivery_manager: { jp: 'デリバリーマネージャー', tp: '事業接続型', d: '事業価値と契約まで含めて推進を握れる。', a: ['複数プロジェクトのポートフォリオ判断に関与する', 'デリバリー標準を組織に定着させる', '事業側(PdM・事業責任者)への遷移も視野に入れる'] },
  copy_paste_coder: { jp: '指示実装係', tp: '退化状態', deg: 1, d: '指示どおりの実装とAI出力の貼り付けが中心。検証を持っていない。', esc: 'テスト・レビュー・設計理解を持つ', a: ['自分のPRに必ずテストを付ける', 'AI生成コードの誤りを1件見つけて記録する', '実装前に仕様の意図を1つ質問する習慣を作る'] },
  coder: { jp: 'コーダー', tp: '実装担当', d: '仕様を理解して自走で実装できる。', a: ['テストとレビューを自分の責任範囲に含める', '変更の影響範囲を説明してからマージする', 'リファクタリングを提案ベースで実施する'] },
  web_engineer: { jp: 'Webエンジニア', tp: '実装所有型', d: 'テスト・レビューまで含めて実装を所有できる。', a: ['AI実装の検証(テスト・境界条件)を型にする', 'AIに書かせる範囲と自分で書く範囲の基準を作る', 'レビュー観点をチームに共有する'] },
  agentic_coder: { jp: 'Agentic Coder', tp: 'AI実装制御型', d: 'AI実装を検証・制御して、変更を安全に入れられる。', a: ['設計・分割の判断まで踏み込む', 'モジュール境界とテスト戦略を自分で決める', '技術選定の意思決定に参加する'] },
  tech_lead: { jp: 'テックリード', tp: '実装責任者', d: '設計・分割・実装の判断に責任を持てる。', a: ['チームの実装標準とレビュー体制を設計する', '構造設計(アーキテクト)への隣接遷移を検討する', '技術判断の記録(ADR)を組織に残す'] },
  manual_only_tester: { jp: '手順実行係', tp: '退化状態', deg: 1, d: '手順書の実行だけ。観点も自動化も持っていない。', esc: 'テスト観点と自動化に進む', a: ['手順書に「観点」列を足して理由を書く', '探索的テストで手順外のバグを1件見つける', '繰り返しテストを1つ自動化してみる'] },
  tester: { jp: 'テスター', tp: '検証担当', d: '目的を理解してテストを実行できる。', a: ['テスト観点表を自分で設計する', 'バグの傾向分析から重点観点を提案する', '境界値・異常系の設計を型にする'] },
  test_designer: { jp: 'テスト設計者', tp: '観点設計型', d: 'リスクからテスト観点を設計できる。', a: ['回帰テストの自動化に着手する', 'CIにテストを組み込む', '自動化の費用対効果を説明できるようにする'] },
  automation_engineer: { jp: 'テスト自動化エンジニア', tp: '自動化型', d: 'テストを自動化し、継続的に回せる。', a: ['リリース判定基準(品質ゲート)を設計する', '品質メトリクスをダッシュボード化する', 'AI生成コード向けの検証戦略を作る'] },
  qa_engineer: { jp: 'QAエンジニア / SET', tp: '品質設計型', d: '品質ゲートとテスト戦略を設計できる。AI時代に価値が上がる状態。', a: ['開発プロセス全体の品質設計に関与する', '品質基準を組織標準に落とす', 'SREや開発への隣接遷移も視野に入れる'] },
  manual_infra_builder: { jp: '手作業構築係', tp: '退化状態', deg: 1, d: '手順書どおりの手作業構築。再現性がなく、AIとIaCに代替される。', esc: 'IaC・監視・復旧設計に進む', a: ['構築手順を1つIaC(Terraform等)に置き換える', '検証環境をコード化して再現可能にする', '構築ミスの再発防止を仕組みで残す'] },
  server_reboot_operator: { jp: '再起動係', tp: '退化状態', deg: 1, d: '再起動と定例手順作業が中心。原因分析に踏み込んでいない。', esc: 'ログ・性能・パッチ影響を分析する', a: ['再起動で直った障害のログを1件深掘りする', '性能グラフの定点観測と閾値を設計する', 'パッチ適用の影響範囲を事前分析する'] },
  infra_engineer: { jp: 'インフラエンジニア', tp: '基盤構築型', d: '基盤を自走で構築できる。', a: ['構築をIaCで再現可能にする', 'OS・ミドルの障害解析力を事例で残す', '監視項目を自分で設計する'] },
  server_engineer: { jp: 'サーバーエンジニア', tp: 'サーバー責任型', d: 'OS・ミドルの障害解析ができる。', a: ['解析事例を横展開できる形で標準化する', 'IaC化とクラウド構築に領域を広げる', '可用性設計(冗長・復旧)まで踏み込む'] },
  cloud_engineer: { jp: 'クラウドエンジニア', tp: 'クラウド構築型', d: 'IaCで再現可能にクラウドを構築できる。', a: ['SLO・監視・アラート設計を自分で持つ', '障害復旧(DR)手順を設計し演習する', 'コスト設計(FinOps)の観点を加える'] },
  platform_sre: { jp: 'プラットフォームエンジニア / SRE', tp: '信頼性設計型', d: '監視・復旧・信頼性を設計できる。', a: ['SLOを事業指標と接続する', '開発チーム向けセルフサービス基盤を設計する', '信頼性への投資判断を経営に説明する'] },
  firewall_ticket_operator: { jp: 'FW反映係', tp: '退化状態', deg: 1, d: 'FW申請の反映作業だけ。なぜ許可するのかを判断していない。', esc: '通信経路と境界設計を説明する', a: ['申請1件の通信をend-to-endの経路図にしてみる', '許可の業務理由を確認する習慣を作る', '不要ルールの棚卸しを提案する'] },
  network_operator: { jp: 'ネットワーク運用', tp: '監視運用型', d: 'NW監視と一次対応ができる。', a: ['主要システムの通信経路を自分で図解する', '障害時にパケットキャプチャで切り分ける経験を積む', '経路・DNS・証明書の典型障害パターンを整理する'] },
  network_engineer: { jp: 'ネットワークエンジニア', tp: '構築設定型', d: '経路を理解し、構築・設定ができる。', a: ['障害時のパケット・経路追跡を事例化する', 'クラウドNW(VPC・専用線)に領域を広げる', 'セグメンテーション設計を小さく適用してみる'] },
  cloud_network_engineer: { jp: 'クラウドネットワークエンジニア', tp: 'クラウド接続型', d: 'クラウドとオンプレの接続を設計できる。', a: ['ゼロトラスト・境界設計に踏み込む', 'アプリ単位のアクセス制御を設計する', '横展開防止(マイクロセグメンテーション)を提案する'] },
  network_architect: { jp: 'ネットワークアーキテクト', tp: '境界設計型', d: '境界と分離を設計し、「必要なものだけ到達させる」を統制できる。', a: ['ゼロトラスト移行のロードマップを描く', 'セキュリティ統制(専門統制)への隣接遷移も視野に', 'NW設計標準を組織に定着させる'] },
  sql_execution_clerk: { jp: 'SQL実行係', tp: '退化状態', deg: 1, d: '依頼されたSQLを実行して結果を返すだけ。AIに最初に代替される。', esc: '実行計画・ロック・設計に進む', a: ['依頼SQLを1本、実行計画付きで改善してみる', '遅いクエリのワースト5を可視化する', 'インデックス設計を1テーブルで実践する'] },
  sql_engineer: { jp: 'SQLエンジニア', tp: 'SQL作成型', d: 'SQLを書いてデータを取り出せる。', a: ['実行計画(EXPLAIN)を業務クエリで読む練習をする', 'インデックスの効き方を検証して記録する', '遅いSQLの改善を1件事例化する'] },
  database_engineer: { jp: 'DBエンジニア', tp: '性能改善型', d: '実行計画を読み、性能を改善できる。', a: ['過去の遅いSQLを実行計画付きで改善事例化する', 'ロック待ちとトランザクション分離の説明資料を作る', 'バックアップ・リストアの検証ログを成果物として残す'] },
  dba: { jp: 'DBA', tp: '運用管理型', d: 'ロック・トランザクションを説明し、DBを運用管理できる。', a: ['バックアップ・移行・可用性の設計に踏み込む', '移行リハーサルの手順と検証を設計する', '監査・アクセス統制の要件を整理する'] },
  data_architect: { jp: 'データアーキテクト', tp: 'データ責任型', d: '整合性・可用性・移行リスクの責任を持てる。AIがSQLを書くほど価値が上がる。', a: ['データ基盤・分析基盤へ領域を広げる', 'データガバナンス(品質・系譜)を設計する', '組織のデータ設計標準を作る'] },
  ticket_router: { jp: '転送係', tp: '退化状態', deg: 1, d: '問い合わせの起票と転送だけ。原因にも再発防止にも触れていない。', esc: '原因分析・再発防止・統制改善に進む', a: ['転送前に一次切り分け(ログ確認)を1手挟む', '問い合わせトップ5の根本原因を調べる', 'FAQ・自動化で問い合わせ自体を減らす提案をする'] },
  operator: { jp: '運用オペレーター', tp: '運用実行型', d: '手順に沿って運用・一次対応ができる。', a: ['障害の原因分析(ログ・メトリクス)に踏み込む', '対応記録を分析できる形式で残す', '切り分けフローを自分で改善する'] },
  operations_engineer: { jp: '運用改善エンジニア', tp: '運用改善型', d: '障害原因を分析し、改善できる。', a: ['再発防止を設計し、実施まで追う', '手作業運用を自動化する', 'ポストモーテム文化を定着させる'] },
  internal_it: { jp: '情シス / 社内IT', tp: '統制改善型', d: '社内ITの統制と改善を回せる。', a: ['開発・基盤チームへの改善フィードバック経路を作る', 'SaaS・ID統制を設計する', '業務部門の課題定義(課題定義レイヤー)に踏み込む'] },
  sre: { jp: 'SRE', tp: '信頼性責任型', d: '再発防止を設計し、開発・基盤に改善を戻せる。', a: ['SLO・エラーバジェットを運用に組み込む', '信頼性改善を開発ロードマップに接続する', 'キャパシティ・コスト設計まで踏み込む'] },
  checklist_auditor: { jp: 'チェックリスト消化係', tp: '退化状態', deg: 1, d: '既定のチェックリストを消化するだけ。リスクの軽重を判断していない。', esc: 'リスクの定量評価と例外判断を持つ', a: ['チェック項目に「守らないと何が起きるか」を書き足す', '指摘のリスク影響度を金額・確率で見積もる', '例外申請の判断基準を言語化する'] },
  security_operator: { jp: 'セキュリティ運用', tp: '検知運用型', d: 'アラート対応・検知運用ができる。', a: ['検知ルールの誤検知率を改善する', 'インシデント対応の初動を設計する', '脅威シナリオから対策の優先度を付ける'] },
  security_engineer: { jp: 'セキュリティエンジニア', tp: '対策実装型', d: 'リスクを評価し、対策を設計・実装できる。', a: ['組織の基準・例外判断の設計に踏み込む', 'セキュア設計レビューを開発プロセスに組み込む', 'FinOps・MLOpsなど隣接統制領域に広げる'] },
  governance_lead: { jp: 'ガバナンスリード', tp: '統制設計型', d: '基準・例外判断・組織統制を設計できる。', a: ['リスク受容の意思決定プロセスを経営と設計する', '統制の自動化(Policy as Code)を進める', '監査対応を仕組み化して工数を下げる'] },
}

export const LAYERS: Record<LayerKey, Layer> = {
  sales: { name: '顧客獲得', ex: 'SES営業・プリセールス', gate: 'people_matching_sales', adj: 'consulting',
    gq: '直近の提案のうち、「要員スキルシートの貼り合わせ」でほぼ完成した割合は?',
    chain: ['ses_sales', 'account_sales', 'presales', 'solution_sales'],
    avoid: ['要員表と案件表の突き合わせだけの営業', '単価交渉しか裁量のない商流の深い案件', '顧客に直接会えない仲介ポジション'],
    tree: { start: 'n1', nodes: {
      n1: { t: '顧客の課題を、業務の言葉で定義できますか?', h: '「Java要員が足りない」ではなく「締め処理が月末に破綻する」のように。', opts: [
        { l: '要員と案件のマッチングが中心', d: '課題までは扱わない', end: 'people_matching_sales' },
        { l: '体制・要員面の課題なら説明できる', end: 'ses_sales' },
        { l: '業務課題を自分の言葉で定義できる', go: 'n2', skills: ['customer_issue_definition'] }] },
      n2: { t: '提案範囲・契約・リスクまで自分で握れますか?', opts: [
        { l: '契約まわりは会社・上司に任せる', go: 'n3' },
        { l: '範囲・責任・リスクを握って交渉できる', go: 'n3', flag: 'contract', skills: ['contract_risk_handling'] }] },
      n3: { t: '技術や解決策を、自分で組み立てられますか?', opts: [
        { l: '解決策は技術者に任せる', end: 'account_sales' },
        { l: '解決策の骨子まで自分で組める', endIf: { flag: 'contract', yes: 'solution_sales', no: 'presales' }, skills: ['solution_composition'] }] },
    } } },
  evangelism: { name: '技術普及', ex: 'エバンジェリスト・DevRel', gate: 'buzzword_evangelist', adj: 'implementation',
    gq: '直近の登壇・記事のうち、自分で動かしていない技術を紹介した割合は?',
    chain: ['technical_marketer', 'demo_engineer', 'technology_evangelist', 'developer_advocate'],
    avoid: ['自分で触らない製品の紹介登壇だけの仕事', 'KPIがPV・登壇数だけの発信業務', '導入現場に関われない広報専任'],
    tree: { start: 'n1', nodes: {
      n1: { t: '紹介している技術で、動くデモを自分で作れますか?', opts: [
        { l: '作れない。流行語・製品紹介が中心', end: 'buzzword_evangelist' },
        { l: '作れないが、記事・資料の整理は得意', end: 'technical_marketer' },
        { l: '作れる', go: 'n2', skills: ['live_demo_building'] }] },
      n2: { t: '顧客・社内への「導入支援」までできますか?', opts: [
        { l: 'デモ・登壇まで', end: 'demo_engineer' },
        { l: '導入の伴走までやる', go: 'n3', skills: ['adoption_support'] }] },
      n3: { t: '市場・現場の反応を、製品側に戻せていますか?', opts: [
        { l: '戻す経路がない・やっていない', end: 'technology_evangelist' },
        { l: 'SDK・docs・ロードマップに反映させている', end: 'developer_advocate', skills: ['community_feedback_loop'] }] },
    } } },
  consulting: { name: '課題定義', ex: 'コンサル・IT企画', gate: 'powerpoint_consultant', adj: 'delivery',
    gq: '直近1か月の稼働のうち、資料作成(体裁調整含む)の割合は?',
    chain: ['junior_consultant', 'business_analyst', 'it_consultant'],
    avoid: ['資料の体裁修正が主業務の案件', '議事録・調査だけで論点に触れない案件', '提言が意思決定者に届かない多層下請け'],
    tree: { start: 'n1', nodes: {
      n1: { t: 'あなたにとって資料は、何のためのものですか?', opts: [
        { l: '資料の完成がゴール', d: 'きれいに作ることが仕事になっている', end: 'powerpoint_consultant' },
        { l: '意思決定を動かすための道具', go: 'n2' }] },
      n2: { t: '業務の「例外」と「制約」を整理できますか?', h: '正常系の業務フローではなく、現場が困る例外処理と制約条件。', opts: [
        { l: '典型パターンの整理まで', end: 'junior_consultant' },
        { l: '例外・制約・現場の抵抗まで棚卸しできる', go: 'n3', skills: ['exception_mapping'] }] },
      n3: { t: 'あなたの提言は、意思決定に接続していますか?', opts: [
        { l: '提言して終わることが多い', end: 'business_analyst' },
        { l: '決定の場に同席し、実行まで追っている', end: 'it_consultant', skills: ['decision_facilitation'] }] },
    } } },
  architecture: { name: '構造設計', ex: 'アーキテクト・上流SE', gate: 'diagram_only_architect', adj: 'implementation',
    gq: '直近の成果物のうち、実装・レビューに繋がらなかった構成図の割合は?',
    chain: ['solution_architect', 'technical_architect', 'architect_lead'],
    avoid: ['構成図の納品で終わる設計案件', '実装チームと会話できない上流専任', '非機能要件に関与できないポンチ絵案件'],
    tree: { start: 'n1', nodes: {
      n1: { t: '構成図の「制約」を説明できますか?', h: 'なぜこの形なのか。性能・コスト・変更容易性・運用のトレードオフ。', opts: [
        { l: '構成図を描くこと自体が中心', end: 'diagram_only_architect' },
        { l: '制約とトレードオフを説明できる', go: 'n2', skills: ['constraint_explanation'] }] },
      n2: { t: '実装(コード)のレビューまでしますか?', opts: [
        { l: '実装は開発チームに任せる', end: 'solution_architect' },
        { l: '実装構造・依存関係までレビューする', go: 'n3', skills: ['implementation_review'] }] },
      n3: { t: '非機能と運用(監視・復旧)まで設計しますか?', opts: [
        { l: '非機能・運用は別チームの担当', end: 'technical_architect' },
        { l: 'SLO・監視・復旧まで設計に含める', end: 'architect_lead', skills: ['nonfunctional_design'] }] },
    } } },
  delivery: { name: '推進責任', ex: 'PM・PMO', gate: 'excel_pmo', adj: 'consulting',
    gq: '直近1か月の稼働のうち、進捗表・議事録の更新作業の割合は?',
    chain: ['progress_manager', 'project_manager', 'delivery_manager'],
    avoid: ['進捗表更新と会議設定だけのPMO', '判断権限がなく報告だけのPM補佐', 'リスクに触れられない事務局ポジション'],
    tree: { start: 'n1', nodes: {
      n1: { t: '進捗表は、あなたにとって何ですか?', opts: [
        { l: '更新して報告するもの', end: 'excel_pmo' },
        { l: '判断を引き出すための材料', go: 'n2' }] },
      n2: { t: 'リスクと依存関係を、先回りして潰せていますか?', opts: [
        { l: '問題が起きてから対応することが多い', end: 'progress_manager' },
        { l: '先行指標で検知し、先に手を打つ', go: 'n3', skills: ['risk_forecasting'] }] },
      n3: { t: 'スコープ・優先順位の判断に、どこまで関与しますか?', opts: [
        { l: '判断材料を揃えて意思決定を支援する', end: 'project_manager', skills: ['decision_support'] },
        { l: '事業価値・契約まで含めて自分が握る', end: 'delivery_manager', skills: ['business_ownership'] }] },
    } } },
  implementation: { name: '実装責任', ex: 'コーダー・Tech Lead', gate: 'copy_paste_coder', adj: 'architecture',
    gq: '直近の実装のうち、指示・既存コード・AI出力をほぼそのまま流用した割合は?',
    chain: ['coder', 'web_engineer', 'agentic_coder', 'tech_lead'],
    avoid: ['仕様書どおり書くだけの実装案件', 'テスト・レビューに関与できない体制', 'コピペ改修の量産保守'],
    tree: { start: 'n1', nodes: {
      n1: { t: '実装の起点は、どちらに近いですか?', opts: [
        { l: '指示どおり書く / AI出力をほぼそのまま使う', end: 'copy_paste_coder' },
        { l: '仕様の意図を確認し、自分の設計で書く', go: 'n2', skills: ['spec_intent_reading'] }] },
      n2: { t: 'テストとレビューまで、自分の責任範囲ですか?', opts: [
        { l: '書いたら終わり。テストは別担当', end: 'coder' },
        { l: 'テスト・レビューまで所有している', go: 'n3', skills: ['test_ownership'] }] },
      n3: { t: 'AIが書いたコードを、検証・制御できますか?', opts: [
        { l: 'AI出力はほぼ信じる / AIは使わない', end: 'web_engineer' },
        { l: '境界条件・誤りを検証し、直させられる', go: 'n4', skills: ['ai_output_verification'] }] },
      n4: { t: '設計・分割の判断まで、自分でしますか?', opts: [
        { l: '設計は他の人が決める', end: 'agentic_coder' },
        { l: 'モジュール分割・技術選定まで判断する', end: 'tech_lead', skills: ['design_partitioning'] }] },
    } } },
  quality: { name: '品質責任', ex: 'テスター・QA・SET', gate: 'manual_only_tester', adj: 'implementation',
    gq: '直近のテスト作業のうち、手順書どおりの実行だけの割合は?',
    chain: ['tester', 'test_designer', 'automation_engineer', 'qa_engineer'],
    avoid: ['手順書実行だけのテスト案件', '観点設計に関われない大部屋テスト', '自動化が禁止されている現場'],
    tree: { start: 'n1', nodes: {
      n1: { t: 'テストの起点は、どちらですか?', opts: [
        { l: '渡された手順書の実行', end: 'manual_only_tester' },
        { l: 'リスクから観点を考える', go: 'n2' }] },
      n2: { t: 'テスト観点を、自分で設計できますか?', opts: [
        { l: '与えられた観点で実行する', end: 'tester' },
        { l: '仕様・リスクから観点表を設計できる', go: 'n3', skills: ['viewpoint_design'] }] },
      n3: { t: 'テストを自動化できますか?', opts: [
        { l: '手動テストが中心', end: 'test_designer' },
        { l: '自動化してCIで回せる', go: 'n4', skills: ['test_automation'] }] },
      n4: { t: 'リリース可否の「品質ゲート」を設計できますか?', h: 'AIがコードを量産するほど、ここの価値が上がります。', opts: [
        { l: 'テストの実装・実行まで', end: 'automation_engineer' },
        { l: '基準・メトリクス・ゲートまで設計する', end: 'qa_engineer', skills: ['quality_gate_design'] }] },
    } } },
  infrastructure: { name: '基盤責任', ex: 'インフラ・クラウド・SRE', gate: 'manual_infra_builder', adj: 'operations',
    gq: '直近の基盤作業のうち、手順書どおりの手作業の割合は?',
    chain: ['infra_engineer', 'server_engineer', 'cloud_engineer', 'platform_sre'],
    avoid: ['手順書どおりの構築作業だけの案件', '設計に触れない運用保守', '再起動・定例作業が主業務の現場'],
    tree: { start: 'n1', nodes: {
      n1: { t: '普段の基盤作業の中心は?', opts: [
        { l: '手順書どおりの手作業構築', end: 'manual_infra_builder' },
        { l: '再起動・定例作業・パッチ適用', end: 'server_reboot_operator' },
        { l: 'スクリプト・IaCも使って構築する', go: 'n2' }] },
      n2: { t: 'OS・ミドルウェアの障害解析はできますか?', opts: [
        { l: 'ログから原因を特定できる', go: 'n3', flag: 'server', skills: ['os_middleware_analysis'] },
        { l: '解析は他チーム・ベンダーに任せる', go: 'n3' }] },
      n3: { t: '環境をIaCで再現可能に構築できますか?', opts: [
        { l: '毎回手で調整する部分が多い', endIf: { flag: 'server', yes: 'server_engineer', no: 'infra_engineer' } },
        { l: 'コードから同じ環境を再現できる', go: 'n4', skills: ['iac_reproducibility'] }] },
      n4: { t: '監視と復旧まで設計していますか?', opts: [
        { l: '監視は既存設定のまま', end: 'cloud_engineer' },
        { l: 'SLO・アラート・復旧手順まで設計する', end: 'platform_sre', skills: ['reliability_design'] }] },
    } } },
  network: { name: '通信責任', ex: 'ネットワーク', gate: 'firewall_ticket_operator', adj: 'governance',
    gq: '直近のNW作業のうち、FW申請・設定反映チケットの割合は?',
    chain: ['network_operator', 'network_engineer', 'cloud_network_engineer', 'network_architect'],
    avoid: ['FW申請反映だけの運用', '経路設計に関与できない監視専任', '機器リプレースの作業要員'],
    tree: { start: 'n1', nodes: {
      n1: { t: '普段のNW作業の中心は?', opts: [
        { l: 'FW申請・設定変更チケットの反映', end: 'firewall_ticket_operator' },
        { l: '監視と一次対応', go: 'n2' },
        { l: '設計・構築・障害解析', go: 'n2' }] },
      n2: { t: '主要システムの通信を、端から端まで説明できますか?', h: 'DNS・LB・FW・ルーティングを通しで。', opts: [
        { l: '構成図がないと説明できない', end: 'network_operator' },
        { l: '経路を通しで説明できる', go: 'n3', skills: ['route_explanation'] }] },
      n3: { t: '障害時、パケットと経路を自分で追えますか?', opts: [
        { l: '切り分けは他チームに渡す', end: 'network_engineer' },
        { l: 'キャプチャ・経路情報で特定できる', go: 'n4', skills: ['packet_tracing'] }] },
      n4: { t: '「境界」と「分離」を設計できますか?', h: 'ゼロトラスト、セグメンテーション、横展開防止。', opts: [
        { l: 'クラウド接続の構築まで', end: 'cloud_network_engineer' },
        { l: '到達性の統制・分離設計まで担う', end: 'network_architect', skills: ['boundary_design'] }] },
    } } },
  data: { name: 'データ責任', ex: 'DB・DBA・データ基盤', gate: 'sql_execution_clerk', adj: 'infrastructure',
    gq: '直近1か月のDB作業のうち、依頼されたSQLをそのまま実行しただけの割合は?',
    chain: ['sql_engineer', 'database_engineer', 'dba', 'data_architect'],
    avoid: ['依頼SQLを流すだけの案件', 'DB設計に関与できない保守案件', '性能問題の原因分析を任されない運用案件'],
    tree: { start: 'n1', nodes: {
      n1: { t: '普段のDB作業の中心は?', opts: [
        { l: '依頼されたSQLの実行と結果返却', end: 'sql_execution_clerk' },
        { l: '自分でSQLを書いて抽出・加工する', go: 'n2' }] },
      n2: { t: '実行計画(EXPLAIN)を読めますか?', opts: [
        { l: '読めない・読んだことがない', end: 'sql_engineer' },
        { l: '読めて、遅い原因を特定できる', go: 'n3', skills: ['query_optimization'] }] },
      n3: { t: 'ロックとトランザクション分離を説明できますか?', opts: [
        { l: '説明は難しい', end: 'database_engineer' },
        { l: 'ロック待ち・分離レベルを説明できる', go: 'n4', skills: ['transaction_design'] }] },
      n4: { t: 'バックアップ・移行・可用性を設計できますか?', h: 'AIがSQLを書くほど、ここの価値が上がります。', opts: [
        { l: '運用・管理までが範囲', end: 'dba' },
        { l: '整合性・可用性・移行リスクの設計責任を持てる', end: 'data_architect', skills: ['availability_design'] }] },
    } } },
  operations: { name: '運用改善', ex: '運用・SRE・情シス', gate: 'ticket_router', adj: 'infrastructure',
    gq: '直近の対応のうち、他チームへの転送だけで完了した割合は?',
    chain: ['operator', 'operations_engineer', 'internal_it', 'sre'],
    avoid: ['転送・エスカレーションだけの窓口', '再発防止を提案できない現場', '手順改訂が禁止された運用'],
    tree: { start: 'n1', nodes: {
      n1: { t: '問い合わせ・障害対応の中心は?', opts: [
        { l: '起票して担当チームへ転送する', end: 'ticket_router' },
        { l: '自分で調べて対応する', go: 'n2' }] },
      n2: { t: '障害の原因を、自分で分析できますか?', opts: [
        { l: '手順の範囲内で対応する', end: 'operator' },
        { l: 'ログ・メトリクスから原因を特定できる', go: 'n3', skills: ['root_cause_analysis'] }] },
      n3: { t: '再発防止まで設計していますか?', opts: [
        { l: '対応して復旧したら終わり', end: 'operations_engineer' },
        { l: '原因を潰す仕組みまで設計する', go: 'n4', skills: ['recurrence_prevention'] }] },
      n4: { t: '改善を、開発や基盤に戻せていますか?', opts: [
        { l: '社内の統制・改善として回している', end: 'internal_it' },
        { l: '開発・基盤のロードマップに接続している', end: 'sre', skills: ['feedback_to_dev'] }] },
    } } },
  governance: { name: '専門統制', ex: 'セキュリティ・FinOps・MLOps', gate: 'checklist_auditor', adj: 'network',
    gq: '直近の統制業務のうち、既定チェックリストの消化の割合は?',
    chain: ['security_operator', 'security_engineer', 'governance_lead'],
    avoid: ['チェックリスト消化だけの監査対応', 'リスク判断に関われない事務局', '形骸化した規程の維持業務'],
    tree: { start: 'n1', nodes: {
      n1: { t: '統制業務の中心は?', opts: [
        { l: '既定のチェックリストを消化する', end: 'checklist_auditor' },
        { l: 'リスクを評価して優先度を決める', go: 'n2' }] },
      n2: { t: 'リスクを定量的に説明できますか?', h: '影響額・発生確率・対応コスト。', opts: [
        { l: 'アラート対応・検知運用が中心', end: 'security_operator' },
        { l: '影響と確率で説明し、対策を設計できる', go: 'n3', skills: ['risk_quantification'] }] },
      n3: { t: '組織の基準・例外判断まで設計しますか?', opts: [
        { l: '個別システムの対策まで', end: 'security_engineer' },
        { l: '基準策定・例外承認・統制設計まで担う', end: 'governance_lead', skills: ['control_design'] }] },
    } } },
}

export const P1: P1Question[] = [
  { t: 'いちばん興味を惹かれるのは、どんな仕事?', h: '経験の有無は問いません。「やってみたい」「気になる」で選んでください。', grid: 1, opts: [
    { l: '顧客への提案・要員調整・折衝', w: [['sales', 2]] }, { l: '登壇・記事・デモづくり', w: [['evangelism', 2]] },
    { l: '業務課題の整理・資料化', w: [['consulting', 2]] }, { l: 'システム構成・設計の検討', w: [['architecture', 2]] },
    { l: '進捗・課題・会議の運営', w: [['delivery', 2]] }, { l: 'コードを書く・直す', w: [['implementation', 2]] },
    { l: 'テスト・検証', w: [['quality', 2]] }, { l: 'サーバー・クラウドの構築', w: [['infrastructure', 2]] },
    { l: 'ネットワークの設定・経路', w: [['network', 2]] }, { l: 'SQL・データベース作業', w: [['data', 2]] },
    { l: '障害対応・問い合わせ対応', w: [['operations', 2]] }, { l: 'セキュリティ・統制・監査', w: [['governance', 2]] }] },
  { t: '「これが私の仕事」と第三者に見せやすい成果物は?', h: 'いちばん自信を持って説明できるものを1つ。', grid: 1, opts: [
    { l: '提案書・契約', w: [['sales', 2]] }, { l: '登壇資料・デモアプリ', w: [['evangelism', 2]] },
    { l: '業務フロー・要件定義書', w: [['consulting', 2]] }, { l: '構成図・設計書', w: [['architecture', 2]] },
    { l: '計画書・課題管理表', w: [['delivery', 2]] }, { l: '動くコード・プルリクエスト', w: [['implementation', 2]] },
    { l: 'テスト観点表・自動テスト', w: [['quality', 2]] }, { l: 'IaC・構築した環境', w: [['infrastructure', 2]] },
    { l: 'NW構成図・経路設計', w: [['network', 2]] }, { l: 'スキーマ・SQL・実行計画', w: [['data', 2]] },
    { l: '障害報告書・改善記録', w: [['operations', 2]] }, { l: '規程・基準・監査資料', w: [['governance', 2]] }] },
  { t: '時間を忘れて没頭してしまうのは、どんな瞬間?', h: '現在の業務に関係なく選んでください。ここは「適性」のシグナルです。', grid: 1, opts: [
    { l: '顧客を口説く筋書きが決まった瞬間', w: [['sales', 2]] }, { l: '新しい技術を動かして人に見せる瞬間', w: [['evangelism', 2]] },
    { l: '業務の構造が1枚の図に整理できた瞬間', w: [['consulting', 2]] }, { l: '構成のトレードオフが解けた瞬間', w: [['architecture', 2]] },
    { l: 'バラバラの段取りが噛み合った瞬間', w: [['delivery', 2]] }, { l: '書いたコードがテストを一発で通った瞬間', w: [['implementation', 2]] },
    { l: '誰も想定しなかった壊し方を見つけた瞬間', w: [['quality', 2]] }, { l: '環境がコードから一発で再現できた瞬間', w: [['infrastructure', 2]] },
    { l: 'パケットの流れを読み切れた瞬間', w: [['network', 2]] }, { l: '遅いクエリが劇的に速くなった瞬間', w: [['data', 2]] },
    { l: '障害の根本原因を突き止めた瞬間', w: [['operations', 2]] }, { l: '見落とされていたリスクを見つけた瞬間', w: [['governance', 2]] }] },
  { t: '失敗が起きたとき、最終的にあなたが説明を求められるのは?', h: '肩書きではなく、実際に「詰められる」対象で。ここは現在地のシグナルです。', grid: 1, opts: [
    { l: '売上・契約・失注', w: [['sales', 2], ['delivery', 1]] }, { l: '技術の評判・発信内容', w: [['evangelism', 2]] },
    { l: '提言・意思決定の誤り', w: [['consulting', 2], ['sales', 1]] }, { l: '設計・構成の欠陥', w: [['architecture', 2], ['implementation', 1]] },
    { l: '納期・進行の遅れ', w: [['delivery', 2]] }, { l: '動かないリリース・バグ', w: [['implementation', 2], ['quality', 1]] },
    { l: '品質基準・検証漏れ', w: [['quality', 2]] }, { l: '基盤障害・可用性', w: [['infrastructure', 2], ['operations', 1]] },
    { l: '通信断・到達性', w: [['network', 2]] }, { l: 'データの欠損・不整合', w: [['data', 2]] },
    { l: 'セキュリティ事故・監査指摘', w: [['governance', 2]] }] },
  { t: '周りからいちばん頼られる相談は?', h: '「あの人に聞け」と言われる領域。', grid: 1, opts: [
    { l: 'この案件・要員をどうする?', w: [['sales', 2]] }, { l: 'この技術ってどうなの?', w: [['evangelism', 2]] },
    { l: '業務をどう変えるべき?', w: [['consulting', 2]] }, { l: 'どう作るのが正しい?(技術選定)', w: [['architecture', 2], ['implementation', 1]] },
    { l: '優先順位を捌いて・調整して', w: [['delivery', 2]] }, { l: '実装で詰まった、助けて', w: [['implementation', 2]] },
    { l: 'テストどうする?', w: [['quality', 2]] }, { l: '環境がほしい・構築して', w: [['infrastructure', 2]] },
    { l: '繋がらない・ネットワークが遅い', w: [['network', 2], ['operations', 1]] }, { l: 'データを出して・DBが遅い', w: [['data', 2]] },
    { l: '障害った・戻して', w: [['operations', 2]] }, { l: 'これってリスク大丈夫?', w: [['governance', 2]] }] },
  { t: 'AIやツールに任せず、自分が最終判断している領域は?', h: 'ここは成熟度にも加点されます。「特にない」も正直に。', grid: 1, opts: [
    { l: '顧客との落とし所', w: [['sales', 1]], m: 1 }, { l: '技術の打ち出し方', w: [['evangelism', 1]], m: 1 },
    { l: '何を変えるかの論点', w: [['consulting', 1]], m: 1 }, { l: '構造と制約のトレードオフ', w: [['architecture', 1]], m: 1 },
    { l: '優先順位とリスクの取捨', w: [['delivery', 1]], m: 1 }, { l: 'この変更を入れて安全か', w: [['implementation', 1]], m: 1 },
    { l: 'どこまで検証すれば十分か', w: [['quality', 1]], m: 1 }, { l: '構成変更の影響範囲', w: [['infrastructure', 1]], m: 1 },
    { l: '経路・境界の変更可否', w: [['network', 1]], m: 1 }, { l: 'データ整合性の最終確認', w: [['data', 1]], m: 1 },
    { l: '復旧手順の選択', w: [['operations', 1]], m: 1 }, { l: 'リスクを受容してよいか', w: [['governance', 1]], m: 1 },
    { l: '特にない', w: [], m: 0 }] },
]

export const P2: P2Question[] = [
  { t: '仕事の起点は、どれに近いですか?', h: '同じ職種名でも、ここで市場価値が分かれます。', opts: [
    { l: '割り当てられたチケット・指示から', v: 0 }, { l: '目的を確認して、自分で段取りする', v: 1 },
    { l: '仕組み・構造から考えて提案する', v: 2 }, { l: '標準・仕組みを作って他人に使わせる', v: 3 },
    { l: '優先順位と最終判断を自分が持つ', v: 4 }] },
  { t: '「なぜそのやり方?」と聞かれたら?', h: '', opts: [
    { l: '手順書・前例どおり、としか言えない', v: 0 }, { l: '経験上こうする、と答える', v: 1 },
    { l: '根拠と制約条件を説明できる', v: 2 }, { l: '代替案とトレードオフまで話せる', v: 3 },
    { l: '却下した案と判断基準まで記録している', v: 4 }] },
  { t: '直近半年の「改善・再発防止」は?', h: '', opts: [
    { l: 'していない', v: 0 }, { l: '困りごとを報告した', v: 1 },
    { l: '原因を分析して提案した', v: 2 }, { l: '自動化・標準化して定着させた', v: 3 },
    { l: '組織の標準として意思決定した', v: 4 }] },
  { t: 'あなたの失敗は、誰の責任ですか?', h: '建前ではなく、実際の運用で。', opts: [
    { l: '指示した上司・リーダーのもの', v: 0 }, { l: '指示の範囲内なら自分のもの', v: 1 },
    { l: '担当範囲の結果は自分のもの', v: 2 }, { l: 'チームの品質・納期まで自分のもの', v: 3 },
    { l: '事業・顧客への結果まで自分のもの', v: 4 }] },
]

export const PHASES: Record<number, { l: string; c: string }> = {
  1: { l: '第1層 · 価値レイヤー判定', c: '#2e6be6' },
  2: { l: '第2層 · 責任成熟度判定', c: '#6a5be2' },
  3: { l: '第3層 · 退化リスクゲート', c: '#c24a4a' },
  4: { l: '第4層 · 職種固有分岐', c: '#2f9268' },
  5: { l: '第5層 · 遷移判定', c: '#b07a2e' },
}

export const TRANSJP: Record<TransitionType, string> = {
  adjacent: '隣接遷移',
  upgrade: '上位遷移',
  compensate: '補償遷移',
  retreat: '撤退遷移',
}

export const LAYER_KEYS = Object.keys(LAYERS) as LayerKey[]
