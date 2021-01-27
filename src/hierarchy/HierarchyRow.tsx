import React from 'react';
import { HierarchyRowProps } from './Hierarchy.types';
import { HierarchyColumn } from './HierarchyColumn';
import styles from './HierarchyRow.module.scss';
import { HierarchyHeaderColumn } from './HierarchyHeaderColumn';

export function HierarchyRow<T>
({
     node,
     entity,
     view,
     state,
     nameColumn,
     nodeToggle,
     columns,
     isHeader,
 }: HierarchyRowProps<T>) {

    return (
        <div className={styles.wrapper}>
            <HierarchyHeaderColumn {...{
                nodeToggle,
                view,
                node,
                state,
                column: nameColumn,
                entity,
                isHeader,
            }}/>
            {columns?.map((column) => <HierarchyColumn {...{
                key: column.key,
                node,
                entity,
                column,
                isHeader,
            }}/>)}
        </div>
    );
};
