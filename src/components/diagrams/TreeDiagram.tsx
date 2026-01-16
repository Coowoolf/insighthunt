'use client';

interface TreeNode {
    label: string;
    children?: TreeNode[];
}

interface TreeDiagramProps {
    title?: string;
    root: TreeNode;
}

/**
 * Recursive TreeDiagram component for hierarchical structures
 * Great for: Organization structures, Decision trees, Category breakdowns
 */
export function TreeDiagram({ title = "Structure Tree", root }: TreeDiagramProps) {
    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🌳</span> {title}
                </h3>
            )}

            <div className="flex justify-center">
                <TreeNodeComponent node={root} isRoot />
            </div>
        </div>
    );
}

function TreeNodeComponent({ node, isRoot = false }: { node: TreeNode; isRoot?: boolean }) {
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="flex flex-col items-center">
            {/* Node */}
            <div className={`
                px-4 py-2 rounded-xl font-medium shadow-lg
                ${isRoot
                    ? 'bg-gradient-to-br from-brand-start to-brand-end text-white text-lg'
                    : 'bg-white border-2 border-gray-200 text-gray-700 text-sm hover:border-brand-mid transition-colors'
                }
            `}>
                {node.label}
            </div>

            {/* Connector line */}
            {hasChildren && (
                <div className="w-0.5 h-6 bg-gray-300" />
            )}

            {/* Children */}
            {hasChildren && (
                <div className="flex gap-4 relative">
                    {/* Horizontal line */}
                    {node.children!.length > 1 && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-gray-300"
                            style={{ width: 'calc(100% - 40px)' }} />
                    )}

                    {node.children!.map((child, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {/* Vertical connector to horizontal line */}
                            <div className="w-0.5 h-4 bg-gray-300" />
                            <TreeNodeComponent node={child} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
