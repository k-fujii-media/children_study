import type { Category } from './types'
import { hiraganaItems } from './hiragana'
import { katakanaItems } from './katakana'
import { wordItems } from './words'
import { kanjiItems } from './kanji'

// アプリ全体のカリキュラム。
// 新しいカテゴリ（さんすう・えいご など）を足すときは、この配列に Category を追加する。
export const curriculum: Category[] = [
  {
    id: 'japanese',
    title: 'にほんご',
    subtitle: 'よみかき',
    emoji: '🇯🇵',
    color: '#ef476f',
    levels: [
      {
        id: 'hiragana',
        title: 'ひらがな',
        subtitle: '46もじ',
        emoji: 'あ',
        color: '#ff70a6',
        activities: ['read', 'write'],
        items: hiraganaItems,
      },
      {
        id: 'katakana',
        title: 'カタカナ',
        subtitle: '46もじ',
        emoji: 'ア',
        color: '#ffa552',
        activities: ['read', 'write'],
        items: katakanaItems,
      },
      {
        id: 'words',
        title: 'ことば',
        subtitle: 'えとことば',
        emoji: '🍎',
        color: '#06d6a0',
        activities: ['read'],
        items: wordItems,
      },
      {
        id: 'kanji-g1',
        title: 'かんじ',
        subtitle: 'しょうがく1ねん',
        emoji: '山',
        color: '#118ab2',
        activities: ['read', 'write'],
        items: kanjiItems,
      },
    ],
  },
]

/** ID からカテゴリを探す。 */
export function findCategory(categoryId: string): Category | undefined {
  return curriculum.find((c) => c.id === categoryId)
}

/** ID からレベルを探す。 */
export function findLevel(categoryId: string, levelId: string) {
  const category = findCategory(categoryId)
  const level = category?.levels.find((l) => l.id === levelId)
  return { category, level }
}
