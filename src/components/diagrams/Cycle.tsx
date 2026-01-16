'use client';

interface CycleStep {
    label: string;
    description?: string;
}

interface CycleProps {
    title?: string;
    centerLabel?: string;
    steps: CycleStep[];
}

/**
 * Circular cycle diagram for iterative frameworks
 * Great for: PDCA, Feedback loops, Sprint cycles
 */
export function Cycle({ title = "Iterative Cycle", centerLabel = "循环", steps }: CycleProps) {
    const colors = [
        'bg-violet-500',
        'bg-blue-500',
        'bg-cyan-500',
        'bg-emerald-500',
        'bg-amber-500',
        'bg-pink-500',
    ];

    const n = steps.length;
    const radius = 120; // radius of the circle

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <span className="text-2xl">🔄</span> {title}
                </h3>
            )}

            <div className="relative w-80 h-80 mx-auto">
                {/* Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-brand-start to-brand-end flex items-center justify-center text-white font-bold shadow-xl z-20">
                    {centerLabel}
                </div>

                {/* Circular arrows (SVG) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                        strokeDasharray="10,5"
                    />
                </svg>

                {/* Steps positioned in circle */}
                {steps.map((step, index) => {
                    const angle = (2 * Math.PI * index) / n - Math.PI / 2;
                    const x = 160 + radius * Math.cos(angle) - 40;
                    const y = 160 + radius * Math.sin(angle) - 24;

                    return (
                        <div
                            key={index}
                            className="absolute w-20"
                            style={{ left: x, top: y }}
                        >
                            <div className={`
                                ${colors[index % colors.length]}
                                w-12 h-12 rounded-full flex items-center justify-center
                                text-white font-bold shadow-lg mx-auto
                                hover:scale-110 transition-transform cursor-pointer
                            `}>
                                {index + 1}
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-xs font-medium text-gray-700 block">
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
