'use client';

interface ChecklistItem {
    text: string;
    checked?: boolean;
}

interface ChecklistProps {
    title?: string;
    items: ChecklistItem[];
}

/**
 * Checklist component for verification frameworks
 * Great for: Launch checklists, Due diligence, Quality gates
 */
export function Checklist({ title = "Verification Checklist", items }: ChecklistProps) {
    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">✔️</span> {title}
                </h3>
            )}

            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
                <ul className="space-y-3">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`
                                flex items-center gap-4 p-3 rounded-xl transition-all
                                ${item.checked
                                    ? 'bg-emerald-50 border border-emerald-200'
                                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                }
                            `}
                        >
                            <div className={`
                                w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                                ${item.checked
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white border-2 border-gray-300'
                                }
                            `}>
                                {item.checked && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={`
                                text-sm font-medium
                                ${item.checked ? 'text-gray-700' : 'text-gray-600'}
                            `}>
                                {item.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
