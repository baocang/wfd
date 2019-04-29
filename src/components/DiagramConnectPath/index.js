import React, {
	useCallback,
	useState,
} from "react";

import classNames from "classnames";

import styles from "./index.module.scss";

import {
	generateSvgPathData
} from "../../commons/BezierCurve";

const DiagramConnectPath = (props) => {

	const {
		curvy,
		strokeWidth = 15,
		children,
		isSelected,
		pathId,
		points,
		onClick,
		onDoubleClick,
		onMouseDown,
		onMouseUp,
	} = props;

	const pathData = generateSvgPathData(points, curvy);

	const [isActive, setActive] = useState(false);

	const handleClick = useCallback((event) => {
		onClick && onClick(event, {
			pathId,
		});
	}, [pathId, onClick]);

	const handleDoubleClick = useCallback((event) => {
		onDoubleClick && onDoubleClick(event, {
			pathId,
			strokeWidth,
		});
	}, [pathId, strokeWidth, onDoubleClick]);

	const handleMouseUp = useCallback((event) => {
		onMouseUp && onMouseUp(event, {
			pathId,
			strokeWidth,
		});
	}, [pathId, strokeWidth, onMouseUp]);

	const handleMouseDown = useCallback((event) => {
		onMouseDown && onMouseDown(event, {
			pathId,
			strokeWidth,
		});
	}, [pathId, strokeWidth, onMouseDown]);

	const handleMouseEnter = useCallback(() => {
		setActive(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setActive(false);
	}, []);

	return (
		<g
			className={classNames({
				[styles.hostNode]: true,
				[styles.selected]: isSelected || isActive,
			})}
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			onMouseUp={handleMouseUp}
			onMouseDown={handleMouseDown}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<path
				className={styles.displayNode}
				d={pathData}
			/>
			<path
				className={styles.boundsNode}
				d={pathData}
			/>
			{children}
		</g>
	);

};

export default DiagramConnectPath;
