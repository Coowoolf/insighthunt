'use client';

interface OnionLayer {
    label: string;
    description?: string;
}

interface OnionProps {
    title?: string;
    core: string;
    layers: OnionLayer[]; // Inner to outer
}

/**
 * Onion/Layer diagram for depth-based frameworks
 * Great for: User journey layers, Architecture levels, Abstraction layers
 */
export function Onion({ title = "Layer Model", core, layers }: OnionProps) {
    const colors = [
        'bg-violet-100 border-violet-300',
        'bg-blue-100 border-blue-300',
        'bg-cyan-100 border-cyan-300',
        'bg-emerald-100 border-emerald-300',
        'bg-amber-100 border-amber-300',
    ];

    const reversedLayers = [...layers].reverse(); // Outer first for rendering

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <span className="text-2xl">🧅</span> {title}
                </h3>
            )}

            <div className="relative flex items-center justify-center" style={{ minHeight: '300px' }}>
                {/* Layers from outer to inner */}
                {reversedLayers.map((layer, index) => {
                    const size = 280 - (index * 50);
                    const colorIndex = reversedLayers.length - 1 - index;

                    return (
                        <div
                            key={index}
                            className={`
                                absolute rounded-full border-4 ${colors[colorIndex % colors.length]}
                                flex items-center justify-center
                                hover:scale-105 transition-transform
                            `}
                            style={{
                                width: size,
                                height: size,
                            }}
                        >
                            {index === reversedLayers.length - 1 && (
                                <span className="text-xs font-medium text-gray-600 text-center px-2 opacity-0 hover:opacity-100 transition-opacity absolute -top-6">
                                    {layer.label}
                                </span>
                            )}
                        </div>
                    );
                })}

                {/* Core */}
                <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-brand-start to-brand-end flex items-center justify-center text-white font-bold shadow-xl z-10 text-center text-xs px-2">
                    {core}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
                {layers.map((layer, index) => (
                    <div
                        key={index}
                        className={`
                            px-3 py-1 rounded-full text-xs font-medium border
                            ${colors[index % colors.length]}
                        `}
                    >
                        {layer.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
