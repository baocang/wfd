import {
	ACTION_UNDO,
	ACTION_REDO,
	ACTION_MOVE_CANVAS,
	ACTION_RECORD_STATE,
	ACTION_CREATE_WIDGET,
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
					isSelected: false,
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
		},
		ports: {
			...state.ports,
			byId: allPortMap,
			allIds: allPortIds,
		},
	};
};

const reducer = (state, action) => {
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
		case ACTION_CREATE_WIDGET:
			return createWidget(state, action.payload);
		default:
			return state;
	}
};

export default reducer;
