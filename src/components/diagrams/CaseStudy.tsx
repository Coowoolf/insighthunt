'use client';

interface CaseStudyProps {
    title?: string;
    company: string;
    challenge: string;
    solution: string;
    result: string;
    quote?: string;
}

/**
 * Case Study card for real-world example frameworks
 * Great for: Success stories, Implementation examples, Lessons learned
 */
export function CaseStudy({
    title = "Real World Example",
    company,
    challenge,
    solution,
    result,
    quote
}: CaseStudyProps) {
    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">💼</span> {title}
                </h3>
            )}

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 text-white">
                    <h4 className="text-xl font-bold">{company}</h4>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Challenge */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                            <span>🎯</span>
                        </div>
                        <div>
                            <h5 className="font-bold text-red-700 text-sm mb-1">Challenge</h5>
                            <p className="text-gray-600 text-sm">{challenge}</p>
                        </div>
                    </div>

                    {/* Solution */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <span>💡</span>
                        </div>
                        <div>
                            <h5 className="font-bold text-blue-700 text-sm mb-1">Solution</h5>
                            <p className="text-gray-600 text-sm">{solution}</p>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <span>🏆</span>
                        </div>
                        <div>
                            <h5 className="font-bold text-emerald-700 text-sm mb-1">Result</h5>
                            <p className="text-gray-600 text-sm">{result}</p>
                        </div>
                    </div>

                    {/* Quote */}
                    {quote && (
                        <blockquote className="mt-4 bg-white rounded-xl p-4 border-l-4 border-brand-mid italic text-gray-600 text-sm">
                            "{quote}"
                        </blockquote>
                    )}
                </div>
            </div>
        </div>
    );
}
