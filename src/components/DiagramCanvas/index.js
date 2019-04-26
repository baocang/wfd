import React from "react";

import styles from "./index.module.scss";

import {
	ACTION_MOVE_CANVAS,
} from "../../constraints";

import useMoveAble from "../../hooks/useMoveAble";

const DiagramCanvas = (props) => {

	const {
		width,
		height,
		offsetX,
		offsetY,
		scale,
		dispatch,
	} = props;

	useMoveAble((event) => {
			return event.altKey;
		},
		({movementX, movementY}) => {
			dispatch({
				type: ACTION_MOVE_CANVAS,
				payload: {
					movementX,
					movementY,
				},
			});
		});

	const transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
	const layerStyle = {
		width: width,
		height: height,
		transform: transform,
	};

	return (
		<div className={styles.hostNode}>
			<svg className={styles.pathLayer} style={layerStyle}/>
			<div className={styles.widgetLayer} style={layerStyle}/>
		</div>
	);

};

export default DiagramCanvas;
