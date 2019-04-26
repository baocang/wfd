import React, {useCallback, useReducer} from "react";

import styles from "./AppShell.module.scss";

import AppHeader from "./components/AppHeader";
import AppToolBar from "./components/AppToolBar";
import AppToolBox from "./components/AppToolBox";
import DiagramCanvas from "./components/DiagramCanvas";

import reducer from './reducers';

import tools from './data/tools.json';

export const initialState = {
	scale: 1,
	offsetX: 40,
	offsetY: 40,
	width: 1280,
	height: 800,
};

const AppShell = () => {

	const heading = 'Workflow Diagrams - Demo App';

	const onUndo = useCallback(() => {
		alert('undo');
	}, []);

	const onRedo = useCallback(() => {
		alert('redo');
	}, []);

	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<div className={styles.hostNode}>
			<AppHeader heading={heading}>
				<AppToolBar onUndo={onUndo} onRedo={onRedo}/>
			</AppHeader>
			<div className={styles.contentNode}>
				<AppToolBox data={tools}/>
				<DiagramCanvas width={state.width}
							   height={state.height}
							   offsetX={state.offsetX}
							   offsetY={state.offsetY}
							   scale={1}
							   dispatch={dispatch}
				/>
			</div>
		</div>
	);

};

export default AppShell;
