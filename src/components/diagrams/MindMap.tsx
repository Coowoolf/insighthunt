'use client';

import { useState } from 'react';

interface MindMapNode {
    text: string;
    emoji?: string;
}

interface MindMapProps {
    centerText: string;
    centerEmoji?: string;
    nodes: MindMapNode[];
    title?: string;
}

const gradients = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
];

const bgColors = [
    'bg-violet-50 border-violet-200',
    'bg-blue-50 border-blue-200',
    'bg-emerald-50 border-emerald-200',
    'bg-amber-50 border-amber-200',
    'bg-pink-50 border-pink-200',
    'bg-indigo-50 border-indigo-200',
];

/**
 * Radial Mind Map visualization
 * Central concept with branching nodes
 */
export function MindMap({ centerText, centerEmoji = "💡", nodes, title }: MindMapProps) {
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🧠</span> {title}
                </h3>
            )}

            <div className="relative py-8">
                {/* Center Node */}
                <div className="flex justify-center mb-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-start to-brand-end rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                        <div className="relative bg-gradient-to-br from-brand-start to-brand-end rounded-2xl px-8 py-6 text-white shadow-xl">
                            <div className="text-4xl text-center mb-2">{centerEmoji}</div>
                            <div className="text-lg font-bold text-center max-w-[200px]">
                                {centerText}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Connecting Lines (SVG) */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ top: '80px', height: 'calc(100% - 80px)' }}
                >
                    {nodes.map((_, index) => {
                        const totalNodes = nodes.length;
                        const xOffset = ((index + 0.5) / totalNodes) * 100;
                        return (
                            <line
                                key={index}
                                x1="50%"
                                y1="0"
                                x2={`${xOffset}%`}
                                y2="60"
                                stroke={hoveredNode === index ? '#8b5cf6' : '#e5e7eb'}
                                strokeWidth={hoveredNode === index ? 3 : 2}
                                strokeDasharray={hoveredNode === index ? "0" : "5,5"}
                                className="transition-all duration-300"
                            />
                        );
                    })}
                </svg>

                {/* Branch Nodes */}
                <div className="flex justify-center gap-4 flex-wrap mt-16 relative z-10">
                    {nodes.map((node, index) => (
                        <div
                            key={index}
                            className={`
                                relative cursor-pointer transition-all duration-300 ease-out
                                ${hoveredNode === index ? 'scale-110 z-20' : 'hover:scale-105'}
                            `}
                            onMouseEnter={() => setHoveredNode(index)}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            {/* Glow Effect */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}
                                rounded-xl blur-lg opacity-0 transition-opacity duration-300
                                ${hoveredNode === index ? 'opacity-30' : ''}
                            `} />

                            {/* Node Card */}
                            <div className={`
                                relative rounded-xl px-5 py-4 border-2 shadow-lg
                                ${bgColors[index % bgColors.length]}
                                ${hoveredNode === index ? 'shadow-xl' : ''}
                                min-w-[140px] max-w-[180px]
                            `}>
                                {/* Top Badge */}
                                <div className={`
                                    absolute -top-3 left-1/2 -translate-x-1/2
                                    w-8 h-8 rounded-full flex items-center justify-center
                                    bg-gradient-to-br ${gradients[index % gradients.length]}
                                    text-white text-sm shadow-md
                                `}>
                                    {node.emoji || (index + 1)}
                                </div>

                                <div className="mt-3 text-center">
                                    <p className="text-gray-800 font-medium text-sm leading-snug">
                                        {node.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
