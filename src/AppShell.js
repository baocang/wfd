import React, {useCallback} from "react";

import styles from "./AppShell.module.scss";

import AppHeader from "./components/AppHeader";
import AppToolBar from "./components/AppToolBar";
import AppToolBox from "./components/AppToolBox";
import DiagramCanvas from "./components/DiagramCanvas";

import tools from './data/tools.json';

const AppShell = () => {

	const heading = 'Workflow Diagrams - Demo App';

	const onUndo = useCallback(() => {
		alert('undo');
	}, []);

	const onRedo = useCallback(() => {
		alert('redo');
	}, []);

	return (
		<div className={styles.hostNode}>
			<AppHeader heading={heading}>
				<AppToolBar onUndo={onUndo} onRedo={onRedo}/>
			</AppHeader>
			<div className={styles.contentNode}>
				<AppToolBox data={tools}/>
				<DiagramCanvas width={1280}
							   height={800}
							   offsetX={40}
							   offsetY={40}
							   scale={1}
				/>
			</div>
		</div>
	);

};

export default AppShell;
