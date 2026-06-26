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
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
}
interface SpeechRecognitionResultEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}
interface SpeechRecognitionErrorEventLike {
  error: string
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

// うまくこたえを聞き取れなかった理由。
// 'no-speech'=声が聞こえなかった / 'not-allowed'=マイクが使えない / 'other'=その他
export type RecognitionFailReason = 'no-speech' | 'not-allowed' | 'other'

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
  // 認識が終わったら、必ず onResult か onFail のどちらか一方だけが呼ばれる。
  // - onResult: 認識できた候補（複数）を確からしい順の配列で渡す。
  // - onFail:   声が聞こえなかった等で判定できなかったときに理由を渡す。
  const listen = useCallback(
    (
      onResult: (candidates: string[]) => void,
      onFail?: (reason: RecognitionFailReason) => void,
    ) => {
      const Ctor = getRecognitionCtor()
      if (!Ctor) {
        onFail?.('other')
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

      // onresult / onerror / onend が複数発火しても、結果は1回だけ通知する。
      let settled = false
      const settle = (run: () => void) => {
        if (settled) return
        settled = true
        run()
      }

      rec.onresult = (event) => {
        const alternatives = event.results[0]
        const candidates: string[] = []
        for (let i = 0; i < alternatives.length; i++) {
          candidates.push(alternatives[i].transcript)
        }
        // まれに空の結果が来ることがあるので、その場合は失敗あつかいにする。
        if (candidates.some((c) => c.trim())) {
          settle(() => onResult(candidates))
        } else {
          settle(() => onFail?.('no-speech'))
        }
      }
      rec.onerror = (event) => {
        const reason: RecognitionFailReason =
          event.error === 'not-allowed' || event.error === 'service-not-allowed'
            ? 'not-allowed'
            : event.error === 'no-speech'
              ? 'no-speech'
              : 'other'
        settle(() => onFail?.(reason))
      }
      // onend は必ず最後に呼ばれる。ここまでに結果が出ていなければ「聞こえなかった」。
      rec.onend = () => {
        setListening(false)
        recRef.current = null
        settle(() => onFail?.('no-speech'))
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
