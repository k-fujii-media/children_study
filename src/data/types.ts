// 学習コンテンツの共通データモデル。
// カテゴリ > レベル > 学習項目(LearningItem) の3階層で、
// 新しいカテゴリ・レベルはこのファイルの型に沿ってデータを足すだけで増やせる。

/** アクティビティの種類。read=よみ、write=なぞりがき。 */
export type ActivityKind = 'read' | 'write'

/** 1つの学習対象（文字・単語・漢字をすべてこの形に正規化する）。 */
export interface LearningItem {
  /** 一意なID（レベル内でユニーク）。進捗の保存キーにも使う。 */
  id: string
  /** 大きく表示する文字や単語。例: "あ" / "りんご" / "山" */
  glyph: string
  /** 読み（音声合成・こたえ判定に使うひらがな）。例: "あ" / "りんご" / "やま" */
  reading: string
  /** 補助の絵（絵文字）。単語や漢字のイメージづけに使う。 */
  hint?: string
  /** 意味（おもに漢字用）。例: "やま" */
  meaning?: string
  /** ローマ字（任意）。 */
  romaji?: string
}

/** ひとつのレベル（例: ひらがな、カタカナ）。 */
export interface Level {
  id: string
  /** 表示名。例: "ひらがな" */
  title: string
  /** 補足説明。例: "46もじ" */
  subtitle: string
  /** アイコン絵文字。 */
  emoji: string
  /** テーマカラー（カードの色）。 */
  color: string
  /** このレベルで使えるアクティビティ。 */
  activities: ActivityKind[]
  /** 学習項目の一覧。 */
  items: LearningItem[]
}

/** 学習カテゴリ（例: にほんご、さんすう…）。 */
export interface Category {
  id: string
  /** 表示名。例: "にほんご" */
  title: string
  /** 補足説明。 */
  subtitle: string
  /** アイコン絵文字。 */
  emoji: string
  /** テーマカラー。 */
  color: string
  /** 含まれるレベル（やさしい順に並べる）。 */
  levels: Level[]
}

/** アクティビティの表示情報。 */
export const ACTIVITY_INFO: Record<ActivityKind, { label: string; emoji: string }> = {
  read: { label: 'よむ', emoji: '👀' },
  write: { label: 'かく', emoji: '✏️' },
}
