'use client';

interface FunnelStage {
    label: string;
    value?: string;
    color?: string;
}

interface FunnelProps {
    title?: string;
    stages: FunnelStage[];
}

/**
 * Funnel diagram for conversion/filtering frameworks
 * Great for: User acquisition, Sales pipeline, Feature prioritization
 */
export function Funnel({ title = "Conversion Funnel", stages }: FunnelProps) {
    const colors = [
        'from-violet-500 to-purple-600',
        'from-blue-500 to-indigo-600',
        'from-cyan-500 to-blue-600',
        'from-teal-500 to-cyan-600',
        'from-emerald-500 to-teal-600',
    ];

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <span className="text-2xl">📊</span> {title}
                </h3>
            )}

            <div className="flex flex-col items-center space-y-2">
                {stages.map((stage, index) => {
                    const widthPercent = 100 - (index * (60 / stages.length));
                    return (
                        <div
                            key={index}
                            className={`
                                bg-gradient-to-r ${colors[index % colors.length]}
                                rounded-lg py-4 px-6 text-white text-center
                                shadow-lg hover:shadow-xl transition-shadow
                                transform hover:-translate-y-1 transition-transform
                            `}
                            style={{ width: `${widthPercent}%` }}
                        >
                            <div className="font-bold">{stage.label}</div>
                            {stage.value && (
                                <div className="text-sm opacity-80 mt-1">{stage.value}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
