'use client';

import { useState } from 'react';

interface PrincipleFlowProps {
    principles: string[];
    title?: string;
}

/**
 * Visual step-by-step flow diagram for sequential principles
 * Shows principles as connected steps with animated arrows
 */
export function PrincipleFlow({ principles, title = "Framework Steps" }: PrincipleFlowProps) {
    const [activeStep, setActiveStep] = useState<number | null>(null);

    const gradients = [
        'from-violet-500 to-purple-600',
        'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-500',
        'from-amber-500 to-orange-500',
        'from-pink-500 to-rose-500',
        'from-indigo-500 to-blue-500',
    ];

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">⚡</span> {title}
                </h3>
            )}

            {/* Desktop: Horizontal Flow */}
            <div className="hidden lg:flex items-start justify-between gap-2 relative">
                {principles.map((principle, index) => {
                    // Extract step number and text
                    const stepMatch = principle.match(/^(?:Step\s*)?(\d+)[:.]\s*(.+)$/i);
                    const stepNum = stepMatch ? stepMatch[1] : String(index + 1);
                    const stepText = stepMatch ? stepMatch[2] : principle;

                    return (
                        <div key={index} className="flex items-start flex-1">
                            {/* Step Card */}
                            <div
                                className={`
                                    relative flex-1 group cursor-pointer
                                    transition-all duration-300 ease-out
                                    ${activeStep === index ? 'scale-105 z-10' : 'hover:scale-102'}
                                `}
                                onMouseEnter={() => setActiveStep(index)}
                                onMouseLeave={() => setActiveStep(null)}
                            >
                                {/* Gradient Background */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}
                                    rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity
                                `} />

                                {/* Card Content */}
                                <div className="relative bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-lg group-hover:shadow-xl transition-shadow">
                                    {/* Step Number Badge */}
                                    <div className={`
                                        absolute -top-3 left-4 px-3 py-1 rounded-full text-white text-sm font-bold
                                        bg-gradient-to-r ${gradients[index % gradients.length]}
                                        shadow-lg
                                    `}>
                                        {stepNum}
                                    </div>

                                    {/* Step Text */}
                                    <p className="mt-4 text-gray-700 text-sm leading-relaxed font-medium">
                                        {stepText}
                                    </p>
                                </div>
                            </div>

                            {/* Arrow Connector */}
                            {index < principles.length - 1 && (
                                <div className="flex items-center px-2 pt-8">
                                    <div className={`
                                        w-8 h-0.5 bg-gradient-to-r ${gradients[index % gradients.length]}
                                        relative
                                    `}>
                                        <div className={`
                                            absolute right-0 top-1/2 -translate-y-1/2
                                            w-0 h-0 border-l-[8px] border-l-current
                                            border-y-[5px] border-y-transparent
                                            text-${gradients[index % gradients.length].split('-')[1]}
                                        `}
                                            style={{
                                                borderLeftColor: index % 2 === 0 ? '#8b5cf6' : '#06b6d4'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile: Vertical Flow */}
            <div className="lg:hidden space-y-4">
                {principles.map((principle, index) => {
                    const stepMatch = principle.match(/^(?:Step\s*)?(\d+)[:.]\s*(.+)$/i);
                    const stepNum = stepMatch ? stepMatch[1] : String(index + 1);
                    const stepText = stepMatch ? stepMatch[2] : principle;

                    return (
                        <div key={index} className="relative">
                            {/* Vertical Line */}
                            {index < principles.length - 1 && (
                                <div className={`
                                    absolute left-6 top-14 w-0.5 h-8
                                    bg-gradient-to-b ${gradients[index % gradients.length]}
                                `} />
                            )}

                            <div className="flex gap-4">
                                {/* Step Number */}
                                <div className={`
                                    flex-shrink-0 w-12 h-12 rounded-xl
                                    bg-gradient-to-br ${gradients[index % gradients.length]}
                                    flex items-center justify-center
                                    text-white text-lg font-bold shadow-lg
                                `}>
                                    {stepNum}
                                </div>

                                {/* Content */}
                                <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100 shadow-md">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {stepText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
