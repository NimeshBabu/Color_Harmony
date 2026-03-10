import { useEffect, useRef, useState } from "react"
import { hslToHex } from "../utils/colorUtils"

interface ColorWheelProps {
    size?: number;
    onChange?: (hex: string) => void;
}

export default function ColorWheel({ size = 300, onChange }: ColorWheelProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selected, setSelected] = useState({ x: size / 2, y: size / 2 })
    const wheelImageRef = useRef<ImageData | null>(null)

    // Clear cached wheel if size changes
    useEffect(() => {
        wheelImageRef.current = null
    }, [size])

    // Render the wheel and indicator
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) return;

        const radius = size / 2

        // Only draw the heavy math color wheel once per size
        if (!wheelImageRef.current) {
            ctx.clearRect(0, 0, size, size)
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const dx = x - radius
                    const dy = y - radius
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance <= radius) {
                        const angle = Math.atan2(dy, dx)
                        const hue = ((angle * 180) / Math.PI + 360) % 360
                        const saturation = distance / radius
                        const lightness = 0.5
                        const color = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`
                        ctx.fillStyle = color
                        ctx.fillRect(x, y, 1, 1)
                    }
                }
            }
            wheelImageRef.current = ctx.getImageData(0, 0, size, size)
        } else {
            // Restore the clean wheel image (clears previous pointers)
            ctx.putImageData(wheelImageRef.current, 0, 0)
        }

        // Draw the new selection pointer on top
        ctx.beginPath()
        ctx.arc(selected.x, selected.y, 6, 0, 2 * Math.PI)
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(selected.x, selected.y, 4, 0, 2 * Math.PI)
        ctx.fillStyle = "#000000"
        ctx.fill()

    }, [size, selected])

    // Interaction handlers
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const handleInteraction = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            const radius = size / 2
            const dx = x - radius
            const dy = y - radius
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Calculate mathematically instead of using getImageData
            // This prevents reading the cursor's white/black pixels as a color
            if (distance <= radius) {
                const angle = Math.atan2(dy, dx)
                const hue = ((angle * 180) / Math.PI + 360) % 360
                const saturation = distance / radius
                const lightness = 0.5

                const hex = hslToHex(Math.round(hue), Math.round(saturation * 100), Math.round(lightness * 100))

                setSelected({ x, y })
                if (onChange) onChange(hex)
            }
        }

        let isDragging = false
        const handleMouseDown = (e: MouseEvent) => {
            isDragging = true
            handleInteraction(e)
        }
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) handleInteraction(e)
        }
        const handleMouseUp = () => {
            isDragging = false
        }

        canvas.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [size, onChange])

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="rounded-full shadow-lg border-2 border-[#1f212a] transition-all hover:ring-2 ring-indigo-500/50"
            style={{ cursor: 'crosshair' }}
        />
    )
}