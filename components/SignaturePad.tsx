'use client'
import { useRef, useEffect, useState, useCallback } from 'react'

interface SignaturePadProps {
  onChange: (dataUrl: string | null) => void
  label?: string
  placeholder?: string
  height?: number
}

export default function SignaturePad({
  onChange,
  label,
  placeholder = 'Sign here',
  height = 160,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getCtx = () => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.strokeStyle = '#f0ead8'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    return ctx
  }

  const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = useCallback((x: number, y: number) => {
    const ctx = getCtx()
    if (!ctx) return
    setIsDrawing(true)
    lastPos.current = { x, y }
    ctx.beginPath()
    ctx.moveTo(x, y)
  }, [])

  const draw = useCallback((x: number, y: number) => {
    if (!isDrawing) return
    const ctx = getCtx()
    if (!ctx || !lastPos.current) return
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    lastPos.current = { x, y }
    setIsEmpty(false)
  }, [isDrawing])

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)
    lastPos.current = null
    const canvas = canvasRef.current
    if (canvas && !isEmpty) {
      onChange(canvas.toDataURL('image/png'))
    }
  }, [isDrawing, isEmpty, onChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas resolution to match device pixel ratio
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    if (rect.width > 0) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getPos(e, canvas)
      startDrawing(pos.x / (window.devicePixelRatio || 1), pos.y / (window.devicePixelRatio || 1))
    }
    const handleMouseMove = (e: MouseEvent) => {
      const pos = getPos(e, canvas)
      draw(pos.x / (window.devicePixelRatio || 1), pos.y / (window.devicePixelRatio || 1))
    }
    const handleMouseUp = () => stopDrawing()
    const handleMouseLeave = () => stopDrawing()

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      const pos = getPos(touch, canvas)
      startDrawing(pos.x, pos.y)
    }
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      const pos = getPos(touch, canvas)
      draw(pos.x, pos.y)
    }
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      stopDrawing()
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [startDrawing, draw, stopDrawing])

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
    onChange(null)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[#9ba9bb] text-xs tracking-widest uppercase">{label}</label>
      )}
      <div
        className="relative rounded-lg border-2 border-[#c9a84c]/40 bg-[#0d1120] overflow-hidden"
        style={{ height }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          style={{ height: '100%', width: '100%' }}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[#9ba9bb]/40 text-sm italic select-none">{placeholder}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[#9ba9bb] text-xs">Use mouse or finger to sign</p>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-[#c9a84c] hover:text-[#e8c97a] underline transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
