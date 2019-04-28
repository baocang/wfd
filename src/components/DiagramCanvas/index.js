import React, {
	useCallback,
	useState,
} from "react";

import styles from "./index.module.scss";

import DiagramModule from "../DiagramModule";
import DiagramConnectPath from "../DiagramConnectPath";
import DiagramControlPoint from "../DiagramControlPoint";

import useMoveAble from "../../hooks/useMoveAble";

const DiagramCanvas = (props) => {

	const {
		width,
		height,
		offsetX,
		offsetY,
		scale,
		pathMapper,
		pathPointMapper,
		pathControlPointMapper,
		moduleMapper,
		inputPortMapper,
		outputPortMapper,
		onDrop,
		onMoved,
		onMouseDown,
		onModuleMoved,
		onModuleMouseDown,
		onConnectPathMouseDown,
		onControlPointMouseDown,
	} = props;

	const [translate, setTranslate] = useState({
		x: offsetX,
		y: offsetY,
	});

	const dragOverCallback = useCallback((event) => {
		event.preventDefault();
	}, []);

	const mouseDownCallback = useCallback((event) => {
		onMouseDown(event);
	}, [onMouseDown]);

	const moveCallback = useCallback((event, movement) => {
		setTranslate({
			x: offsetX + movement.x,
			y: offsetY + movement.y
		});
	}, [offsetX, offsetY]);

	const endMoveCallback = useCallback((event, movement) => {
		if (movement.x || movement.y) {
			onMoved && onMoved(event, {
				x: movement.x + offsetX,
				y: movement.y + offsetY,
				movementX: movement.x,
				movementY: movement.y,
			});
		}
	}, [offsetX, offsetY, onMoved]);

	const [canvasRef] = useMoveAble(moveCallback, endMoveCallback);

	const transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
	const layerStyle = {
		width: width,
		height: height,
		transform: transform,
	};

	return (
		<div
			ref={canvasRef}
			className={styles.hostNode}
			onDrop={onDrop}
			onDragOver={dragOverCallback}
			onMouseDown={mouseDownCallback}
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
								onMoved={onModuleMoved}
								onMouseDown={onModuleMouseDown}
							/>
						);
					})
				}
			</div>
		</div>
	);

};

export default DiagramCanvas;
