'use client';

interface BeforeAfterProps {
    title?: string;
    before: {
        title: string;
        points: string[];
    };
    after: {
        title: string;
        points: string[];
    };
}

/**
 * Before/After comparison for transformation frameworks
 * Great for: Mindset shifts, Process improvements, Cultural changes
 */
export function BeforeAfter({ title = "Transformation", before, after }: BeforeAfterProps) {
    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🔄</span> {title}
                </h3>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Before */}
                <div className="relative rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-400 to-gray-500 px-6 py-4">
                        <div className="flex items-center gap-3 text-white">
                            <span className="text-2xl">😐</span>
                            <h4 className="text-lg font-bold">{before.title}</h4>
                        </div>
                    </div>
                    <div className="bg-gray-50 border-2 border-gray-200 border-t-0 rounded-b-2xl p-5">
                        <ul className="space-y-2">
                            {before.points.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                                    <span className="text-gray-400">•</span>
                                    <span className="line-through decoration-gray-400">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* After */}
                <div className="relative rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                        <div className="flex items-center gap-3 text-white">
                            <span className="text-2xl">🚀</span>
                            <h4 className="text-lg font-bold">{after.title}</h4>
                        </div>
                    </div>
                    <div className="bg-emerald-50 border-2 border-emerald-200 border-t-0 rounded-b-2xl p-5">
                        <ul className="space-y-2">
                            {after.points.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-emerald-700 text-sm">
                                    <span className="text-emerald-500">✓</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center -mt-4 relative z-10">
                <div className="bg-white rounded-full p-2 shadow-lg border-2 border-gray-100">
                    <span className="text-2xl">→</span>
                </div>
            </div>
        </div>
    );
}
