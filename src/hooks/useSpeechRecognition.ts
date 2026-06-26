import { useCallback, useRef, useState } from 'react'

// Web Speech API（SpeechRecognition）で日本語の発音をきいて文字に起こすフック。
// 「よむ」アクティビティで、子供が声でこたえてマルバツ判定するのに使う。
// Chrome / Edge などは webkit プレフィックス付きで実装されている。

// 標準の型定義には SpeechRecognition が含まれないので、最低限の形を自前で用意する。
interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}
interface SpeechRecognitionResultEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognitionCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function useSpeechRecognition() {
  const [supported] = useState(() => !!getRecognitionCtor())
  const [listening, setListening] = useState(false)
  const recRef = useRef<SpeechRecognitionLike | null>(null)

  // 録音を開始する。
  // onResult には、認識された候補（複数）を確からしい順の配列で渡す。
  const listen = useCallback(
    (onResult: (candidates: string[]) => void, onError?: () => void) => {
      const Ctor = getRecognitionCtor()
      if (!Ctor) {
        onError?.()
        return
      }
      // 連打対策：前回の認識を止めてから始める。
      recRef.current?.abort()

      const rec = new Ctor()
      rec.lang = 'ja-JP'
      rec.interimResults = false
      rec.continuous = false
      rec.maxAlternatives = 5
      recRef.current = rec

      rec.onresult = (event) => {
        const alternatives = event.results[0]
        const candidates: string[] = []
        for (let i = 0; i < alternatives.length; i++) {
          candidates.push(alternatives[i].transcript)
        }
        onResult(candidates)
      }
      rec.onerror = () => onError?.()
      rec.onend = () => {
        setListening(false)
        recRef.current = null
      }

      setListening(true)
      rec.start()
    },
    [],
  )

  // 録音を途中で止める。
  const stop = useCallback(() => {
    recRef.current?.stop()
  }, [])

  return { supported, listening, listen, stop }
}
