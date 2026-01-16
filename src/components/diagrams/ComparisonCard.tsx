'use client';

interface ComparisonItem {
    text: string;
}

interface ComparisonCardProps {
    title?: string;
    doItems: ComparisonItem[];
    dontItems: ComparisonItem[];
}

/**
 * Side-by-side Do/Don't comparison card
 * Great for showing best practices vs anti-patterns
 */
export function ComparisonCard({ title = "Best Practices", doItems, dontItems }: ComparisonCardProps) {
    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">⚖️</span> {title}
                </h3>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Do Column */}
                <div className="relative rounded-2xl overflow-hidden">
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-4">
                        <div className="flex items-center gap-3 text-white">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="text-xl">✅</span>
                            </div>
                            <h4 className="text-lg font-bold">Do This</h4>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-emerald-50 border-2 border-emerald-200 border-t-0 rounded-b-2xl p-5">
                        <ul className="space-y-3">
                            {doItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm border border-emerald-100"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {item.text}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Don't Column */}
                <div className="relative rounded-2xl overflow-hidden">
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4">
                        <div className="flex items-center gap-3 text-white">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="text-xl">❌</span>
                            </div>
                            <h4 className="text-lg font-bold">Avoid This</h4>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-red-50 border-2 border-red-200 border-t-0 rounded-b-2xl p-5">
                        <ul className="space-y-3">
                            {dontItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm border border-red-100"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    <p className="text-gray-700 text-sm leading-relaxed line-through decoration-red-300">
                                        {item.text}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * When to Use / Common Mistakes comparison
 */
export function WhenToUseCard({ whenToUse, commonMistakes }: { whenToUse?: string; commonMistakes?: string }) {
    if (!whenToUse && !commonMistakes) return null;

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* When to Use */}
            {whenToUse && (
                <div className="relative rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                        <div className="flex items-center gap-3 text-white">
                            <span className="text-2xl">✅</span>
                            <h4 className="text-lg font-bold">When to Use</h4>
                        </div>
                    </div>
                    <div className="bg-emerald-50 border-2 border-emerald-200 border-t-0 rounded-b-2xl p-5">
                        <p className="text-emerald-800 leading-relaxed">{whenToUse}</p>
                    </div>
                </div>
            )}

            {/* Common Mistakes */}
            {commonMistakes && (
                <div className="relative rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                        <div className="flex items-center gap-3 text-white">
                            <span className="text-2xl">⚠️</span>
                            <h4 className="text-lg font-bold">Common Mistakes</h4>
                        </div>
                    </div>
                    <div className="bg-amber-50 border-2 border-amber-200 border-t-0 rounded-b-2xl p-5">
                        <p className="text-amber-800 leading-relaxed">{commonMistakes}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
