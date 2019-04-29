import React, {
	useCallback,
	useMemo,
	useReducer,
} from "react";

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
	ACTION_CREATE_MODULE,
	ACTION_SELECT_MODULE,
	ACTION_MOVE_MODULE,
	ACTION_CREATE_PATH,
	ACTION_SELECT_PATH,
	ACTION_SELECT_POINT,
	ACTION_MOVE_POINT_BY_PORT,
	ACTION_ATTACH_POINT_TO_INPUT_PORT,
	ACTION_REMOVE_PATH,
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

	const [state, dispatch] = useReducer(reducer, initialState);

	const undoCallback = useCallback(() => {
		dispatch({
			type: ACTION_UNDO,
		});
	}, []);

	const redoCallback = useCallback(() => {
		dispatch({
			type: ACTION_REDO,
		});
	}, []);

	const toolItemDragStartCallback = useCallback((event) => {
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

	const canvasMouseDownCallback = useCallback((event) => {
		dispatch({
			type: ACTION_DESELECT_ALL,
		});
	}, []);

	const canvasDragMoveCallback = useCallback((event, {movementX, movementY}) => {
		dispatch({
			type: ACTION_MOVE_CANVAS,
			payload: {
				movementX,
				movementY,
			},
		});
	}, []);

	const canvasDropCallback = useCallback((event) => {
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

		const [{
			x: canvasX,
			y: canvasY,
		}] = event.currentTarget.getClientRects();

		dispatch({
			type: ACTION_CREATE_MODULE,
			payload: {
				config: config,
				x: clientX - canvasX - offsetX - targetX,
				y: clientY - canvasY - offsetY - targetY,
			},
		});
	}, [state]);

	const moduleDragStartCallback = useCallback((event) => {

	}, []);

	const moduleDragMoveCallback = useCallback((event, {moduleId, movementX, movementY}) => {
		dispatch({
			type: ACTION_MOVE_MODULE,
			payload: {
				moduleId,
				movementX,
				movementY,
			},
		});
	}, []);

	const moduleDragEndCallback = useCallback((event) => {

	}, []);

	const moduleMouseDownCallback = useCallback((event, {moduleId}) => {
		const {
			selectedIds
		} = state.modules;

		event.stopPropagation();

		if (selectedIds.indexOf(moduleId) === -1) {
			dispatch({
				type: ACTION_SELECT_MODULE,
				payload: {
					moduleId,
				},
			});
		}
	}, [state]);

	const modulePortMouseUpCallback = useCallback((event, {
		portId,
		canvasX,
		canvasY,
	}) => {
		const [{
			x: portX,
			y: portY,
			height: portHeight,
		}] = event.target.getClientRects();

		dispatch({
			type: ACTION_ATTACH_POINT_TO_INPUT_PORT,
			payload: {
				portId,
				portX,
				portY,
				portHeight,
				canvasX,
				canvasY,
			},
		});
	}, [state]);

	const modulePortMouseDownCallback = useCallback((event, {portId}) => {

	}, [state]);

	const modulePortDragStartCallback = useCallback((event, {
		portId,
		canvasX,
		canvasY,
	}) => {
		event.stopPropagation();

		const {
			mode,
		} = state.ports.byId[portId];

		if (mode === "in") {
			return;
		}

		const {
			offsetX,
			offsetY,
		} = state;

		const {
			x: portX,
			y: portY,
			width: portWidth,
			height: portHeight,
		} = event.target.getBoundingClientRect();

		dispatch({
			type: ACTION_CREATE_PATH,
			payload: {
				portId,
				offsetX: portX - canvasX - offsetX + portWidth,
				offsetY: portY - canvasY - offsetY + portHeight / 2,
			},
		});
	}, [state]);

	const modulePortDragMoveCallback = useCallback((event, {
		portId,
		canvasX,
		canvasY,
		movementX,
		movementY,
	}) => {
		dispatch({
			type: ACTION_MOVE_POINT_BY_PORT,
			payload: {
				portId,
				canvasX,
				canvasY,
				movementX,
				movementY,
			},
		});
	}, [state]);

	const modulePortDragEndCallback = useCallback(() => {
		dispatch({
			type: ACTION_REMOVE_PATH,
		});
	}, [state]);

	const connectPathMouseDownCallback = useCallback((event, {pathId}) => {
		event.stopPropagation();

		dispatch({
			type: ACTION_SELECT_PATH,
			payload: {
				pathId,
			},
		});
	}, []);

	const controlPointMouseDownCallback = useCallback((event, {pointId}) => {
		event.stopPropagation();

		dispatch({
			type: ACTION_SELECT_POINT,
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
				},
			} = state.modules.byId;

			return outputPortIds.map((id, index) => callback(state.ports.byId[id], index));
		};
	}, [state]);

	return (
		<div className={styles.hostNode}>
			<AppHeader heading={heading}>
				<AppToolBar onUndo={undoCallback} onRedo={redoCallback}/>
			</AppHeader>
			<div className={styles.contentNode}>
				<AppToolBox
					data={tools}
					onItemDragStart={toolItemDragStartCallback}
				/>
				<DiagramCanvas
					scale={1}
					width={state.width}
					height={state.height}
					offsetX={state.offsetX}
					offsetY={state.offsetY}

					pathMapper={pathMapper}
					pathPointMapper={pathPointMapper}
					pathControlPointMapper={pathControlPointMapper}
					moduleMapper={moduleMapper}
					inputPortMapper={inputPortMapper}
					outputPortMapper={outputPortMapper}

					onDrop={canvasDropCallback}
					onDragMove={canvasDragMoveCallback}
					onMouseDown={canvasMouseDownCallback}

					onModuleMouseDown={moduleMouseDownCallback}
					onModuleDragStart={moduleDragStartCallback}
					onModuleDragMove={moduleDragMoveCallback}
					onModuleDragEnd={moduleDragEndCallback}

					onModulePortMouseUp={modulePortMouseUpCallback}
					onModulePortMouseDown={modulePortMouseDownCallback}

					onModulePortDragStart={modulePortDragStartCallback}
					onModulePortDragMove={modulePortDragMoveCallback}
					onModulePortDragEnd={modulePortDragEndCallback}

					onConnectPathMouseDown={connectPathMouseDownCallback}
					onControlPointMouseDown={controlPointMouseDownCallback}
				/>
			</div>
		</div>
	);

};

export default AppShell;
