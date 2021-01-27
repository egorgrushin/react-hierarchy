// normalized types:
export enum HierarchyNodeTypes {
    Folder = "Folder",
    Entity = "Entity"
}

export interface HierarchyPureNode {
    id: string;
    type: HierarchyNodeTypes;
    parentId?: string;
    name?: string;
    order?: number;
    virtual?: boolean;
}

export interface HierarchyPureEntityNode extends HierarchyPureNode {
    entityId: string;
}

export interface HierarchyPureFolderNode extends HierarchyPureNode {
    async?: boolean;
}
export type AnyHierarchyPureNode =
    | HierarchyPureEntityNode
    | HierarchyPureFolderNode;
export type HierarchyPureDictionary = Record<string, AnyHierarchyPureNode>;
export interface HierarchyPureStructure {
    dictionary: HierarchyPureDictionary;
    rootId?: string;
}

// denormalized types:
export interface HierarchyDenormalized {
    level: number;
    parentsToRoot: HierarchyFolderNode[];
    parents: HierarchyFolderNode[];
    foldersCount: number;
    entitiesCount: number;
}

export type HierarchyFolderNode = HierarchyPureFolderNode &
    HierarchyDenormalized;
export type HierarchyEntityNode = HierarchyPureEntityNode &
    HierarchyDenormalized;
export type HierarchyNode = HierarchyFolderNode | HierarchyEntityNode;

export interface HierarchyStructure {
    nodes: HierarchyNode[];
    root: HierarchyFolderNode;
}

export interface HierarchyNodeState {
    toggle?: boolean;
}

export type HierarchyState = Record<string, HierarchyNodeState>;

export type HierarchyEntity<T> = T & {
    id: string;
    name: string;
};
export interface HierarchyBranchIndices {
    startIndex: number;
    endIndex: number;
}
