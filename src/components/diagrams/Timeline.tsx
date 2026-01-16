'use client';

interface TimelineEvent {
    phase: string;
    title: string;
    description?: string;
}

interface TimelineProps {
    title?: string;
    events: TimelineEvent[];
}

/**
 * Horizontal timeline for phase-based frameworks
 * Great for: Product lifecycle, Career stages, Evolution of strategy
 */
export function Timeline({ title = "Journey Timeline", events }: TimelineProps) {
    const gradients = [
        'from-violet-500 to-purple-600',
        'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-500',
        'from-amber-500 to-orange-500',
        'from-pink-500 to-rose-500',
    ];

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <span className="text-2xl">📅</span> {title}
                </h3>
            )}

            <div className="relative">
                {/* Horizontal Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-violet-200 via-blue-200 to-emerald-200 rounded-full" />

                {/* Events */}
                <div className="flex justify-between relative">
                    {events.map((event, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                            {/* Dot */}
                            <div className={`
                                w-12 h-12 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]}
                                flex items-center justify-center text-white font-bold shadow-lg z-10
                                transform hover:scale-110 transition-transform cursor-pointer
                            `}>
                                {event.phase || index + 1}
                            </div>

                            {/* Content */}
                            <div className="mt-4 text-center px-2">
                                <h4 className="font-bold text-gray-800 text-sm mb-1">{event.title}</h4>
                                {event.description && (
                                    <p className="text-xs text-gray-500 leading-relaxed">{event.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
