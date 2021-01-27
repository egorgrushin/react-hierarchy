import { HierarchyEntity, HierarchyNode, HierarchyState, HierarchyStructure } from './types';

export enum HierarchyViews {
    OnlyFolders = 'OnlyFolders',
    OnlyEntities = 'OnlyEntities',
    Both = 'Both',
    FlatFolders = 'FlatFolders'
}

export interface HierarchyOptions {
    withHeader?: boolean;
}

export interface HierarchyProps<T> {
    structure?: HierarchyStructure;
    entities?: HierarchyEntity<T>[];
    state?: HierarchyState;
    view?: HierarchyViews;
    columns?: HierarchyColumnConfig[];
    nodeToggle: (toggle: boolean, node: HierarchyNode) => void;
    options?: HierarchyOptions;
}

export interface HierarchyRowProps<T> {
    node?: HierarchyNode;
    entity?: HierarchyEntity<T>;
    state?: HierarchyState;
    view: HierarchyViews;
    nameColumn: HierarchyColumnConfig;
    columns?: HierarchyColumnConfig[];
    nodeToggle?: (toggle: boolean, node: HierarchyNode) => void;
    isHeader?: boolean;
}

export interface HierarchyColumnConfig {
    key: string;
    title?: string;
    path?: string;
    width?: number;
}

export interface HierarchyColumnProps<T> {
    node: HierarchyNode;
    entity?: HierarchyEntity<T>;
    column: HierarchyColumnConfig;
    isHead?: boolean;
    isHeader?: boolean;
}


export interface HierarchyHeaderColumnProps<T> {
    node: HierarchyNode;
    entity?: HierarchyEntity<T>;
    column: HierarchyColumnConfig;
    state: HierarchyState;
    view: HierarchyViews;
    nodeToggle: (toggle: boolean, node: HierarchyNode) => void;
    isHeader?: boolean;
}
