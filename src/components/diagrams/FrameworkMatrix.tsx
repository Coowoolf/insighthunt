'use client';

import { useState } from 'react';

interface MatrixCell {
    label: string;
    description?: string;
    color: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
}

interface FrameworkMatrixProps {
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    xLabels: [string, string];  // [low, high]
    yLabels: [string, string];  // [low, high]
    cells: [[MatrixCell, MatrixCell], [MatrixCell, MatrixCell]];  // 2x2 matrix
}

const colorMap: Record<string, string> = {
    green: 'from-emerald-400 to-green-500',
    blue: 'from-blue-400 to-cyan-500',
    yellow: 'from-amber-400 to-yellow-500',
    red: 'from-red-400 to-rose-500',
    purple: 'from-violet-400 to-purple-500',
};

const bgColorMap: Record<string, string> = {
    green: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    yellow: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    red: 'bg-red-50 border-red-200 hover:bg-red-100',
    purple: 'bg-violet-50 border-violet-200 hover:bg-violet-100',
};

const getColor = (color?: string) => colorMap[color || 'blue'] || colorMap.blue;
const getBgColor = (color?: string) => bgColorMap[color || 'blue'] || bgColorMap.blue;

/**
 * 2x2 Framework Matrix visualization
 * Perfect for prioritization matrices, effort/impact grids, etc.
 */
export function FrameworkMatrix({
    title = "Framework Matrix",
    xAxisLabel = "X Axis",
    yAxisLabel = "Y Axis",
    xLabels,
    yLabels,
    cells
}: FrameworkMatrixProps) {
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">📊</span> {title}
                </h3>
            )}

            <div className="flex gap-4">
                {/* Y-Axis Label */}
                <div className="flex flex-col justify-center items-center w-8">
                    <div
                        className="transform -rotate-90 whitespace-nowrap text-sm font-bold text-gray-600 uppercase tracking-wider"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                    >
                        {yAxisLabel}
                    </div>
                </div>

                <div className="flex-1">
                    {/* Y-Axis High/Low Labels */}
                    <div className="flex flex-col h-full">
                        <div className="flex-1 flex flex-col">
                            {/* Top Row (High Y) */}
                            <div className="flex items-center mb-2">
                                <div className="w-16 text-xs font-semibold text-gray-500 text-right pr-3">
                                    {yLabels[1]}
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    {[cells[0][0], cells[0][1]].map((cell, i) => (
                                        <div
                                            key={`top-${i}`}
                                            className={`
                                                relative rounded-xl p-5 border-2 cursor-pointer
                                                transition-all duration-300 ease-out
                                                ${getBgColor(cell?.color)}
                                                ${hoveredCell === `top-${i}` ? 'scale-105 shadow-xl z-10' : 'shadow-lg'}
                                            `}
                                            onMouseEnter={() => setHoveredCell(`top-${i}`)}
                                            onMouseLeave={() => setHoveredCell(null)}
                                        >
                                            {/* Gradient Accent */}
                                            <div className={`
                                                absolute top-0 left-0 right-0 h-1 rounded-t-xl
                                                bg-gradient-to-r ${getColor(cell?.color)}
                                            `} />

                                            <div className="text-center">
                                                <h4 className="font-bold text-gray-800 text-lg mb-2">
                                                    {cell.label}
                                                </h4>
                                                {cell.description && (
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {cell.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Row (Low Y) */}
                            <div className="flex items-center mt-3">
                                <div className="w-16 text-xs font-semibold text-gray-500 text-right pr-3">
                                    {yLabels[0]}
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    {[cells[1][0], cells[1][1]].map((cell, i) => (
                                        <div
                                            key={`bottom-${i}`}
                                            className={`
                                                relative rounded-xl p-5 border-2 cursor-pointer
                                                transition-all duration-300 ease-out
                                                ${getBgColor(cell?.color)}
                                                ${hoveredCell === `bottom-${i}` ? 'scale-105 shadow-xl z-10' : 'shadow-lg'}
                                            `}
                                            onMouseEnter={() => setHoveredCell(`bottom-${i}`)}
                                            onMouseLeave={() => setHoveredCell(null)}
                                        >
                                            {/* Gradient Accent */}
                                            <div className={`
                                                absolute top-0 left-0 right-0 h-1 rounded-t-xl
                                                bg-gradient-to-r ${getColor(cell?.color)}
                                            `} />

                                            <div className="text-center">
                                                <h4 className="font-bold text-gray-800 text-lg mb-2">
                                                    {cell.label}
                                                </h4>
                                                {cell.description && (
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {cell.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* X-Axis Labels */}
                        <div className="flex mt-4">
                            <div className="w-16" />
                            <div className="flex-1 grid grid-cols-2 gap-3">
                                <div className="text-center text-xs font-semibold text-gray-500">
                                    {xLabels[0]}
                                </div>
                                <div className="text-center text-xs font-semibold text-gray-500">
                                    {xLabels[1]}
                                </div>
                            </div>
                        </div>

                        {/* X-Axis Label */}
                        <div className="text-center mt-2">
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                                {xAxisLabel}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Helper to create a prioritization matrix (Impact vs Effort)
 */
export function PrioritizationMatrix() {
    return (
        <FrameworkMatrix
            title="Prioritization Matrix"
            xAxisLabel="Effort"
            yAxisLabel="Impact"
            xLabels={["Low Effort", "High Effort"]}
            yLabels={["Low Impact", "High Impact"]}
            cells={[
                [
                    { label: "Quick Wins", description: "Do these first", color: "green" },
                    { label: "Major Projects", description: "Plan carefully", color: "blue" }
                ],
                [
                    { label: "Fill-Ins", description: "If time permits", color: "yellow" },
                    { label: "Time Sinks", description: "Avoid these", color: "red" }
                ]
            ]}
        />
    );
}
