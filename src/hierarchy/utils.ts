import { groupBy, keyBy } from 'lodash';
import {
    AnyHierarchyPureNode,
    HierarchyBranchIndices,
    HierarchyEntity,
    HierarchyEntityNode,
    HierarchyFolderNode,
    HierarchyNode,
    HierarchyNodeTypes,
    HierarchyPureDictionary,
    HierarchyPureEntityNode,
    HierarchyPureFolderNode,
    HierarchyPureNode,
    HierarchyPureStructure,
    HierarchyState,
    HierarchyStructure,
} from './types';

export const getEntitiesMap = <T>(
    entities?: HierarchyEntity<T>[],
): Record<string, HierarchyEntity<T>> => {
    if (!entities) { return {}; }
    return keyBy<HierarchyEntity<T>>(entities, 'id');
};

export const getVisibleNodes = (
    nodes: HierarchyNode[],
    state: HierarchyState,
): HierarchyNode[] => filterNodes(nodes, (node: HierarchyNode) => {
    const isFolder = node.type === HierarchyNodeTypes.Folder;
    const toggle = getNodeState(node, state);
    const isCollapsed = toggle !== true;
    return !isFolder || !isCollapsed;
});

/**
 * It filters nodes array with predicate
 * in cutting iteration it should increment index only when not excludeSelf
 */
export const filterNodes = (
    nodes: HierarchyNode[],
    predicate: (node: HierarchyNode) => boolean,
    excludeSelf?: boolean,
): HierarchyNode[] => {
    let toggleNodes = nodes;
    let i = 0;
    while (i < toggleNodes.length) {
        const node = toggleNodes[i];
        const isValid = predicate(node);
        if (!isValid) {
            toggleNodes = filterBranch(toggleNodes, node, excludeSelf);
        }
        if (isValid || !excludeSelf) {
            i++;
        }
    }
    return toggleNodes;
};

export const getNodeState = (
    node: HierarchyNode,
    state: HierarchyState,
): boolean | undefined => state?.[node.id]?.toggle;

/**
 * It cuts all children till the deep from nodes array
 * in case excludeSelf it cuts current node too
 */
export const filterBranch = (
    nodes: HierarchyNode[],
    node: HierarchyNode,
    excludeSelf?: boolean,
) => {
    const indices = getBranchIndices(nodes, node.id);
    return filterBranchByIndices(nodes, indices, excludeSelf);
};

export const filterBranchByIndices = (
    nodes: HierarchyNode[],
    indices: HierarchyBranchIndices,
    excludeSelf?: boolean,
) => {
    const { endIndex } = indices;
    const startIndex = excludeSelf
        ? indices.startIndex
        : indices.startIndex + 1;
    const before = nodes.slice(0, startIndex);
    const after = nodes.slice(endIndex + 1);
    return before.concat(after);
};

// it returns slice (start and end indices) of children nodes by nodeId including itself
export const getBranchIndices = (
    nodes: HierarchyNode[],
    nodeId: string,
): HierarchyBranchIndices => {
    const startIndex = nodes.findIndex((node) => node.id === nodeId);
    return getBranchIndicesByStartIndex(nodes, startIndex);
};

export const getBranchIndicesByStartIndex = (
    nodes: HierarchyNode[],
    startIndex: number,
): HierarchyBranchIndices => {
    const node = nodes[startIndex];
    // in case when nodeId is root.id
    if (!node) { return { startIndex: 0, endIndex: nodes.length - 1 }; }
    for (let i = startIndex; i < nodes.length; i++) {
        const nextNode = nodes[i + 1];
        if (!nextNode || nextNode.level <= node.level) {
            return { startIndex, endIndex: i };
        }
    }
};

export const getEntityFromMap = <T>(
    node: HierarchyNode,
    entitiesMap: Record<string, HierarchyEntity<T>>,
): HierarchyEntity<T> | undefined => {
    if (node.type === HierarchyNodeTypes.Folder) { return; }
    const { entityId } = node as HierarchyEntityNode;
    return entitiesMap[entityId];
};

export const getGroupedNodesByParent = (
    dictionary: HierarchyPureDictionary,
): Record<string, HierarchyPureNode[]> => groupBy(Object.values(dictionary), 'parentId');

export const splitNodes = (nodes: AnyHierarchyPureNode[]) => {
    const folders: HierarchyPureNode[] = [];
    const entities: HierarchyPureEntityNode[] = [];
    for (const node of nodes) {
        const target = node.type === HierarchyNodeTypes.Folder
            ? folders
            : entities;
        target.push(node);
    }
    return { folders, entities };
};

export const convertDictionaryToNodes = (
    nodes: AnyHierarchyPureNode[],
    groupedByParent: Record<string, HierarchyPureNode[]>,
    parentsToRoot: HierarchyFolderNode[],
    level: number = -1,
): HierarchyNode[] => {
    return nodes.reduce((memo, node) => {
        const children = groupedByParent[node.id] ?? [];
        const { folders, entities } = splitNodes(children);
        folders.push(...entities);
        const nextParents = parentsToRoot.concat(node as HierarchyFolderNode);
        const nestedNodes = convertDictionaryToNodes(
            folders,
            groupedByParent,
            nextParents,
            level + 1,
        );
        const foldersCount = folders.length;
        const entitiesCount = entities.length;
        const denormalizedNode: HierarchyNode = {
            ...node,
            level,
            parentsToRoot,
            parents: [],
            foldersCount,
            entitiesCount,
        };
        memo.push(denormalizedNode, ...nestedNodes);
        return memo;
    }, []);
};

export const setParentsToNodes = (
    nodes: HierarchyNode[],
): HierarchyNode[] => {
    const dictionary = keyBy<HierarchyNode>(nodes, 'id');
    const register = nodes.reduce((memo, node) => {
        if (node.type === HierarchyNodeTypes.Entity) {
            const parent = dictionary[node.parentId] as HierarchyFolderNode;
            if (!parent) { return memo; }
            const { entityId } = node as HierarchyEntityNode;
            const parents = memo[entityId] ?? [];
            parents.push(parent);
            memo[entityId] = parents;
        }
        return memo;
    }, {} as Record<string, HierarchyFolderNode[]>);

    return nodes.map((node) => {
        if (node.type === HierarchyNodeTypes.Folder) { return node; }
        const { entityId } = node as HierarchyEntityNode;
        const parents = register[entityId];
        return { ...node, parents };
    });
};



export const denormalizeStructure = (
    pureStructure: HierarchyPureStructure,
): HierarchyStructure => {
    const { rootId, dictionary } = pureStructure;
    if (!rootId || !dictionary) { return; }
    const rootFromDict = dictionary[rootId];
    const groupedByParent = getGroupedNodesByParent(dictionary);
    const nodesWithRoot = convertDictionaryToNodes([rootFromDict], groupedByParent, []);
    const [root, ...nodesWithoutRoot] = nodesWithRoot;
    const nodes = setParentsToNodes(nodesWithoutRoot);
    return { root, nodes };
}
