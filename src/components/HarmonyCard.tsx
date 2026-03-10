import { useState } from 'react';
import ColorSwatch from './ColorSwatch';
import { Info } from 'lucide-react';

interface HarmonyCardProps {
    title: string;
    subtitle: string;
    colors: { hex: string; label: string }[];
}

export default function HarmonyCard({ title, subtitle, colors }: HarmonyCardProps) {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col h-full shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-center mb-6 z-10">
                <div>
                    <h3 className="text-white font-bold tracking-wide text-lg mb-1 group-hover:text-indigo-200 transition-colors drop-shadow-sm">{title}</h3>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">{subtitle}</p>
                </div>
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className={`p-2 rounded-full transition-all duration-300 border backdrop-blur-sm ${showInfo
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 rotate-12 scale-110'
                            : 'bg-black/20 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                        }`}
                    title={showInfo ? "Close notes" : "Notes & Information"}
                >
                    <Info size={18} />
                </button>
            </div>

            {/* Colors Container (Always present in DOM to hold space) */}
            <div className={`flex gap-3 flex-1 transition-opacity duration-300 ${showInfo ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'}`}>
                {colors.map((c, i) => (
                    <div key={i} className="flex-1 min-w-0">
                        <ColorSwatch color={c.hex} label={c.label} />
                    </div>
                ))}
            </div>

            {/* Information Overlay */}
            <div
                className={`absolute left-0 right-0 bottom-0 top-[80px] p-6 bg-black/60 backdrop-blur-xl border-t border-white/10 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 overflow-y-auto ${showInfo ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0 pointer-events-none'
                    }`}
            >
                <div className="text-sm text-gray-300 leading-relaxed mb-4 font-medium flex-shrink-0">
                    <span className="text-indigo-300 font-bold">{title}</span> uses colors that are {subtitle.toLowerCase()} on the color wheel.
                    This creates a specific visual relationship useful for design.
                </div>

                <textarea
                    className="w-full h-full flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-sans placeholder:text-gray-600 shadow-inner"
                    placeholder="Add your project notes for this harmony..."
                ></textarea>
            </div>
        </div>
    );
}
