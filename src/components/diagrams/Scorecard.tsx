'use client';

interface ScorecardMetric {
    label: string;
    score: number; // 0-10
    maxScore?: number;
}

interface ScorecardProps {
    title?: string;
    metrics: ScorecardMetric[];
    overallScore?: number;
}

/**
 * Scorecard for evaluation frameworks
 * Great for: Candidate evaluation, Product assessment, Investment criteria
 */
export function Scorecard({ title = "Evaluation Scorecard", metrics, overallScore }: ScorecardProps) {
    const getScoreColor = (score: number, max: number = 10) => {
        const ratio = score / max;
        if (ratio >= 0.8) return 'bg-emerald-500';
        if (ratio >= 0.6) return 'bg-blue-500';
        if (ratio >= 0.4) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">📊</span> {title}
                </h3>
            )}

            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden">
                {/* Metrics */}
                <div className="p-6 space-y-4">
                    {metrics.map((metric, index) => {
                        const maxScore = metric.maxScore || 10;
                        const percentage = (metric.score / maxScore) * 100;

                        return (
                            <div key={index}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                                    <span className="text-sm font-bold text-gray-900">{metric.score}/{maxScore}</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getScoreColor(metric.score, maxScore)} rounded-full transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Overall Score */}
                {overallScore !== undefined && (
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between">
                        <span className="text-white font-bold">Overall Score</span>
                        <span className="text-2xl font-bold text-amber-400">{overallScore}/10</span>
                    </div>
                )}
            </div>
        </div>
    );
}
