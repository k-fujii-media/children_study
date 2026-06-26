// 音声認識の結果と「こたえ（読み）」を、ゆるめに照合するためのユーティリティ。
// カタカナ→ひらがな統一、長音記号や記号・空白の除去をして比べる。

// カタカナをひらがなに変換する。
function katakanaToHiragana(text: string): string {
  return text.replace(/[ァ-ヶ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  )
}

// 比較用に正規化する（ひらがな化・記号や空白の除去）。
export function normalizeReading(text: string): string {
  return katakanaToHiragana(text)
    .replace(/[ー－\s、。・!?！？]/g, '')
    .trim()
}

// 認識候補のどれかが、こたえと一致（またはこたえを含む）すれば正解とみなす。
// 1文字の認識はゆれが大きいので、双方向の包含も許容してゆるく判定する。
export function isReadingMatch(candidates: string[], answer: string): boolean {
  const target = normalizeReading(answer)
  if (!target) return false
  return candidates.some((candidate) => {
    const heard = normalizeReading(candidate)
    if (!heard) return false
    return heard === target || heard.includes(target) || target.includes(heard)
  })
}
