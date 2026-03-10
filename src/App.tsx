import { useState, useEffect } from 'react'
import {
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  getSquareColors,
  getTetradicColors,
  getMonochromatic,
  hexToRgbString,
  hexToHslString
} from './utils/colorUtils'
import HarmonyCard from './components/HarmonyCard'
import ColorWheel from './components/ColorPicker'
import { Copy, Droplet, Dices, RotateCcw } from 'lucide-react'

// Helper to determine text color based on background
function getContrastColor(hex: string) {
  if (!hex) return "#fff";
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000' : '#fff';
}

export default function App() {
  // Load initial color from URL or use default
  const getInitialColor = () => {
    const hash = window.location.hash.slice(1)
    if (/^[0-9A-Fa-f]{6}$/.test(hash)) {
      return '#' + hash.toLowerCase()
    }
    return "#6366f1"
  }

  const [baseColor, setBaseColor] = useState(getInitialColor)
  const [hexInput, setHexInput] = useState(getInitialColor().toUpperCase())
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const [recentColors, setRecentColors] = useState<string[]>([])

  const complementary = getComplementaryColor(baseColor)
  const analogous = getAnalogousColors(baseColor)
  const triadic = getTriadicColors(baseColor)
  const splitComplementary = getSplitComplementaryColors(baseColor)
  const square = getSquareColors(baseColor)
  const tetradic = getTetradicColors(baseColor)
  const monochromatic = getMonochromatic(baseColor)

  const rgbString = hexToRgbString(baseColor)
  const hslString = hexToHslString(baseColor)

  // Update URL when color changes
  useEffect(() => {
    window.history.replaceState(null, '', `#${baseColor.slice(1)}`)
    setHexInput(baseColor.toUpperCase())
  }, [baseColor])

  // Track recent colors
  useEffect(() => {
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== baseColor)
      return [baseColor, ...filtered].slice(0, 8)
    })
  }, [baseColor])

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(id);
    setTimeout(() => setCopiedValue(null), 1500);
  }

  const handleRandom = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setBaseColor(randomHex)
  }

  const handleEyedropper = async () => {
    const w = window as any;
    if (!w.EyeDropper) {
      alert('EyeDropper API is not supported in your browser. Try Chrome or Edge.')
      return
    }
    try {
      const eyeDropper = new w.EyeDropper()
      const result = await eyeDropper.open()
      setBaseColor(result.sRGBHex.toLowerCase())
    } catch (e) { }
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase()
    if (!val.startsWith('#')) val = '#' + val
    val = val.slice(0, 7)
    setHexInput(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setBaseColor(val.toLowerCase())
    }
  }

  return (
    <div className="min-h-screen bg-[#14151a] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 mb-16">
          <div className="relative">
            <ColorWheel size={320} onChange={setBaseColor} />
            <div
              className="absolute pointer-events-none rounded-full border-4 border-white shadow-lg shadow-black/30"
              style={{
                width: 32, height: 32,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: baseColor
              }}
            />
          </div>

          <div className="flex flex-col gap-6 w-full max-w-lg">
            {/* Big Color Block / Input */}
            <div className="relative w-full">
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                className="w-full h-24 rounded-2xl text-center text-3xl font-bold tracking-widest uppercase shadow-lg transition-transform hover:scale-[1.02] cursor-text focus:outline-none focus:ring-4 focus:ring-white/20"
                style={{ backgroundColor: baseColor, color: getContrastColor(baseColor) }}
                title="Enter HEX"
                maxLength={7}
                spellCheck={false}
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {/* Copy Value Item */}
              <div
                className="flex-1 bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-black/60 transition-colors group h-12"
                onClick={() => copyToClipboard('hex', baseColor)}
              >
                {copiedValue === 'hex' ? (
                  <span className="text-white font-medium mx-auto text-sm tracking-wide">Copied!</span>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-400 font-medium text-sm">HEX</span>
                    <span className="font-mono text-sm tracking-wide mx-3 group-hover:text-white transition-colors">
                      {baseColor.toUpperCase()}
                    </span>
                    <Copy size={16} className="text-gray-500 group-hover:text-white" />
                  </div>
                )}
              </div>

              {/* Additional Action Buttons */}
              <div className="flex gap-2">
                <button
                  className="bg-black/40 hover:bg-black/60 border border-white/5 p-3 rounded-xl transition-colors text-gray-400 hover:text-white group"
                  onClick={handleEyedropper}
                  title="Pick from screen"
                >
                  <Droplet size={18} className="group-hover:scale-110 transition-transform" />
                </button>
                <button
                  className="bg-black/40 hover:bg-black/60 border border-white/5 p-3 rounded-xl transition-colors text-gray-400 hover:text-white group"
                  onClick={handleRandom}
                  title="Random Color"
                >
                  <Dices size={18} className="group-hover:scale-110 transition-transform" />
                </button>
                <button
                  className="bg-black/40 hover:bg-black/60 border border-white/5 p-3 rounded-xl transition-colors text-gray-400 hover:text-white group"
                  onClick={() => setBaseColor("#6366f1")}
                  title="Reset Color"
                >
                  <RotateCcw size={18} className="group-hover:-rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div
                className="flex-1 bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-black/60 transition-colors group h-12"
                onClick={() => copyToClipboard('rgb', rgbString)}
              >
                {copiedValue === 'rgb' ? (
                  <span className="text-white font-medium text-sm mx-auto tracking-wide">Copied!</span>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-medium text-[10px] tracking-wider">RGB</span>
                      <span className="font-mono text-xs tracking-wider group-hover:text-white transition-colors">{rgbString}</span>
                    </div>
                    <Copy size={14} className="text-gray-500 group-hover:text-white" />
                  </div>
                )}
              </div>
              <div
                className="flex-1 bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-black/60 transition-colors group h-12"
                onClick={() => copyToClipboard('hsl', hslString)}
              >
                {copiedValue === 'hsl' ? (
                  <span className="text-white font-medium text-sm mx-auto tracking-wide">Copied!</span>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-medium text-[10px] tracking-wider">HSL</span>
                      <span className="font-mono text-xs tracking-wider group-hover:text-white transition-colors">{hslString}</span>
                    </div>
                    <Copy size={14} className="text-gray-500 group-hover:text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Recent Colors */}
            {recentColors.length > 1 && (
              <div className="mt-2 flex flex-col gap-3">
                <span className="text-gray-500 font-medium text-[10px] tracking-widest pl-1">RECENT</span>
                <div className="flex flex-wrap gap-3">
                  {recentColors.slice(1).map((c, i) => (
                    <button
                      key={i}
                      className="w-8 h-8 rounded-full border border-white/20 hover:scale-110 transition-transform shadow-md outline-none focus:ring-2 focus:ring-white/30"
                      style={{ backgroundColor: c }}
                      onClick={() => setBaseColor(c)}
                      title={c.toUpperCase()}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>



        {/* Harmony Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">

          <HarmonyCard
            title="Complementary"
            subtitle="180° opposite"
            colors={[
              { hex: baseColor, label: 'BASE' },
              { hex: complementary, label: 'COMPLEMENTARY' }
            ]}
          />

          <HarmonyCard
            title="Analogous"
            subtitle="±30° adjacent"
            colors={[
              { hex: analogous[0], label: 'ANA 1' },
              { hex: analogous[1], label: 'BASE' },
              { hex: analogous[2], label: 'ANA 2' }
            ]}
          />

          <HarmonyCard
            title="Triadic"
            subtitle="120° spacing"
            colors={[
              { hex: triadic[0], label: 'BASE' },
              { hex: triadic[1], label: 'TRIADIC 1' },
              { hex: triadic[2], label: 'TRIADIC 2' }
            ]}
          />

          <HarmonyCard
            title="Split Complementary"
            subtitle="150° & 210°"
            colors={[
              { hex: splitComplementary[0], label: 'BASE' },
              { hex: splitComplementary[1], label: 'SPLIT 1' },
              { hex: splitComplementary[2], label: 'SPLIT 2' }
            ]}
          />

          <HarmonyCard
            title="Square"
            subtitle="90° spacing"
            colors={[
              { hex: square[0], label: 'BASE' },
              { hex: square[1], label: 'SQUARE 1' },
              { hex: square[2], label: 'SQUARE 2' },
              { hex: square[3], label: 'SQUARE 3' }
            ]}
          />

          <HarmonyCard
            title="Tetradic"
            subtitle="Double complement"
            colors={[
              { hex: tetradic[0], label: 'BASE' },
              { hex: tetradic[1], label: 'TETRA 1' },
              { hex: tetradic[2], label: 'TETRA 2' },
              { hex: tetradic[3], label: 'TETRA 3' }
            ]}
          />

          <div className="lg:col-span-2">
            <HarmonyCard
              title="Monochromatic"
              subtitle="Light/dark variants"
              colors={monochromatic.map((m: any) => ({ hex: m.hex, label: m.label.toUpperCase() }))}
            />
          </div>

        </div>


        {/* Separator / Footer text */}
        <div className="relative py-8 mb-8 flex justify-center items-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800/80"></div>
          </div>
          <div className="relative bg-[#14151a] px-6 text-sm text-gray-500/80 tracking-wide font-medium">
            Built by <span className="text-white hover:text-indigo-400 cursor-pointer transition-colors delay-75">Nimesh Babu Thapa</span>
          </div>
        </div>
      </div>
    </div>
  )
}
