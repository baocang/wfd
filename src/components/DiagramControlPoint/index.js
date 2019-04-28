import React, {
	useState,
} from "react";

import classNames from "classnames";

import styles from "./index.module.scss";

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
	} = props;

	const [isActive, setActive] = useState(false);

	return (
		<g className={classNames({
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
