'use client';

interface EquationTerm {
    label: string;
    description?: string;
}

interface EquationProps {
    title?: string;
    result: string;
    terms: EquationTerm[];
    operator?: '+' | '×' | '→';
}

/**
 * Equation/Formula visualization for multiplicative frameworks
 * Great for: PMF formula, Success equations, Factor combinations
 */
export function Equation({
    title = "Success Formula",
    result,
    terms,
    operator = '×'
}: EquationProps) {
    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <span className="text-2xl">🧮</span> {title}
                </h3>
            )}

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl">
                {/* Main Equation */}
                <div className="flex items-center justify-center flex-wrap gap-4 mb-6">
                    {terms.map((term, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-violet-500 to-purple-600 px-6 py-3 rounded-xl text-white font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer">
                                {term.label}
                            </div>
                            {index < terms.length - 1 && (
                                <span className="text-3xl font-bold text-amber-400">{operator}</span>
                            )}
                        </div>
                    ))}
                    <span className="text-3xl font-bold text-amber-400">=</span>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-4 rounded-xl text-white font-bold text-xl shadow-lg">
                        {result}
                    </div>
                </div>

                {/* Term Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-slate-700 pt-6">
                    {terms.map((term, index) => (
                        <div key={index} className="text-center">
                            <div className="text-violet-400 font-bold mb-1">{term.label}</div>
                            {term.description && (
                                <div className="text-slate-400 text-sm">{term.description}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
