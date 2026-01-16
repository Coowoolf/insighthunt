// Dynamic Visualization Component Library
// 15+ component types for AI-driven selection

// Sequential / Process
export { PrincipleFlow } from './PrincipleFlow';
export { Timeline } from './Timeline';
export { Funnel } from './Funnel';
export { Cycle } from './Cycle';

// Comparative / Evaluative
export { FrameworkMatrix, PrioritizationMatrix } from './FrameworkMatrix';
export { ComparisonCard, WhenToUseCard } from './ComparisonCard';
export { Spectrum } from './Spectrum';
export { BeforeAfter } from './BeforeAfter';

// Hierarchical / Structural
export { MindMap } from './MindMap';
export { TreeDiagram } from './TreeDiagram';
export { Pyramid } from './Pyramid';
export { Onion } from './Onion';

// Formula / Evaluation
export { Equation } from './Equation';
export { Checklist } from './Checklist';
export { Scorecard } from './Scorecard';

// Narrative
export { CaseStudy } from './CaseStudy';

// Component type mapping for dynamic rendering
export const VISUALIZATION_COMPONENTS = {
    // Sequential
    'StepFlow': 'PrincipleFlow',
    'Timeline': 'Timeline',
    'Funnel': 'Funnel',
    'Cycle': 'Cycle',

    // Comparative
    'Matrix2x2': 'FrameworkMatrix',
    'DosDonts': 'ComparisonCard',
    'Spectrum': 'Spectrum',
    'BeforeAfter': 'BeforeAfter',

    // Hierarchical
    'MindMap': 'MindMap',
    'TreeDiagram': 'TreeDiagram',
    'Pyramid': 'Pyramid',
    'Onion': 'Onion',

    // Formula
    'Equation': 'Equation',
    'Checklist': 'Checklist',
    'Scorecard': 'Scorecard',

    // Narrative
    'CaseStudy': 'CaseStudy',
} as const;

export type VisualizationType = keyof typeof VISUALIZATION_COMPONENTS;
