import React, { useState } from 'react';
import './App.css';
import { Hierarchy } from './hierarchy/Hierarchy';
import { compileStructure, ENTITIES, HIERARCHY_COLUMNS, HIERARCHY_PURE_STRUCTURE } from './hierarchy/store';
import { HierarchyNode, HierarchyState } from './hierarchy/types';
import { HierarchyColumnConfig, HierarchyOptions, HierarchyViews } from './hierarchy/Hierarchy.types';

function App() {
    const [hierarchyState, setHierarchyState] = useState<HierarchyState>({});
    const [hierarchyOptions, setHierarchyOptions] = useState<HierarchyOptions>({
        withHeader: false,
    });

    const [hierarchyColumns, setHierarchyColumns] = useState<HierarchyColumnConfig[]>(HIERARCHY_COLUMNS);

    const structure = compileStructure(HIERARCHY_PURE_STRUCTURE, ENTITIES);
    const entities = ENTITIES;
    const view = HierarchyViews.Both;

    const onNodeToggle = (toggle: boolean, node: HierarchyNode) => {
        setHierarchyState({
            ...hierarchyState,
            [node.id]: { toggle },
        });
    };

    return (
        <div className="App">
            <div className="switcher">
                <input type="checkbox" checked={hierarchyOptions.withHeader} onChange={(event) => {
                    setHierarchyOptions({
                        ...hierarchyOptions,
                        withHeader: !!event.target.checked,
                    });
                }}/>
                <span>with header</span>
            </div>
            <div className="switcher">
                <input type="checkbox" checked={!!hierarchyColumns} onChange={(event) => {
                    const columns = event.target.checked ? HIERARCHY_COLUMNS : undefined;
                    setHierarchyColumns(columns);
                }}/>
                <span>with columns</span>
            </div>
            <Hierarchy
                structure={structure}
                entities={entities}
                state={hierarchyState}
                view={view}
                columns={hierarchyColumns}
                nodeToggle={onNodeToggle}
                options={hierarchyOptions}
            />
        </div>
    );
}

export default App;
