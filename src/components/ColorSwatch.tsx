import { useState } from "react"

// Helper to determine if text should be light or dark based on background hex
function getContrastColor(hex: string) {
    if (!hex) return "#f4cacaff";
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000' : '#fff';
}

export default function ColorSwatch({ color, label }: { color: string, label?: string }) {
    const [copied, setCopied] = useState(false)

    const copyValue = async (value: string) => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
    }

    const textColor = getContrastColor(color);

    return (
        <div
            onClick={() => copyValue(color)}
            className="w-full h-32 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 shadow-sm"
            style={{ backgroundColor: color, color: textColor }}
            title="Click to copy HEX"
        >
            <div className="text-sm font-bold tracking-wide uppercase">
                {copied ? "COPIED" : color}
            </div>
            {label && (
                <div className="text-[0.65rem] mt-2 font-medium tracking-wider uppercase opacity-80">
                    {label}
                </div>
            )}
        </div>
    )
}