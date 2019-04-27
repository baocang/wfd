import React, {useCallback} from "react";

import styles from "./index.module.scss";

import useMoveAble from "../../hooks/useMoveAble";
import DiagramModule from "../DiagramModule";
import DiagramConnectPath from "../DiagramConnectPath";
import DiagramControlPoint from "../DiagramControlPoint";

const DiagramCanvas = (props) => {

	const {
		width,
		height,
		offsetX,
		offsetY,
		scale,
		onDrop,
		onMoveCanvas,
		canvasRef,
		pathMapper,
		pathPointMapper,
		pathControlPointMapper,
		moduleMapper,
		inputPortMapper,
		outputPortMapper,
		onMoveModule,
		onSelectModule,
		onConnectPathMouseDown,
		onControlPointMouseDown,
	} = props;

	const handleDragOver = useCallback((event) => {
		event.preventDefault();
	}, []);

	const transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
	const layerStyle = {
		width: width,
		height: height,
		transform: transform,
	};

	useMoveAble(canvasRef, (event) => event.altKey, onMoveCanvas);

	return (
		<div className={styles.hostNode}
			 ref={canvasRef}
			 onDrop={onDrop}
			 onDragOver={handleDragOver}
		>
			<svg className={styles.pathLayer} style={layerStyle}>
				{
					pathMapper((item, index) => {
						const {
							id,
							curvy,
							isSelected,
						} = item;

						const points = pathPointMapper(id, (item) => item);

						return (
							<DiagramConnectPath
								key={index}
								pathId={id}
								points={points}
								curvy={curvy}
								isSelected={isSelected}
								onMouseDown={onConnectPathMouseDown}
							>
								{
									pathControlPointMapper(id, (item, index) => {
										const {
											id,
											x,
											y,
											isSelected,
										} = item;

										return (
											<DiagramControlPoint
												key={index}
												offsetX={x}
												offsetY={y}
												pointId={id}
												isSelected={isSelected}
												onMouseDown={onControlPointMouseDown}
											/>
										);
									})
								}
							</DiagramConnectPath>
						);
					})
				}
			</svg>
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
							isSelected,
						} = item;

						return (
							<DiagramModule
								key={index}
								moduleId={id}
								width={width}
								offsetX={offsetX}
								offsetY={offsetY}
								isSelected={isSelected}
								heading={heading}
								fillColor={fillColor}
								inputPortMapper={inputPortMapper}
								outputPortMapper={outputPortMapper}
								onMoveModule={onMoveModule}
								onSelect={onSelectModule}
							/>
						);
					})
				}
			</div>
		</div>
	);

};

export default DiagramCanvas;
