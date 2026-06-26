import type { LearningItem } from './types'

// かんたんなことば。絵（絵文字）と文字をむすびつけて おぼえる。
const WORDS: [string, string][] = [
  ['りんご', '🍎'],
  ['ばなな', '🍌'],
  ['いぬ', '🐶'],
  ['ねこ', '🐱'],
  ['うさぎ', '🐰'],
  ['くるま', '🚗'],
  ['でんしゃ', '🚃'],
  ['ひこうき', '✈️'],
  ['はな', '🌸'],
  ['たいよう', '☀️'],
  ['つき', '🌙'],
  ['ほし', '⭐'],
  ['さかな', '🐟'],
  ['とり', '🐦'],
  ['ぞう', '🐘'],
  ['いちご', '🍓'],
  ['ぶどう', '🍇'],
  ['くつ', '👟'],
  ['ぼうし', '🧢'],
  ['かさ', '☂️'],
]

export const wordItems: LearningItem[] = WORDS.map(([text, emoji]) => ({
  id: `word-${text}`,
  glyph: text,
  reading: text,
  hint: emoji,
}))
