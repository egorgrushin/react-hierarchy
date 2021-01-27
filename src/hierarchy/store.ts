import { keyBy } from 'lodash';
import {
    HierarchyEntity,
    HierarchyNodeTypes,
    HierarchyPureEntityNode,
    HierarchyPureFolderNode,
    HierarchyPureStructure,
    HierarchyStructure,
} from './types';
import { denormalizeStructure } from './utils';
import { HierarchyColumnConfig } from './Hierarchy.types';

export const ROOT_NODE: HierarchyPureFolderNode = {
    id: 'node-root',
    type: HierarchyNodeTypes.Folder,
    name: 'Root Node',

};

export const HIERARCHY_PURE_STRUCTURE: HierarchyPureStructure = {
    dictionary: {
        [ROOT_NODE.id]: ROOT_NODE,
        'node-1': { id: 'node-1', type: HierarchyNodeTypes.Folder, name: 'node 1', parentId: ROOT_NODE.id },
        'node-3': { id: 'node-3', type: HierarchyNodeTypes.Folder, name: 'node 3', parentId: 'node-1' },
        'node-5': { id: 'node-5', type: HierarchyNodeTypes.Entity, parentId: 'node-3', entityId: 'entity-3' },
        'node-4': { id: 'node-4', type: HierarchyNodeTypes.Entity, parentId: 'node-1', entityId: 'entity-2' },
        'node-2': { id: 'node-2', type: HierarchyNodeTypes.Entity, parentId: ROOT_NODE.id, entityId: 'entity-1' },
    },
    rootId: ROOT_NODE.id,
};

export const ENTITIES: HierarchyEntity<any>[] = [
    { id: 'entity-1', age: 1, name: 'entity 1', fullName: 'Entity First' },
    { id: 'entity-2', age: 2, name: 'entity 2', fullName: 'Entity Second' },
    { id: 'entity-3', age: 3, name: 'entity 3', fullName: 'Entity Third' },
];

export const HIERARCHY_COLUMNS: HierarchyColumnConfig[] = [
    { key: 'age', title: 'Age' },
    { key: 'fullName', title: 'Full name' },
];

export const compileStructure = (
    pureStructure: HierarchyPureStructure,
    entities: HierarchyEntity<any>,
): HierarchyStructure => {
    const entitiesMap = keyBy<any>(entities, 'id');
    const pureStructureWithNames = Object.values(pureStructure.dictionary).reduce((memo, node) => {
        if (node.type === HierarchyNodeTypes.Folder) return memo;

        memo.dictionary[node.id] = {
            ...node,
            name: entitiesMap[(node as HierarchyPureEntityNode).entityId]?.name,
        };
        return memo;
    }, { ...pureStructure });

    return denormalizeStructure(pureStructureWithNames);
};
