import {
	ACTION_UNDO,
	ACTION_REDO,
	ACTION_MOVE_CANVAS,
	ACTION_RECORD_MOVE_CANVAS,
} from "../constraints";

const undoStack = [];
const redoStack = [];

window.undoStack = undoStack;
window.redoStack = redoStack;

const reducer = (state, action) => {
	switch (action.type) {
		case ACTION_UNDO:
			if (undoStack.length) {
				redoStack.push(state);
				return undoStack.pop();
			}
			return state;
		case ACTION_REDO:
			if (redoStack.length) {
				undoStack.push(state);
				return redoStack.pop();
			}
			return state;
		case ACTION_MOVE_CANVAS:
			return {
				...state,
				offsetX: state.offsetX + action.payload.movementX,
				offsetY: state.offsetY + action.payload.movementY
			};
		case ACTION_RECORD_MOVE_CANVAS:
			undoStack.push(state);
			return state;

		default:
			debugger;
			return state;
	}
};

export default reducer;
