import {
	getUniqueCode,
} from "../commons/UniqueCode";

import {
	ACTION_UNDO,
	ACTION_REDO,
	ACTION_MOVE_CANVAS,
	ACTION_CREATE_MODULE,
	ACTION_SELECT_MODULE,
	ACTION_MOVE_MODULE,
	ACTION_SELECT_PATH,
	ACTION_SELECT_POINT,
	ACTION_DESELECT_ALL,
} from "../constraints";

const undoStack = [];
const redoStack = [];

window.undoStack = undoStack;
window.redoStack = redoStack;

const recordState = (state) => {
	undoStack.push(state);
	return state;
};

const undo = (state) => {
	if (undoStack.length) {
		redoStack.push(state);
		return undoStack.pop();
	}
	return state;
};

const redo = (state) => {
	if (redoStack.length) {
		undoStack.push(state);
		return redoStack.pop();
	}
	return state;
};

const moveCanvas = (state, {movementX, movementY}) => {
	if (movementX || movementY) {
		recordState(state);

		return {
			...state,
			offsetX: state.offsetX + movementX,
			offsetY: state.offsetY + movementY
		};
	}
	return state;
};

const createWidget = (state, {
	x,
	y,
	config,
}) => {
	recordState(state);

	const {
		type,
		width,
		height,
		fillColor,
		heading,
	} = config;

	const newModuleId = getUniqueCode(state.modules.allIds);

	const allPortIds = state.ports.allIds.slice();
	const allPortMap = Object.create(state.ports.byId);
	const newInputPortIds = [];
	const newOutputPortIds = [];

	config.ports.forEach((port) => {
		const newPortId = getUniqueCode(allPortIds);

		const portInfo = {
			mode: port.mode,
			name: port.name,
			text: port.text,
			pointIds: [],
			moduleId: newModuleId,
		};

		if (port.mode === "in") {
			newInputPortIds.push(newPortId);
		}

		if (port.mode === "out") {
			newOutputPortIds.push(newPortId);
		}

		allPortIds.push(newPortId);
		allPortMap[newPortId] = portInfo;
	});

	return {
		...state,
		modules: {
			...state.modules,
			byId: {
				...state.modules.byId,
				[newModuleId]: {
					id: newModuleId,
					type: type,
					isActive: false,
					isSelected: true,
					width: width,
					height: height,
					radius: 10,
					fillColor: fillColor,
					heading: heading,
					offsetX: x,
					offsetY: y,
					inputPortIds: newInputPortIds,
					outputPortIds: newOutputPortIds,
				}
			},
			allIds: state.modules.allIds.concat(newModuleId),
			selectedIds: [newModuleId],
		},
		ports: {
			...state.ports,
			byId: allPortMap,
			allIds: allPortIds,
		},
	};
};

const selectModule = (state, {moduleId}) => {
	const {
		selectedIds,
	} = state.modules;

	if (selectedIds.includes(moduleId)) {
		return state;
	}

	recordState(state);

	return {
		...state,
		modules: {
			...state.modules,
			byId: {
				...state.modules.byId,
				[moduleId]: {
					...state.modules.byId[moduleId],
					isSelected: true,
				},
			},
			selectedIds: [moduleId],
		},
	};
};

const moveModule = (state, {
	moduleId,
	movementX,
	movementY,
}) => {
	if (movementX || movementY) {
		recordState(state);

		return {
			...state,
			modules: {
				...state.modules,
				byId: {
					...state.modules.byId,
					[moduleId]: {
						...state.modules.byId[moduleId],
						offsetX: state.modules.byId[moduleId].offsetX + movementX,
						offsetY: state.modules.byId[moduleId].offsetY + movementY,
					},
				},
			},
		};
	}

	return state;
};

const selectPath = (state, {pathId}) => {
	const {
		selectedIds,
	} = state.paths;

	if (selectedIds.includes(pathId)) {
		return state;
	}

	const {
		pointIds
	} = state.paths.byId[pathId];

	const newState = {
		...state,
		paths: {
			...state.paths,
			byId: {
				...state.paths.byId,
				[pathId]: {
					...state.paths.byId[pathId],
					isSelected: true,
				},
			},
			selectedIds: [pathId],
		},
		points: {
			...state.points,
			byId: {
				...state.points.byId,
			},
			selectedIds: pointIds.slice(),
		},
	};

	pointIds.forEach((id) => {
		newState.points.byId[id] = {
			...state.points.byId[id],
			isSelected: true,
		};
	});

	return newState;
};

const selectPoint = (state, {pointId}) => {
	const {
		selectedIds,
	} = state.points;

	if (selectedIds.includes(pointId)) {
		return state;
	}

	return {
		...state,
		points: {
			...state.points,
			byId: {
				...state.points.byId,
				[pointId]: {
					...state.points.byId[pointId],
					isSelected: true,
				},
			},
			selectedIds: [pointId],
		},
	};
};

const deSelectAll = (state) => {
	if (
		state.modules.selectedIds.length ||
		state.paths.selectedIds.length ||
		state.points.selectedIds.length
	) {
		recordState(state);

		const newState = {
			...state,
			modules: {
				...state.modules,
				byId: {
					...state.modules.byId,
				},
				selectedIds: [],
			},
			paths: {
				...state.paths,
				byId: {
					...state.paths.byId,
				},
				selectedIds: [],
			},
			points: {
				...state.points,
				byId: {
					...state.points.byId,
				},
				selectedIds: [],
			},
		};

		state.modules.selectedIds.forEach((id) => {
			newState.modules.byId[id] = {
				...state.modules.byId[id],
				isSelected: false,
			};
		});

		state.paths.selectedIds.forEach((id) => {
			newState.paths.byId[id] = {
				...state.paths.byId[id],
				isSelected: false,
			};
		});

		state.points.selectedIds.forEach((id) => {
			newState.points.byId[id] = {
				...state.points.byId[id],
				isSelected: false,
			};
		});

		return newState;
	}

	return state;
};

const reducer = (state, action) => {
	console.log(action.type);
	switch (action.type) {
		case ACTION_UNDO:
			return undo(state);
		case ACTION_REDO:
			return redo(state);
		case ACTION_MOVE_CANVAS:
			return moveCanvas(state, action.payload);
		case ACTION_CREATE_MODULE:
			return createWidget(state, action.payload);
		case ACTION_SELECT_MODULE:
			return selectModule(state, action.payload);
		case ACTION_MOVE_MODULE:
			return moveModule(state, action.payload);
		case ACTION_SELECT_PATH:
			return selectPath(state, action.payload);
		case ACTION_SELECT_POINT:
			return selectPoint(state, action.payload);
		case ACTION_DESELECT_ALL:
			return deSelectAll(state);
		default:
			return state;
	}
};

export default reducer;
