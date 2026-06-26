// 音声認識の結果と「こたえ（読み）」を、ゆるめに照合するためのユーティリティ。
// カタカナ→ひらがな統一、長音記号や記号・空白の除去をして比べる。

// カタカナをひらがなに変換する。
function katakanaToHiragana(text: string): string {
  return text.replace(/[ァ-ヶ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  )
}

// ひらがなをカタカナに変換する。
function hiraganaToKatakana(text: string): string {
  return text.replace(/[ぁ-ゖ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60),
  )
}

// 表示する「かな」の種類。ひらがな問題・ことば問題はひらがな、カタカナ問題はカタカナ。
export type KanaScript = 'hiragana' | 'katakana'

// 文字列を指定したかな（ひらがな or カタカナ）にそろえる。表示用。
// 例: toKanaScript('い', 'katakana') => 'イ'
export function toKanaScript(text: string, script: KanaScript): string {
  return script === 'katakana'
    ? hiraganaToKatakana(text)
    : katakanaToHiragana(text)
}

// 比較用に正規化する（ひらがな化・記号や空白の除去）。
export function normalizeReading(text: string): string {
  return katakanaToHiragana(text)
    .replace(/[ー－\s、。・!?！？]/g, '')
    .trim()
}

// 1つの候補がこたえと一致（またはこたえを含む）するか。
function matchesAnswer(candidate: string, target: string): boolean {
  const heard = normalizeReading(candidate)
  if (!heard) return false
  return heard === target || heard.includes(target) || target.includes(heard)
}

// 認識候補のどれかが、こたえと一致（またはこたえを含む）すれば正解とみなす。
// 1文字の認識はゆれが大きいので、双方向の包含も許容してゆるく判定する。
export function isReadingMatch(candidates: string[], answer: string): boolean {
  const target = normalizeReading(answer)
  if (!target) return false
  return candidates.some((candidate) => matchesAnswer(candidate, target))
}

// 「きこえたことば」として画面に出す候補を1つ選ぶ。
// 音声認識は「い」を「胃」のように漢字へ変換してしまうことがあるので、
//  1) こたえに一致した候補（かなのことが多い）
//  2) かなだけでできた候補
//  3) それも無ければ先頭
// の順で、なるべくかなの候補をえらぶ。
export function pickHeard(candidates: string[], answer: string): string {
  const target = normalizeReading(answer)
  const matched = candidates.find((c) => target && matchesAnswer(c, target))
  if (matched) return matched
  const kanaOnly = candidates.find(
    (c) => /[ぁ-ゖァ-ヶー]/.test(c) && !/[一-龯々〆]/.test(c),
  )
  return kanaOnly ?? candidates[0] ?? ''
}
