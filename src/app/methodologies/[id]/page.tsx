import { getAllMethodologies, getMethodologyById } from '@/data/insights';
import { CATEGORY_INFO, VisualizationType } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Import all visualization components
import { PrincipleFlow } from '@/components/diagrams/PrincipleFlow';
import { Timeline } from '@/components/diagrams/Timeline';
import { Funnel } from '@/components/diagrams/Funnel';
import { Cycle } from '@/components/diagrams/Cycle';
import { FrameworkMatrix } from '@/components/diagrams/FrameworkMatrix';
import { ComparisonCard, WhenToUseCard } from '@/components/diagrams/ComparisonCard';
import { Spectrum } from '@/components/diagrams/Spectrum';
import { BeforeAfter } from '@/components/diagrams/BeforeAfter';
import { MindMap } from '@/components/diagrams/MindMap';
import { TreeDiagram } from '@/components/diagrams/TreeDiagram';
import { Pyramid } from '@/components/diagrams/Pyramid';
import { Onion } from '@/components/diagrams/Onion';
import { Equation } from '@/components/diagrams/Equation';
import { Checklist } from '@/components/diagrams/Checklist';
import { Scorecard } from '@/components/diagrams/Scorecard';
import { CaseStudy } from '@/components/diagrams/CaseStudy';

// Generate static paths for all methodologies
export async function generateStaticParams() {
    const methodologies = getAllMethodologies();
    return methodologies.map((m) => ({
        id: m.id,
    }));
}

interface Props {
    params: Promise<{ id: string }>;
}

