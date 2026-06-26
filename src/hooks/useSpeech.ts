import { useCallback, useEffect, useRef, useState } from 'react'

// Web Speech API をつかって日本語を読み上げるフック。
// 子供がボタンをおすと文字や単語の読みを音声で確認できる。

function pickJapaneseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  return (
    voices.find((v) => v.lang === 'ja-JP') ??
    voices.find((v) => v.lang.startsWith('ja'))
  )
}

export function useSpeech() {
  const [supported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
  )
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined)

  useEffect(() => {
    if (!supported) return
    const load = () => {
      voiceRef.current = pickJapaneseVoice(window.speechSynthesis.getVoices())
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [supported])

  const speak = useCallback(
    (text: string) => {
      if (!supported) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'ja-JP'
      u.rate = 0.85
      u.pitch = 1.1
      if (voiceRef.current) u.voice = voiceRef.current
      window.speechSynthesis.speak(u)
    },
    [supported],
  )

  return { speak, supported }
}
