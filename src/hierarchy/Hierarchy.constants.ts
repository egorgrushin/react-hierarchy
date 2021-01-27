import { HierarchyViews } from './Hierarchy.types';
import { HierarchyNodeTypes } from './types';

export const VIEW_TO_HIERARCHY_NODE_TYPE_MAP = {
    [HierarchyViews.OnlyEntities]: HierarchyNodeTypes.Entity,
    [HierarchyViews.OnlyFolders]: HierarchyNodeTypes.Folder,
    [HierarchyViews.FlatFolders]: HierarchyNodeTypes.Folder,
};
