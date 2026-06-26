import { useEffect, useRef } from 'react'

// なぞり書き用キャンバス。
// うすいお手本の文字の上を、指（タッチ）やマウスでなぞって線をひく。
export default function TracingCanvas({ glyph }: { glyph: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const lastRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 画面の解像度にあわせて くっきり描画する。
    const size = Math.min(canvas.parentElement?.clientWidth ?? 320, 360)
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    // 背景とマス目、お手本の文字をかく。
    const draw = () => {
      ctx.clearRect(0, 0, size, size)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)

      // 十字のガイド線。
      ctx.strokeStyle = '#e6e6e6'
      ctx.lineWidth = 1
      ctx.setLineDash([6, 6])
      ctx.beginPath()
      ctx.moveTo(size / 2, 0)
      ctx.lineTo(size / 2, size)
      ctx.moveTo(0, size / 2)
      ctx.lineTo(size, size / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // うすいお手本の文字。
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `${size * 0.72}px "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif`
      ctx.fillText(glyph, size / 2, size / 2 + size * 0.02)
    }
    draw()

    // 書いた線のスタイル。
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    const pos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const start = (e: PointerEvent) => {
      e.preventDefault()
      drawingRef.current = true
      lastRef.current = pos(e)
      canvas.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!drawingRef.current) return
      e.preventDefault()
      const p = pos(e)
      const last = lastRef.current!
      ctx.strokeStyle = '#ff5d8f'
      ctx.lineWidth = size * 0.06
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      lastRef.current = p
    }
    const end = () => {
      drawingRef.current = false
      lastRef.current = null
    }

    canvas.addEventListener('pointerdown', start)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', end)
    canvas.addEventListener('pointercancel', end)
    canvas.addEventListener('pointerleave', end)

    return () => {
      canvas.removeEventListener('pointerdown', start)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', end)
      canvas.removeEventListener('pointercancel', end)
      canvas.removeEventListener('pointerleave', end)
    }
  }, [glyph])

  return <canvas ref={canvasRef} className="tracing-canvas" />
}
