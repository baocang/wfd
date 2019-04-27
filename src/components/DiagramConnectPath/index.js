import React, {useCallback, useState} from "react";
import classNames from "classnames";

import {
	generateSvgPathData
} from "../../commons/BezierCurve";

import styles from "./index.module.scss";

const DiagramConnectPath = (props) => {

	const {
		curvy,
		strokeWidth,
		children,
		isSelected,
		pathId,
		points,
		onClick,
		onDoubleClick,
		onMouseDown,
		onMouseUp,
	} = props;

	const [isActive, setActive] = useState(false);

	const handleMouseEnter = useCallback(() => {
		setActive(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setActive(false);
	}, []);

	const pathData = generateSvgPathData(points, curvy);

	return (
		<g
			className={classNames({
				[styles.hostNode]: true,
				[styles.selected]: isSelected || isActive,
			})}
			onClick={(event) => {
				onClick && onClick(event, {
					pathId,
				});
			}}
			onDoubleClick={(event) => {
				onDoubleClick && onDoubleClick(event, {
					pathId,
					strokeWidth,
				});
			}}
			onMouseDown={(event) => {
				onMouseDown && onMouseDown(event, {
					pathId,
					strokeWidth,
				});
			}}
			onMouseUp={(event) => {
				onMouseUp && onMouseUp(event, {
					pathId,
					strokeWidth,
				});
			}}
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
