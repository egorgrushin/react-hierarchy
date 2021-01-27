import React from 'react';
import { HierarchyColumnConfig, HierarchyColumnProps } from './Hierarchy.types';
import styles from './HierarchyColumn.module.scss';
import classNames from 'classnames';
import { get } from 'lodash';
import { HierarchyEntity } from './types';
import { getColumnStyles } from './Hierarchy.utils';

export function HierarchyColumn<T>(
    {
        node,
        column,
        entity,
        isHead,
        isHeader,
    }: HierarchyColumnProps<T>,
) {
    const getValue = (column: HierarchyColumnConfig, entity: HierarchyEntity<T> | undefined): any => {
        if (!entity) { return entity; }
        const path = column.path ?? column.key;
        return get(entity, path);
    };

    return <div style={!isHead ? getColumnStyles(column) : {}}
                className={classNames(styles.column)}>
        {isHeader && isHead && 'Name'}
        {isHeader && !isHead && column.title}
        {!isHeader && isHead && node?.name}
        {!isHeader && !isHead && getValue(column, entity)}
    </div>;
};
