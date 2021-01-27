import React, { ReactElement, useMemo } from 'react';
import { HierarchyColumnConfig, HierarchyProps } from './Hierarchy.types';
import { getEntitiesMap } from './utils';
import { getEntity, getNodes, getVisibleNodes } from './Hierarchy.utils';
import { HierarchyRow } from './HierarchyRow';

const NAME_COLUMN: HierarchyColumnConfig = { key: 'name', width: 400 };

export function Hierarchy<T>(
    {
        structure,
        entities,
        view,
        state,
        nodeToggle,
        columns,
        options,
    }: HierarchyProps<T>,
): ReactElement {
    const entitiesMap = useMemo(() => getEntitiesMap(entities), [entities]);
    const nodes = useMemo(() => getNodes(structure, view), [structure, view]);
    const visibleNodes = useMemo(() => getVisibleNodes(nodes, view, state), [nodes, view, state]);

    return (<div className='hierarchy'>
        {options?.withHeader && <HierarchyRow {...{
            view,
            nameColumn: NAME_COLUMN,
            columns,
            isHeader: true,
        }}/>}
        {visibleNodes.map((node) => {
            const entity = getEntity(node, view, entitiesMap);
            return (<HierarchyRow {...{
                key: node.id,
                node,
                entity,
                view,
                state,
                nameColumn: NAME_COLUMN,
                columns,
                nodeToggle,
            }}/>);
        })}
    </div>);
};


