import { HierarchyColumnConfig, HierarchyViews } from './Hierarchy.types';
import { HierarchyEntity, HierarchyNode, HierarchyState, HierarchyStructure } from './types';
import { VIEW_TO_HIERARCHY_NODE_TYPE_MAP } from './Hierarchy.constants';
import { getEntityFromMap, getVisibleNodes as getVisibleNodesUtil } from './utils';

export const getNodes = <T>(
    structure: HierarchyStructure | undefined,
    view: HierarchyViews,
) => {
    const nodes = structure?.nodes;
    if (!structure || !nodes) return;
    const nodesByView = getNodesByView(nodes, view);
    return [structure.root].concat(nodesByView);
};

const getNodesByView = (
    nodes: HierarchyNode[],
    view: HierarchyViews,
): HierarchyNode[] => {
    if (view === HierarchyViews.Both) return nodes;
    const type = VIEW_TO_HIERARCHY_NODE_TYPE_MAP[view];
    return nodes.filter((node) => node.type === type);
};

export const getVisibleNodes = (
    nodes: HierarchyNode[],
    view: HierarchyViews,
    state?: HierarchyState,
): HierarchyNode[] => {
    if (!nodes) return;
    if (isFlatView(view)) return nodes;
    return getVisibleNodesUtil(nodes, state);
};

const isFlatView = (view: HierarchyViews): boolean => {
    return view === HierarchyViews.OnlyEntities || view === HierarchyViews.FlatFolders;
};

export const getEntity = <T>(
    node: HierarchyNode | undefined,
    view: HierarchyViews,
    entitiesMap: Record<string, HierarchyEntity<T>>,
): HierarchyEntity<T> | undefined => {
    if (!node) return;
    return getEntityFromMap(node, entitiesMap);
}

export const getColumnStyles = (
    column: HierarchyColumnConfig,
): any => {
    const { width } = column;
    if (width === undefined) return;
    const widthString = `${width}px`;
    const flexGrow = 0;
    const flexShrink = 1;
    const flexBasis = `calc(${widthString})`;
    return { flexGrow, flexShrink, flexBasis };
};
