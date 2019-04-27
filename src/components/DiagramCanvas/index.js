import React, {useCallback} from "react";

import styles from "./index.module.scss";

import {
	ACTION_MOVE_CANVAS, ACTION_RECORD_MOVE_CANVAS,
} from "../../constraints";

import useMoveAble from "../../hooks/useMoveAble";
import DiagramModule from "../DiagramModule";

const DiagramCanvas = (props) => {

	const {
		width,
		height,
		offsetX,
		offsetY,
		scale,
		dispatch,
		onDrop,
		canvasRef,
		moduleMapper,
		inputPortMapper,
		outputPortMapper,
	} = props;

	useMoveAble((event) => {
			return event.altKey;
		},
		({hasMoved, movementX, movementY}) => {
			if (!hasMoved) {
				dispatch({
					type: ACTION_RECORD_MOVE_CANVAS,
				});
			}
			dispatch({
				type: ACTION_MOVE_CANVAS,
				payload: {
					movementX,
					movementY,
				},
			});
		});

	const handleDragOver = useCallback((event) => {
		event.preventDefault();
	}, []);

	const transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
	const layerStyle = {
		width: width,
		height: height,
		transform: transform,
	};

	return (
		<div className={styles.hostNode}
			 ref={canvasRef}
			 onDrop={onDrop}
			 onDragOver={handleDragOver}
		>
			<svg className={styles.pathLayer} style={layerStyle}/>
			<div className={styles.widgetLayer} style={layerStyle}>
				{
					moduleMapper((item, index) => {
						const {
							id,
							width,
							offsetX,
							offsetY,
							heading,
							fillColor,
						} = item;

						return (
							<DiagramModule
								key={index}
								moduleId={id}
								width={width}
								offsetX={offsetX}
								offsetY={offsetY}
								heading={heading}
								fillColor={fillColor}
								inputPortMapper={inputPortMapper}
								outputPortMapper={outputPortMapper}
							/>
						);
					})
				}
			</div>
		</div>
	);

};

export default DiagramCanvas;
