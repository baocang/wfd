import {ACTION_MOVE_CANVAS} from "../constraints";

const reducer = (state, action) => {
	switch (action.type) {
		case ACTION_MOVE_CANVAS:
			return {
				...state,
				offsetX: state.offsetX + action.payload.movementX,
				offsetY: state.offsetY + action.payload.movementY
			};
		default:
			debugger;
			return state;
	}
};

export default reducer;
