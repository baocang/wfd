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
	ACTION_CREATE_PATH,
	ACTION_SELECT_PATH,
	ACTION_SELECT_POINT,
	ACTION_MOVE_POINT,
	ACTION_MOVE_POINT_BY_PORT,
	ACTION_ATTACH_POINT_TO_INPUT_PORT,
	ACTION_REMOVE_PATH,
	ACTION_INSERT_POINT_TO_PATH,
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

const createModule = (state, {
	x,
	y,
	config,
}) => {
	recordState(state);

	const newState = deSelectAll(state);

	const {
		type,
		width,
		height,
		fillColor,
		heading,
	} = config;

	const newModuleId = getUniqueCode(newState.modules.allIds);

	const allPortIds = [...newState.ports.allIds];
	const allPortMap = {...newState.ports.byId};
	const newInputPortIds = [];
	const newOutputPortIds = [];

	config.ports.forEach((port) => {
		const newPortId = getUniqueCode(allPortIds);

		const portInfo = {
			id: newPortId,
			moduleId: newModuleId,
			mode: port.mode,
			name: port.name,
			text: port.text,
			pathIds: [],
			pointIds: [],
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
		...newState,
		modules: {
			...newState.modules,
			byId: {
				...newState.modules.byId,
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
			allIds: newState.modules.allIds.concat(newModuleId),
			selectedIds: [newModuleId],
		},
		ports: {
			...newState.ports,
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

	const newState = deSelectAll(state);

	return {
		...newState,
		modules: {
			...newState.modules,
			byId: {
				...newState.modules.byId,
				[moduleId]: {
					...newState.modules.byId[moduleId],
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
		const {
			modules: {
				byId: {
					[moduleId]: {
						inputPortIds,
						outputPortIds,
						offsetX,
						offsetY,
					},
				},
			},
		} = state;

		let newState = {
			...state,
			modules: {
				...state.modules,
				byId: {
					...state.modules.byId,
					[moduleId]: {
						...state.modules.byId[moduleId],
						offsetX: offsetX + movementX,
						offsetY: offsetY + movementY,
					},
				},
			},
		};

		inputPortIds.forEach((portId) => {
			const {
				pointIds,
			} = newState.ports.byId[portId];

			pointIds.forEach((pointId) => {
				const {
					x,
					y,
				} = newState.points.byId[pointId];

				newState = {
					...newState,
					points: {
						...newState.points,
						byId: {
							...newState.points.byId,
							[pointId]: {
								...newState.points.byId[pointId],
								x: x + movementX,
								y: y + movementY,
							},
						},
					},
				};
			});
		});

		outputPortIds.forEach((portId) => {
			const {
				pointIds,
			} = newState.ports.byId[portId];

			pointIds.forEach((pointId) => {
				const {
					x,
					y,
				} = newState.points.byId[pointId];

				newState = {
					...newState,
					points: {
						...newState.points,
						byId: {
							...newState.points.byId,
							[pointId]: {
								...newState.points.byId[pointId],
								x: x + movementX,
								y: y + movementY,
							},
						},
					},
				};
			});
		});

		return newState;
	}

	return state;
};

const createPath = (state, {
	portId,
	offsetX,
	offsetY,
}) => {
	recordState(state);

	const pathId = getUniqueCode(state.paths.allIds);
	const targetPointId = getUniqueCode(state.points.allIds);
	const sourcePointId = getUniqueCode(state.points.allIds.concat(targetPointId));

	return {
		...state,
		paths: {
			...state.paths,
			byId: {
				...state.paths.byId,
				[pathId]: {
					id: pathId,
					curvy: state.paths.pathCurvy,
					isActive: false,
					isSelected: false,
					pointIds: [sourcePointId, targetPointId],
					sourcePortId: portId,
					targetPortId: null,
				},
			},
			allIds: [
				...state.paths.allIds,
				pathId,
			],
			pendingPathId: pathId,
		},
		points: {
			...state.points,
			byId: {
				...state.points.byId,
				[sourcePointId]: {
					id: sourcePointId,
					pathId: pathId,
					x: offsetX,
					y: offsetY,
					isTarget: false,
					isSource: true,
					isActive: false,
					isSelected: false,
				},
				[targetPointId]: {
					id: targetPointId,
					pathId: pathId,
					x: offsetX,
					y: offsetY,
					isTarget: false,
					isSource: false,
					isActive: false,
					isSelected: false,
				},
			},
			allIds: [
				...state.points.allIds,
				sourcePointId,
				targetPointId,
			],
		},
		ports: {
			...state.ports,
			byId: {
				...state.ports.byId,
				[portId]: {
					...state.ports.byId[portId],
					pointIds: [
						...state.ports.byId[portId].pointIds,
						sourcePointId,
					],
					pathIds: [
						...state.ports.byId[portId].pathIds,
						pathId,
					],
				},
			},
		},
	};
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

	let newState = deSelectAll(state);

	newState = {
		...newState,
		paths: {
			...newState.paths,
			byId: {
				...newState.paths.byId,
				[pathId]: {
					...newState.paths.byId[pathId],
					isSelected: true,
				},
			},
			selectedIds: [pathId],
		},
		points: {
			...newState.points,
			byId: {
				...newState.points.byId,
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
	//
	// if (selectedIds.includes(pointId)) {
	// 	return state;
	// }

	const newState = deSelectAll(state);

	return {
		...newState,
		points: {
			...newState.points,
			byId: {
				...newState.points.byId,
				[pointId]: {
					...newState.points.byId[pointId],
					isSelected: true,
				},
			},
			selectedIds: [pointId],
		},
	};
};

const movePoint = (state, {
	pointId,
	movementX,
	movementY,
}) => {
	const {
		[pointId]: {
			x: offsetX,
			y: offsetY,
		},
	} = state.points.byId;

	return {
		...state,
		points: {
			...state.points,
			byId: {
				...state.points.byId,
				[pointId]: {
					...state.points.byId[pointId],
					x: offsetX + movementX,
					y: offsetY + movementY,
				}
			},
		},
	};
};

const movePointByPort = (state, {
	portId,
	canvasX,
	canvasY,
	movementX,
	movementY,
}) => {
	const {
		pathIds,
	} = state.ports.byId[portId];

	const lastPathId = pathIds[pathIds.length - 1];

	const {
		pointIds,
	} = state.paths.byId[lastPathId];

	const lastPointId = pointIds[pointIds.length - 1];

	const {
		[lastPointId]: {
			x: offsetX,
			y: offsetY,
		},
	} = state.points.byId;

	return {
		...state,
		points: {
			...state.points,
			byId: {
				...state.points.byId,
				[lastPointId]: {
					...state.points.byId[lastPointId],
					x: offsetX + movementX,
					y: offsetY + movementY,
				}
			},
		},
	};
};

const attachPointToInputPort = (state, {
	portId,
	canvasX,
	canvasY,
	portX,
	portY,
	portHeight,
}) => {
	const {
		paths: {
			pendingPathId,
		},
		offsetX,
		offsetY,
	} = state;

	const {
		[pendingPathId]: {
			pointIds,
		},
	} = state.paths.byId;

	const lastPointId = pointIds[pointIds.length - 1];

	return {
		...state,
		points: {
			...state.points,
			byId: {
				...state.points.byId,
				[lastPointId]: {
					...state.points.byId[lastPointId],
					isTarget: true,
					x: portX - canvasX - offsetX,
					y: portY - canvasY - offsetY + portHeight / 2,
				},
			}
		},
		ports: {
			...state.ports,
			byId: {
				...state.ports.byId,
				[portId]: {
					...state.ports.byId[portId],
					pointIds: [
						...state.ports.byId[portId].pointIds,
						lastPointId,
					],
					pathIds: {
						...state.ports.byId[portId].pathIds,
						pendingPathId,
					},
				},
			}
		},
		paths: {
			...state.paths,
			pendingPathId: null,
		}
	};
};

const removePath = (state, payload) => {
	const {
		pendingPathId: pathId,
	} = state.paths;

	if (pathId) {
		const newState = {
			...state,
			paths: {
				...state.paths,
				byId: {
					...state.paths.byId,
				},
				allIds: [...state.paths.allIds],
				selectedIds: [...state.paths.selectedIds],
			},
			points: {
				...state.points,
				byId: {
					...state.points.byId,
				},
				allIds: [...state.points.allIds],
				selectedIds: [...state.points.selectedIds],
			},
			ports: {
				...state.ports,
				byId: {
					...state.ports.byId,
				},
			},
		};

		const {
			paths: {
				byId: allPathMap,
				allIds: allPathIds,
				selectedIds: allPathSelectedIds,
			},
			points: {
				byId: allPointMap,
				allIds: allPointIds,
				selectedIds: allPointSelectedIds,
			},
			ports: {
				byId: allPortMap,
			},
		} = newState;

		const {
			pointIds,
			sourcePortId,
			targetPortId,
		} = allPathMap[pathId];

		const sourcePointId = pointIds[0];
		const targetPointId = pointIds[pointIds.length - 1];
		const pathIndex = allPathIds.indexOf(pathId);
		const selectedPathIndex = allPathSelectedIds.indexOf(pathId);

		delete allPathMap[pathId];

		if (pathIndex !== -1) {
			allPathIds.splice(pathIndex, 1);
		}

		if (selectedPathIndex !== -1) {
			allPathSelectedIds.splice(selectedPathIndex, 1);
		}

		pointIds.forEach((pointId) => {
			const pointIndex = allPointIds.indexOf(pointId);
			const selectedPointIndex = allPointSelectedIds.indexOf(pointId);

			delete allPointMap[pointId];

			if (pointIndex !== -1) {
				allPointIds.splice(pointIndex, 1);
			}

			if (selectedPointIndex !== -1) {
				allPointSelectedIds.splice(selectedPointIndex, 1);
			}
		});

		if (allPortMap[sourcePortId]) {
			const portInfo = {
				...allPortMap[sourcePortId],
				pointIds: [...allPortMap[sourcePortId].pointIds],
			};

			const {
				pointIds: portPointIds,
			} = portInfo;

			const sourcePointIndex = portPointIds.indexOf(sourcePointId);

			if (sourcePointIndex !== -1) {
				portPointIds.splice(sourcePointIndex, 1);
			}

			allPortMap[sourcePortId] = portInfo;
		}

		if (allPortMap[targetPortId]) {

			const portInfo = {
				...allPortMap[targetPortId],
				pointIds: [...allPortMap[targetPortId].pointIds],
			};

			const {
				pointIds: portPointIds,
			} = portInfo;

			const targetPointIndex = portPointIds.indexOf(targetPointId);

			if (targetPointIndex !== -1) {
				portPointIds.splice(targetPointIndex, 1);
			}

			allPortMap[targetPortId] = portInfo;
		}

		return newState;
	}

	return state;
};

const insertPointToPath = (state, {
	x,
	y,
	index,
	pathId,
}) => {
	const pointId = getUniqueCode(state.points.allIds);

	const newPointModel = {
		id: pointId,
		pathId: pathId,
		x: x,
		y: y,
		isTarget: false,
		isSource: false,
	};

	return {
		...state,
		paths: {
			...state.paths,
			byId: {
				...state.paths.byId,
				[pathId]: {
					...state.paths.byId[pathId],
					pointIds: [
						...state.paths.byId[pathId].pointIds.slice(0, index),
						pointId,
						...state.paths.byId[pathId].pointIds.slice(index),
					],
				},
			},
			selectedIds: [],
		},
		points: {
			...state.points,
			byId: {
				...state.points.byId,
				[pointId]: newPointModel,
			},
			allIds: [
				...state.points.allIds,
				pointId,
			],
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
	switch (action.type) {
		case ACTION_UNDO:
			return undo(state);
		case ACTION_REDO:
			return redo(state);
		case ACTION_MOVE_CANVAS:
			return moveCanvas(state, action.payload);
		case ACTION_CREATE_MODULE:
			return createModule(state, action.payload);
		case ACTION_SELECT_MODULE:
			return selectModule(state, action.payload);
		case ACTION_MOVE_MODULE:
			return moveModule(state, action.payload);
		case ACTION_CREATE_PATH:
			return createPath(state, action.payload);
		case ACTION_SELECT_PATH:
			return selectPath(state, action.payload);
		case ACTION_SELECT_POINT:
			return selectPoint(state, action.payload);
		case ACTION_MOVE_POINT:
			return movePoint(state, action.payload);
		case ACTION_MOVE_POINT_BY_PORT:
			return movePointByPort(state, action.payload);
		case ACTION_ATTACH_POINT_TO_INPUT_PORT:
			return attachPointToInputPort(state, action.payload);
		case ACTION_REMOVE_PATH:
			return removePath(state, action.payload);
		case ACTION_INSERT_POINT_TO_PATH:
			return insertPointToPath(state, action.payload);
		case ACTION_DESELECT_ALL:
			return deSelectAll(state);
		default:
			return state;
	}
};

export default reducer;
