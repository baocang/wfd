import React, {
	useCallback,
} from "react";

import classNames from "classnames";

import styles from "./index.module.scss";
import useDraggable from "../../hooks/useDraggable";

const DiagramModulePort = (props) => {

	const {
		mode,
		text,
		portId,
		onMouseUp,
		onMouseDown,
		onDragStart,
		onDragMove,
		onDragEnd,
	} = props;

	const mouseDownCallback = useCallback((event) => {
		onMouseDown && onMouseDown(event, {portId});
	}, [portId, onMouseDown]);

	const mouseUpCallback = useCallback((event) => {
		onMouseUp && onMouseUp(event, {portId});
	}, [portId, onMouseUp]);

	const dragStartCallback = useCallback((event) => {
		onDragStart && onDragStart(event, {portId});
	}, [portId, onDragStart]);

	const dragMoveCallback = useCallback((event, {
		movementX,
		movementY,
	}) => {
		onDragMove && onDragMove(event, {
			portId,
			movementX,
			movementY,
		});
	}, [portId, onDragMove]);

	const dragEndCallback = useCallback((event, {
		movementX,
		movementY,
	}) => {
		onDragEnd && onDragEnd(event, {
			portId,
			movementX,
			movementY,
		});
	}, [portId, onDragEnd]);

	const [portRef] = useDraggable(dragStartCallback, dragMoveCallback, dragEndCallback);

	return (
		<div
			ref={portRef}
			className={classNames({
				[styles.hostNode]: true,
				[styles.inputPort]: mode === "in",
				[styles.outputPort]: mode === "out",
			})}
			onMouseUp={mouseUpCallback}
			onMouseDown={mouseDownCallback}
		>
			<span
				className={styles.labelNode}
			>
				{text}
			</span>
		</div>
	);

};

export default DiagramModulePort;
