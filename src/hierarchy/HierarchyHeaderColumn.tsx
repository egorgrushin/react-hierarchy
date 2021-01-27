import React from 'react';
import { HierarchyHeaderColumnProps, HierarchyViews } from './Hierarchy.types';
import { HierarchyColumn } from './HierarchyColumn';
import { HierarchyNode, HierarchyNodeTypes, HierarchyState } from './types';
import { getNodeState } from './utils';
import styles from './HierarchyHeaderColumn.module.scss';
import { getColumnStyles } from './Hierarchy.utils';

export function HierarchyHeaderColumn<T>
({
     node,
     entity,
     view,
     state,
     column,
     nodeToggle,
     isHeader,
 }: HierarchyHeaderColumnProps<T>) {
    const getFolderToggleIcon = (node: HierarchyNode, state: HierarchyState): string => {
        const toggle = getNodeState(node, state);
        return toggle ? '⇩' : '⇨';
    };
    const onToggle = () => {
        const toggle = !getNodeState(node, state);
        nodeToggle(toggle, node);
    };

    const isFlat = view === HierarchyViews.FlatFolders || view === HierarchyViews.OnlyEntities;
    const toggleIcon = getFolderToggleIcon(node, state);

    return (
        <div style={getColumnStyles(column)}
             className={styles.wrapper}>
            {!isFlat && node && (
                <div
                    onClick={onToggle}
                    style={{ paddingLeft: `${20 * (node.level + 1)}px` }}
                >
                    {node.type === HierarchyNodeTypes.Folder && (<span>{toggleIcon}</span>)}
                </div>
            )}
            <HierarchyColumn {...{
                node,
                entity,
                column,
                isHeader,
                isHead: true,
            }}/>
        </div>
    );
};
