import {
	ACTION_UNDO,
	ACTION_REDO,
	ACTION_MOVE_CANVAS,
	ACTION_RECORD_STATE,
	ACTION_CREATE_MODULE,
	ACTION_SELECT_MODULE,
	ACTION_MOVE_MODULE,
	ACTION_DESELECT_ALL,
} from "../constraints";

import {
	getUniqueCode,
} from "../commons/UniqueCode";

const undoStack = [];
const redoStack = [];

window.undoStack = undoStack;
window.redoStack = redoStack;

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
	return {
		...state,
		offsetX: state.offsetX + movementX,
		offsetY: state.offsetY + movementY
	};
};

const createWidget = (state, {
	x,
	y,
	config,
}) => {
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
};

const deSelectAll = (state) => {
	const newState = {
		...state,
		modules: {
			...state.modules,
			byId: {
				...state.modules.byId,
			},
			selectedIds: [],
		},
	};

	state.modules.selectedIds.forEach((id) => {
		newState.modules.byId[id] = {...state.modules.byId[id]};
		newState.modules.byId[id].isSelected = false;
	});

	return newState;
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
		case ACTION_RECORD_STATE:
			undoStack.push(state);
			return state;
		case ACTION_CREATE_MODULE:
			return createWidget(state, action.payload);
		case ACTION_SELECT_MODULE:
			return selectModule(state, action.payload);
		case ACTION_MOVE_MODULE:
			return moveModule(state, action.payload);
		case ACTION_DESELECT_ALL:
			return deSelectAll(state);
		default:
			return state;
	}
};

export default reducer;