// Dynamic visualization renderer
function DynamicVisualization({
    type,
    data,
    principles,
    methodologyName
}: {
    type?: VisualizationType;
    data?: Record<string, any>;
    principles: string[];
    methodologyName: string;
}) {
    // Parse principles for display
    const parsedPrinciples = principles.map(p => {
        const match = p.match(/^(?:Step\s*)?(\d+)[:.]\s*(.+)$/i);
        return match ? match[2] : p;
    });

    switch (type) {
        case 'StepFlow':
            return (
                <PrincipleFlow
                    principles={principles}
                    title="Step-by-Step Framework"
                />
            );

        case 'Timeline':
            return (
                <Timeline
                    title="Framework Timeline"
                    events={data?.events || parsedPrinciples.map((p, i) => ({
                        phase: String(i + 1),
                        title: p.length > 40 ? p.substring(0, 37) + '...' : p,
                    }))}
                />
            );

        case 'Funnel':
            return (
                <Funnel
                    title="Framework Funnel"
                    stages={data?.stages || parsedPrinciples.map(p => ({
                        label: p.length > 30 ? p.substring(0, 27) + '...' : p,
                    }))}
                />
            );

        case 'Cycle':
            return (
                <Cycle
                    title="Iterative Cycle"
                    centerLabel={data?.centerLabel || "Core"}
                    steps={data?.steps || parsedPrinciples.map(p => ({
                        label: p.length > 20 ? p.substring(0, 17) + '...' : p,
                    }))}
                />
            );

        case 'Matrix2x2':
            // Transform flat quadrants array to 2x2 cells format
            const colors = ['green', 'blue', 'yellow', 'red'] as const;
            if (data?.quadrants && Array.isArray(data.quadrants)) {
                // AI returns flat array of 4 objects - transform to 2x2
                const flatQuadrants = data.quadrants as any[];
                const transformedCells: [[any, any], [any, any]] = [
                    [
                        {
                            label: flatQuadrants[0]?.label || parsedPrinciples[0]?.substring(0, 20) || 'Q1',
                            description: flatQuadrants[0]?.description,
                            color: colors[0]
                        },
                        {
                            label: flatQuadrants[1]?.label || parsedPrinciples[1]?.substring(0, 20) || 'Q2',
                            description: flatQuadrants[1]?.description,
                            color: colors[1]
                        }
                    ],
                    [
                        {
                            label: flatQuadrants[3]?.label || parsedPrinciples[3]?.substring(0, 20) || 'Q4',
                            description: flatQuadrants[3]?.description,
                            color: colors[3]
                        },
                        {
                            label: flatQuadrants[2]?.label || parsedPrinciples[2]?.substring(0, 20) || 'Q3',
                            description: flatQuadrants[2]?.description,
                            color: colors[2]
                        }
                    ]
                ];
                return (
                    <FrameworkMatrix
                        title={data.title || "Decision Matrix"}
                        xAxisLabel={data.xAxis || "X Axis"}
                        yAxisLabel={data.yAxis || "Y Axis"}
                        xLabels={data.xLabels || ["Low", "High"]}
                        yLabels={data.yLabels || ["High", "Low"]}
                        cells={transformedCells}
                    />
                );
            }
            // Fallback: generate from principles
            return (
                <FrameworkMatrix
                    title="Decision Matrix"
                    xAxisLabel="Effort"
                    yAxisLabel="Impact"
                    xLabels={["Low Effort", "High Effort"]}
                    yLabels={["High Impact", "Low Impact"]}
                    cells={[
                        [
                            { label: parsedPrinciples[0]?.substring(0, 15) || "Quick Wins", color: "green" as const },
                            { label: parsedPrinciples[1]?.substring(0, 15) || "Major Projects", color: "blue" as const }
                        ],
                        [
                            { label: parsedPrinciples[2]?.substring(0, 15) || "Fill-Ins", color: "yellow" as const },
                            { label: parsedPrinciples[3]?.substring(0, 15) || "Avoid", color: "red" as const }
                        ]
                    ]}
                />
            );

        case 'DosDonts':
            return (
                <ComparisonCard
                    title="Best Practices"
                    doItems={data?.dos || parsedPrinciples.slice(0, 3).map(p => ({ text: p }))}
                    dontItems={data?.donts || parsedPrinciples.slice(3, 6).map(p => ({ text: p }))}
                />
            );

        case 'Spectrum':
            return (
                <Spectrum
                    title="Framework Spectrum"
                    leftLabel={data?.leftLabel || parsedPrinciples[0]?.substring(0, 15) || "Conservative"}
                    rightLabel={data?.rightLabel || parsedPrinciples[parsedPrinciples.length - 1]?.substring(0, 15) || "Aggressive"}
                    highlightPosition={data?.highlightPosition || 50}
                />
            );

        case 'BeforeAfter':
            const midpoint = Math.ceil(parsedPrinciples.length / 2);
            return (
                <BeforeAfter
                    title="Transformation"
                    before={{
                        title: data?.before?.title || "Before",
                        points: data?.before?.points || parsedPrinciples.slice(0, midpoint)
                    }}
                    after={{
                        title: data?.after?.title || "After",
                        points: data?.after?.points || parsedPrinciples.slice(midpoint)
                    }}
                />
            );

        case 'MindMap':
            return (
                <MindMap
                    title="Framework Structure"
                    centerText={methodologyName.length > 25 ? methodologyName.substring(0, 22) + '...' : methodologyName}
                    centerEmoji="💡"
                    nodes={parsedPrinciples.slice(0, 5).map((text, i) => ({
                        text: text.length > 40 ? text.substring(0, 37) + '...' : text,
                        emoji: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][i]
                    }))}
                />
            );

        case 'TreeDiagram':
            return (
                <TreeDiagram
                    title="Framework Hierarchy"
                    root={{
                        label: methodologyName.length > 20 ? methodologyName.substring(0, 17) + '...' : methodologyName,
                        children: parsedPrinciples.slice(0, 4).map(p => ({
                            label: p.length > 25 ? p.substring(0, 22) + '...' : p
                        }))
                    }}
                />
            );

        case 'Pyramid':
            return (
                <Pyramid
                    title="Priority Pyramid"
                    levels={data?.levels || parsedPrinciples.slice(0, 4).map(p => ({
                        label: p.length > 30 ? p.substring(0, 27) + '...' : p
                    }))}
                />
            );

        case 'Onion':
            return (
                <Onion
                    title="Layer Model"
                    core={data?.core || methodologyName.substring(0, 15)}
                    layers={data?.layers || parsedPrinciples.slice(0, 4).map(p => ({
                        label: p.length > 20 ? p.substring(0, 17) + '...' : p
                    }))}
                />
            );

        case 'Equation':
            return (
                <Equation
                    title="Success Formula"
                    result={data?.result || "Success"}
                    operator={data?.operator || "×"}
                    terms={data?.terms || parsedPrinciples.slice(0, 3).map(p => ({
                        label: p.length > 15 ? p.substring(0, 12) + '...' : p
                    }))}
                />
            );

        case 'Checklist':
            return (
                <Checklist
                    title="Verification Checklist"
                    items={data?.items || parsedPrinciples.map((p, i) => ({
                        text: p,
                        checked: i < 2 // First two checked as demo
                    }))}
                />
            );

        case 'Scorecard':
            return (
                <Scorecard
                    title="Evaluation Scorecard"
                    overallScore={data?.overallScore || 8}
                    metrics={data?.metrics || parsedPrinciples.slice(0, 4).map((p, i) => ({
                        label: p.length > 25 ? p.substring(0, 22) + '...' : p,
                        score: 7 + (i % 3)
                    }))}
                />
            );

        case 'CaseStudy':
            return (
                <CaseStudy
                    title="Real World Example"
                    company={data?.company || "Example Company"}
                    challenge={data?.challenge || parsedPrinciples[0] || "Challenge description"}
                    solution={data?.solution || parsedPrinciples[1] || "Solution description"}
                    result={data?.result || parsedPrinciples[2] || "Result description"}
                />
            );

        default:
            // Fallback to MindMap
            return (
                <MindMap
                    title="Framework Structure"
                    centerText={methodologyName.length > 25 ? methodologyName.substring(0, 22) + '...' : methodologyName}
                    centerEmoji="💡"
                    nodes={parsedPrinciples.slice(0, 5).map((text, i) => ({
                        text: text.length > 40 ? text.substring(0, 37) + '...' : text,
                        emoji: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][i]
                    }))}
                />
            );
    }
}

