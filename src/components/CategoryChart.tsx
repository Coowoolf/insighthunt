'use client';

import { useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts';
import { CATEGORY_INFO, Category } from '@/types';
import { getStats } from '@/data/insights';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryChartProps {
    type?: 'pie' | 'bar';
    className?: string;
    showLegend?: boolean;
}

// Dopamine Geek Style colors
const COLORS = [
    '#8B5CF6', // Violet (product-strategy)
    '#F97316', // Orange (execution)
    '#EC4899', // Pink (career-leadership)
    '#06B6D4', // Cyan (team-culture)
    '#10B981', // Emerald (growth-metrics)
    '#6366F1', // Indigo (user-research)
];

export function CategoryChart({
    type = 'pie',
    className = '',
    showLegend = true
}: CategoryChartProps) {
    const stats = getStats();
    const { t, language } = useLanguage();

    const chartData = useMemo(() => {
        const entries = Object.entries(stats.categories) as [Category, number][];
        return entries.map(([category, count], index) => ({
            name: language === 'zh' ? CATEGORY_INFO[category].label_zh : CATEGORY_INFO[category].label,
            value: count,
            emoji: CATEGORY_INFO[category].emoji,
            color: COLORS[index % COLORS.length],
            category,
        })).sort((a, b) => b.value - a.value);
    }, [stats, language]);

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const percentage = ((data.value / total) * 100).toFixed(1);
            return (
                <div className="clay-card !p-3 !shadow-lg">
                    <p className="font-semibold flex items-center gap-2">
                        <span>{data.emoji}</span>
                        <span>{data.name}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        {data.value} {t('methodologies', '个方法论')} ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    if (type === 'bar') {
        return (
            <div className={`w-full h-80 ${className}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            width={90}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="value"
                            radius={[0, 8, 8, 0]}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    // Pie chart (default) - Vertical layout: pie on top, legend below
    return (
        <div className={`w-full h-full flex flex-col ${className}`}>
            {/* Larger Pie Chart */}
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius="40%"
                            outerRadius="75%"
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke="white"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend - Below pie chart in 3 columns */}
            {showLegend && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                    {chartData.map((item) => (
                        <div
                            key={item.category}
                            className="flex items-center gap-2 px-2 py-1.5 bg-white/60 rounded-lg"
                        >
                            <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs">{item.emoji}</span>
                            <span className="text-xs text-gray-700 truncate">{item.name}</span>
                            <span className="text-xs font-bold text-gray-900 ml-auto">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Total */}
            <div className="text-center mt-4 text-sm text-gray-600">
                {t('Total', '共')} <span className="font-bold gradient-text">{total}</span> {t('methodologies', '个方法论')}
            </div>
        </div>
    );
}
