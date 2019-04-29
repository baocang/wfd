import React, {
	useCallback,
	useState,
} from "react";

import classNames from "classnames";

import styles from "./index.module.scss";
import useDraggable from "../../hooks/useDraggable";

const DiagramControlPoint = (props) => {

	const {
		pointId,
		offsetX = 0,
		offsetY = 0,
		radius = 5,
		isSelected,
		onClick,
		onMouseDown,
		onMouseUp,
		onDragStart,
		onDragMove,
		onDragEnd,
	} = props;

	const [isActive, setActive] = useState(false);

	const dragStartCallback = useCallback((event) => {
		onDragStart && onDragStart(event, {pointId});
	}, [pointId, onDragStart]);

	const dragMoveCallback = useCallback((event, {
		movementX,
		movementY,
	}) => {
		onDragMove && onDragMove(event, {
			pointId,
			movementX,
			movementY,
		});
	}, [pointId, onDragMove]);

	const dragEndCallback = useCallback((event, {
		movementX,
		movementY,
	}) => {
		onDragEnd && onDragEnd(event, {
			pointId,
			movementX,
			movementY,
		});
	}, [pointId, onDragEnd]);

	const [pointRef] = useDraggable(dragStartCallback, dragMoveCallback, dragEndCallback);

	return (
		<g
			ref={pointRef}
			className={classNames({
				[styles.hostNode]: true,
				[styles.selected]: isSelected || isActive,
			})}
			onClick={(event) => {
				onClick && onClick(event, {
					pointId,
				});
			}}
			onMouseDown={(event) => {
				onMouseDown && onMouseDown(event, {
					pointId,
				});
			}}
			onMouseUp={(event) => {
				onMouseUp && onMouseUp(event, {
					pointId,
				});
			}}
			onMouseEnter={() => {
				setActive(true);
			}}
			onMouseLeave={() => {
				setActive(false);
			}}
		>
			<circle className={styles.displayNode} cx={offsetX} cy={offsetY} r={radius}/>
			<circle className={styles.boundsNode} cx={offsetX} cy={offsetY} r={radius * 3}/>
		</g>
	);

};

export default DiagramControlPoint;