export default async function MethodologyPage({ params }: Props) {
    const { id } = await params;
    const methodology = getMethodologyById(id);

    if (!methodology) {
        notFound();
    }

    const categoryInfo = CATEGORY_INFO[methodology.category];
    const vizType = methodology.visualizationType;
    const vizTypeLabel = vizType || 'MindMap';

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <header className="header-glass sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-start to-brand-end flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl">💡</span>
                        </div>
                        <span className="text-xl font-bold gradient-text">InsightHunt</span>
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-brand-mid transition-colors"
                    >
                        ← Back to All Methodologies
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="category-badge">
                            {categoryInfo.emoji} {categoryInfo.label}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                            📊 {vizTypeLabel}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {methodology.name}
                    </h1>

                    <p className="text-lg text-gray-500 mb-6">
                        by <span className="font-semibold text-gray-700">{methodology.guestName}</span>
                        {methodology.guestTitle && <span> • {methodology.guestTitle}</span>}
                        {methodology.guestCompany && <span> at {methodology.guestCompany}</span>}
                    </p>

                    {methodology.guestBackground && (
                        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            {methodology.guestBackground}
                        </p>
                    )}
                </div>

                {/* Episode Context Card */}
                {methodology.episodeSummary && (
                    <div className="mb-12 bg-gradient-to-r from-brand-start/5 to-brand-end/5 rounded-2xl p-6 border border-brand-start/10">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                            <span>🎙️</span> Episode Context
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{methodology.episodeSummary}</p>
                    </div>
                )}

                {/* Problem It Solves */}
                {methodology.problemItSolves && (
                    <section className="mb-12">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-8">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl opacity-50" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl text-white">🎯</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Problem It Solves</h2>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {methodology.problemItSolves}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Overview Summary */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                            <span className="text-2xl text-white">📖</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Framework Overview</h2>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        {methodology.summary}
                    </p>
                </section>

                {/* DYNAMIC VISUALIZATION - The main visual based on visualizationType */}
                <section className="mb-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                    <DynamicVisualization
                        type={methodology.visualizationType}
                        data={methodology.visualizationData}
                        principles={methodology.principles}
                        methodologyName={methodology.name}
                    />
                </section>

                {/* When to Use & Common Mistakes */}
                {(methodology.whenToUse || methodology.commonMistakes) && (
                    <section className="mb-12">
                        <WhenToUseCard
                            whenToUse={methodology.whenToUse}
                            commonMistakes={methodology.commonMistakes}
                        />
                    </section>
                )}

                {/* Real World Example */}
                {methodology.realWorldExample && (
                    <section className="mb-12">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 p-8">
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-cyan-200 to-teal-200 rounded-full blur-3xl opacity-50" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl text-white">💼</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Real World Example</h2>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {methodology.realWorldExample}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Quote */}
                {methodology.quote && (
                    <section className="mb-12">
                        <div className="relative bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 rounded-2xl p-10 border border-purple-200 shadow-xl overflow-hidden">
                            <div className="absolute top-4 left-6 text-8xl text-purple-200 font-serif">"</div>
                            <div className="absolute bottom-4 right-6 text-8xl text-purple-200 font-serif rotate-180">"</div>
                            <div className="relative z-10">
                                <p className="text-2xl text-gray-800 italic leading-relaxed text-center px-8 mb-6">
                                    {methodology.quote}
                                </p>
                                <p className="text-center text-gray-600 font-semibold">
                                    — {methodology.guestName}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Tags */}
                <section className="mb-10">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                        {methodology.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Navigation */}
                <div className="border-t border-gray-200 pt-8 flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-brand-mid hover:text-brand-start transition-colors font-medium"
                    >
                        ← Back to All Methodologies
                    </Link>
                    <Link
                        href={`/guests/${methodology.guestId}`}
                        className="px-6 py-3 bg-gradient-to-r from-brand-start to-brand-mid text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        View {methodology.guestName}'s Profile →
                    </Link>
                </div>
            </main>
        </div>
    );
}
