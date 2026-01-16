'use client';

interface SpectrumPoint {
    label: string;
    position: number; // 0-100
    description?: string;
}

interface SpectrumProps {
    title?: string;
    leftLabel: string;
    rightLabel: string;
    points?: SpectrumPoint[];
    highlightPosition?: number;
}

/**
 * Linear spectrum/continuum for range-based frameworks
 * Great for: Spectrum of approaches, Risk tolerance, Personality types
 */
export function Spectrum({
    title = "Decision Spectrum",
    leftLabel,
    rightLabel,
    points = [],
    highlightPosition
}: SpectrumProps) {
    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <span className="text-2xl">📏</span> {title}
                </h3>
            )}

            <div className="relative px-4">
                {/* Gradient Bar */}
                <div className="h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-inner relative">
                    {/* Highlight marker */}
                    {highlightPosition !== undefined && (
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-4 border-purple-500"
                            style={{ left: `calc(${highlightPosition}% - 12px)` }}
                        />
                    )}

                    {/* Points */}
                    {points.map((point, index) => (
                        <div
                            key={index}
                            className="absolute top-1/2 -translate-y-1/2 group"
                            style={{ left: `calc(${point.position}% - 6px)` }}
                        >
                            <div className="w-3 h-3 bg-white rounded-full shadow border-2 border-purple-400 group-hover:scale-150 transition-transform" />
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {point.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Labels */}
                <div className="flex justify-between mt-4">
                    <div className="text-left">
                        <span className="font-bold text-blue-600">{leftLabel}</span>
                    </div>
                    <div className="text-right">
                        <span className="font-bold text-pink-600">{rightLabel}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
