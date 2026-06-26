import type { LearningItem } from './types'

// 小学1年生でならう漢字（一部）。読み・意味・絵をセットでおぼえる。
const KANJI: { glyph: string; reading: string; meaning: string; hint: string }[] = [
  { glyph: '一', reading: 'いち', meaning: 'いち', hint: '1️⃣' },
  { glyph: '二', reading: 'に', meaning: 'に', hint: '2️⃣' },
  { glyph: '三', reading: 'さん', meaning: 'さん', hint: '3️⃣' },
  { glyph: '山', reading: 'やま', meaning: 'やま', hint: '⛰️' },
  { glyph: '川', reading: 'かわ', meaning: 'かわ', hint: '🏞️' },
  { glyph: '木', reading: 'き', meaning: 'き', hint: '🌳' },
  { glyph: '火', reading: 'ひ', meaning: 'ひ', hint: '🔥' },
  { glyph: '水', reading: 'みず', meaning: 'みず', hint: '💧' },
  { glyph: '日', reading: 'ひ', meaning: 'たいよう', hint: '☀️' },
  { glyph: '月', reading: 'つき', meaning: 'つき', hint: '🌙' },
  { glyph: '人', reading: 'ひと', meaning: 'ひと', hint: '🧍' },
  { glyph: '犬', reading: 'いぬ', meaning: 'いぬ', hint: '🐶' },
  { glyph: '花', reading: 'はな', meaning: 'はな', hint: '🌸' },
  { glyph: '雨', reading: 'あめ', meaning: 'あめ', hint: '🌧️' },
  { glyph: '車', reading: 'くるま', meaning: 'くるま', hint: '🚗' },
  { glyph: '魚', reading: 'さかな', meaning: 'さかな', hint: '🐟' },
  { glyph: '空', reading: 'そら', meaning: 'そら', hint: '🌤️' },
  { glyph: '手', reading: 'て', meaning: 'て', hint: '✋' },
  { glyph: '目', reading: 'め', meaning: 'め', hint: '👁️' },
  { glyph: '口', reading: 'くち', meaning: 'くち', hint: '👄' },
]

export const kanjiItems: LearningItem[] = KANJI.map(({ glyph, reading, meaning, hint }) => ({
  id: `kanji-${glyph}`,
  glyph,
  reading,
  meaning,
  hint,
}))
