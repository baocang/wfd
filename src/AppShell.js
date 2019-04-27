import React, {useCallback, useMemo, useRef, useReducer} from "react";


import styles from "./AppShell.module.scss";

import AppHeader from "./components/AppHeader";
import AppToolBar from "./components/AppToolBar";
import AppToolBox from "./components/AppToolBox";
import DiagramCanvas from "./components/DiagramCanvas";

import reducer from './reducers';

import tools from './data/tools.json';
import {
	ACTION_REDO,
	ACTION_UNDO,
	ACTION_CREATE_WIDGET,
} from "./constraints";

export const initialState = {
	modules: {
		byId: {},
		allIds: [],
		activeIds: [],
		selectedIds: [],
	},
	ports: {
		byId: {},
		allIds: [],
	},
	paths: {
		byId: {},
		allIds: [],
		activeIds: [],
		selectedIds: [],
		pathCurvy: 80,
	},
	points: {
		byId: {},
		allIds: [],
		activeIds: [],
		selectedIds: [],
	},
	scale: 1,
	offsetX: 40,
	offsetY: 40,
	width: 1280,
	height: 800,
};

const AppShell = () => {

	const heading = 'Workflow Diagrams - Demo App';

	const canvasRef = useRef(null);

	const [state, dispatch] = useReducer(reducer, initialState);

	const onUndo = useCallback(() => {
		dispatch({
			type: ACTION_UNDO,
		});
	}, []);

	const onRedo = useCallback(() => {
		dispatch({
			type: ACTION_REDO,
		});
	}, []);

	const onToolItemDragStart = useCallback((event) => {
		const {
			clientX,
			clientY,
		} = event;

		const {
			groupIndex,
			itemIndex,
		} = event.detail;

		const [{
			x,
			y,
		}] = event.target.getClientRects();

		event.dataTransfer.dropEffect = "copy";
		event.dataTransfer.effectAllowed = "copy";
		event.dataTransfer.setData("data", JSON.stringify({
			targetX: clientX - x,
			targetY: clientY - y,
			config: tools[groupIndex].items[itemIndex],
		}));
	}, []);

	const onCanvasDrop = useCallback((event) => {
		const data = JSON.parse(event.dataTransfer.getData("data"));

		const {
			targetX,
			targetY,
			config,
		} = data;

		const {
			clientX,
			clientY,
		} = event;

		const {
			offsetX,
			offsetY,
		} = state;

		// noinspection JSUnresolvedFunction
		const [{
			x: canvasX,
			y: canvasY,
		}] = canvasRef.current.getClientRects();

		dispatch({
			type: ACTION_CREATE_WIDGET,
			payload: {
				config: config,
				x: clientX - canvasX - offsetX - targetX,
				y: clientY - canvasY - offsetY - targetY,
			},
		});
	}, [state]);

	const moduleMapper = useMemo(() => {
		return (callback) => {
			return state.modules.allIds.map((id, index) => callback(state.modules.byId[id], index));
		};
	}, [state]);

	const inputPortMapper = useMemo(() => {
		return (moduleId, callback) => {
			const {
				[moduleId]: {
					inputPortIds
				}
			} = state.modules.byId;

			return inputPortIds.map((id, index) => callback(state.ports.byId[id], index));
		};
	}, [state]);

	const outputPortMapper = useMemo(() => {
		return (moduleId, callback) => {
			const {
				[moduleId]: {
					outputPortIds
				}
			} = state.modules.byId;

			return outputPortIds.map((id, index) => callback(state.ports.byId[id], index));
		};
	}, [state]);

	return (
		<div className={styles.hostNode}>
			<AppHeader heading={heading}>
				<AppToolBar onUndo={onUndo} onRedo={onRedo}/>
			</AppHeader>
			<div className={styles.contentNode}>
				<AppToolBox
					data={tools}
					onItemDragStart={onToolItemDragStart}
				/>
				<DiagramCanvas
					moduleMapper={moduleMapper}
					inputPortMapper={inputPortMapper}
					outputPortMapper={outputPortMapper}
					canvasRef={canvasRef}
					width={state.width}
					height={state.height}
					offsetX={state.offsetX}
					offsetY={state.offsetY}
					scale={1}
					dispatch={dispatch}
					onDrop={onCanvasDrop}
				/>
			</div>
		</div>
	);

};

export default AppShell;
