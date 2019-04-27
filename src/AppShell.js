import React, {useCallback, useLayoutEffect, useMemo, useRef, useReducer} from "react";


import styles from "./AppShell.module.scss";

import AppHeader from "./components/AppHeader";
import AppToolBar from "./components/AppToolBar";
import AppToolBox from "./components/AppToolBox";
import DiagramCanvas from "./components/DiagramCanvas";

import reducer from './reducers';

import tools from './data/tools.json';
import {
	ACTION_UNDO,
	ACTION_REDO,
	ACTION_MOVE_CANVAS,
	ACTION_RECORD_STATE,
	ACTION_CREATE_MODULE,
	ACTION_SELECT_MODULE,
	ACTION_MOVE_MODULE,
	ACTION_SELECT_PATH,
	ACTION_SELECT_CONTROL_POINT,
	ACTION_DESELECT_ALL,
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
		byId: {
			1: {
				id: 1,
				curvy: 80,
				isActive: false,
				isSelected: false,
				pointIds: [
					1,
					2,
					3,
				],
				sourcePortId: null,
				targetPortId: null,
			},
		},
		allIds: [
			1,
		],
		activeIds: [],
		selectedIds: [],
		pathCurvy: 80,
	},
	points: {
		byId: {
			1: {
				id: 1,
				pathId: 1,
				x: 91,
				y: 46.5,
				isTarget: false,
				isSource: true,
				isActive: false,
				isSelected: false,
			},
			2: {
				id: 2,
				pathId: 1,
				x: 108,
				y: 107,
				isTarget: false,
				isSource: false,
			},
			3: {
				id: 3,
				pathId: 1,
				x: 128,
				y: 169.5,
				isTarget: true,
				isSource: false,
				isActive: false,
				isSelected: false,
			},
		},
		allIds: [
			1,
			2,
			3,
		],
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

	const onMoveCanvas = useCallback(({hasMoved, movementX, movementY}) => {
		if (!hasMoved) {
			dispatch({
				type: ACTION_RECORD_STATE,
			});
		}
		dispatch({
			type: ACTION_MOVE_CANVAS,
			payload: {
				movementX,
				movementY,
			},
		});
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
			type: ACTION_RECORD_STATE,
		});

		dispatch({
			type: ACTION_CREATE_MODULE,
			payload: {
				config: config,
				x: clientX - canvasX - offsetX - targetX,
				y: clientY - canvasY - offsetY - targetY,
			},
		});
	}, [state]);

	const onMoveModule = useCallback(({moduleId, hasMoved, movementX, movementY}) => {
		if (!hasMoved) {
			dispatch({
				type: ACTION_RECORD_STATE,
			});
		}
		dispatch({
			type: ACTION_MOVE_MODULE,
			payload: {
				moduleId,
				movementX,
				movementY,
			},
		});
	}, []);

	const onSelectModule = useCallback((moduleId) => {
		dispatch({
			type: ACTION_SELECT_MODULE,
			payload: {
				moduleId,
			},
		});
	}, []);

	const onConnectPathMouseDown = useCallback((event, {pathId}) => {
		event.stopPropagation();
		dispatch({
			type: ACTION_SELECT_PATH,
			payload: {
				pathId,
			},
		});
	}, []);

	const onControlPointMouseDown = useCallback((event, {pointId}) => {
		event.stopPropagation();
		dispatch({
			type: ACTION_SELECT_CONTROL_POINT,
			payload: {
				pointId,
			},
		});
	}, []);

	const pathMapper = useMemo(() => {
		return (callback) => {
			return state.paths.allIds.map((id, index) => callback(state.paths.byId[id], index));
		};
	}, [state]);

	const pathPointMapper = useMemo(() => {
		return (pathId, callback) => {
			const {
				[pathId]: {
					pointIds
				},
			} = state.paths.byId;

			return pointIds.map((id, index) => callback(state.points.byId[id], index));
		};
	}, [state]);

	const pathControlPointMapper = useMemo(() => {
		return (pathId, callback) => {
			const {
				[pathId]: {
					pointIds
				},
			} = state.paths.byId;

			let lastPointIdIndex = pointIds.length;
			const lastPointId = pointIds[pointIds.length - 1];

			const {
				isTarget,
			} = state.points.byId[lastPointId];

			if (isTarget) {
				lastPointIdIndex -= 1;
			}

			return pointIds.slice(1, lastPointIdIndex).map((id, index) => callback(state.points.byId[id], index));
		};
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

	useLayoutEffect(() => {
		const {current: canvas} = canvasRef;

		if (canvas) {
			const handleClick = (event) => {
				if (!(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)) {
					dispatch({
						type: ACTION_DESELECT_ALL,
					});
				}
			};

			canvas.addEventListener('mousedown', handleClick);

			return () => {
				canvas.removeEventListener('mousedown', handleClick);
			};
		}
	}, [canvasRef]);

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
					pathMapper={pathMapper}
					pathPointMapper={pathPointMapper}
					pathControlPointMapper={pathControlPointMapper}
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
					onMoveCanvas={onMoveCanvas}
					onMoveModule={onMoveModule}
					onSelectModule={onSelectModule}
					onConnectPathMouseDown={onConnectPathMouseDown}
					onControlPointMouseDown={onControlPointMouseDown}
				/>
			</div>
		</div>
	);

};

export default AppShell;
