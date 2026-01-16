'use client';

interface PyramidLevel {
    label: string;
    description?: string;
}

interface PyramidProps {
    title?: string;
    levels: PyramidLevel[]; // Bottom to top
}

/**
 * Pyramid diagram for hierarchical frameworks
 * Great for: Maslow's hierarchy, Priority levels, Maturity models
 */
export function Pyramid({ title = "Priority Pyramid", levels }: PyramidProps) {
    const colors = [
        'from-slate-400 to-slate-500',    // Bottom - Foundation
        'from-blue-400 to-blue-500',
        'from-cyan-400 to-cyan-500',
        'from-emerald-400 to-emerald-500',
        'from-amber-400 to-amber-500',
        'from-rose-400 to-rose-500',      // Top - Peak
    ];

    const reversedLevels = [...levels].reverse(); // Display top first

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <span className="text-2xl">🔺</span> {title}
                </h3>
            )}

            <div className="flex flex-col items-center space-y-2">
                {reversedLevels.map((level, index) => {
                    const widthPercent = 40 + (index * (50 / levels.length));
                    const colorIndex = levels.length - 1 - index;

                    return (
                        <div
                            key={index}
                            className={`
                                bg-gradient-to-r ${colors[colorIndex % colors.length]}
                                py-4 px-6 text-white text-center
                                shadow-lg hover:shadow-xl transition-all
                                transform hover:-translate-y-1
                                rounded-lg
                            `}
                            style={{
                                width: `${widthPercent}%`,
                                clipPath: index === 0
                                    ? 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
                                    : undefined
                            }}
                        >
                            <div className="font-bold text-sm">{level.label}</div>
                            {level.description && (
                                <div className="text-xs opacity-80 mt-1">{level.description}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
