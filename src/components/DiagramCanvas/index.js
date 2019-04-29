import React, {
	useCallback,
} from "react";

import styles from "./index.module.scss";

import DiagramModule from "../DiagramModule";
import DiagramConnectPath from "../DiagramConnectPath";
import DiagramControlPoint from "../DiagramControlPoint";

import useDraggable from "../../hooks/useDraggable";

const DiagramCanvas = (props) => {

	const {
		width,
		height,
		offsetX,
		offsetY,
		pathMapper,
		pathPointMapper,
		pathControlPointMapper,
		moduleMapper,
		inputPortMapper,
		outputPortMapper,
		onDrop,
		onDragStart,
		onDragMove,
		onDragEnd,
		onMouseDown,

		onModuleDragStart,
		onModuleDragMove,
		onModuleDragEnd,
		onModuleMouseDown,

		onModulePortMouseUp,
		onModulePortMouseDown,

		onModulePortDragStart,
		onModulePortDragMove,
		onModulePortDragEnd,

		onConnectPathMouseDown,
		onControlPointMouseDown,
	} = props;

	const dragStartCallback = useCallback((event) => {
		onDragStart && onDragStart(event);
	}, [onDragStart]);

	const dragMoveCallback = useCallback((event, {
		movementX,
		movementY,
	}) => {
		onDragMove && onDragMove(event, {
			movementX,
			movementY,
		});
	}, [onDragMove]);

	const dragEndCallback = useCallback((event, {
		movementX,
		movementY,
	}) => {
		onDragEnd && onDragEnd(event, {
			movementX,
			movementY,
		});
	}, [onDragEnd]);

	const [canvasRef] = useDraggable(dragStartCallback, dragMoveCallback, dragEndCallback);

	const dragOverCallback = useCallback((event) => {
		event.preventDefault();
	}, []);

	const mouseDownCallback = useCallback((event) => {
		onMouseDown && onMouseDown(event);
	}, [onMouseDown]);

	const modulePortMouseUpCallback = useCallback((event, {portId}) => {
		const canvas = canvasRef.current;

		if (canvas && onModulePortMouseUp) {
			const [{
				x: canvasX,
				y: canvasY,
			}] = canvas.getClientRects();

			onModulePortMouseUp(event, {
				portId,
				canvasX,
				canvasY,
			});
		}
	}, [onModulePortMouseUp]);

	const modulePortMouseDownCallback = useCallback((event, {portId}) => {
		onModulePortMouseDown && onModulePortMouseDown(event, {portId});
	}, [onModulePortMouseDown]);

	const modulePortDragStartCallback = useCallback((event, {portId}) => {
		const canvas = canvasRef.current;

		if (canvas && onModulePortDragStart) {
			const [{
				x: canvasX,
				y: canvasY,
			}] = canvas.getClientRects();

			onModulePortDragStart(event, {
				portId,
				canvasX,
				canvasY,
			});
		}
	}, [canvasRef, onModulePortDragStart]);

	const modulePortDragMoveCallback = useCallback((event, {
		portId,
		movementX,
		movementY,
	}) => {
		const canvas = canvasRef.current;

		if (canvas && onModulePortDragMove && (movementX || movementY)) {
			const [{
				x: canvasX,
				y: canvasY,
			}] = canvas.getClientRects();

			onModulePortDragMove(event, {
				portId,
				canvasX,
				canvasY,
				movementX,
				movementY,
			});
		}
	}, [canvasRef, onModulePortDragMove]);

	const modulePortDragEndCallback = useCallback((event, {
		portId,
		movementX,
		movementY,
	}) => {
		const canvas = canvasRef.current;

		if (canvas && onModulePortDragEnd) {
			const [{
				x: canvasX,
				y: canvasY,
			}] = canvas.getClientRects();

			onModulePortDragEnd(event, {
				portId,
				canvasX,
				canvasY,
				movementX,
				movementY,
			});
		}
	}, [canvasRef, onModulePortDragEnd]);

	const layerStyle = {
		width: width,
		height: height,
		top: `${offsetY}px`,
		left: `${offsetX}px`,
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

								onMouseDown={onModuleMouseDown}
								onDragStart={onModuleDragStart}
								onDragMove={onModuleDragMove}
								onDragEnd={onModuleDragEnd}

								onPortMouseUp={modulePortMouseUpCallback}
								onPortMouseDown={modulePortMouseDownCallback}

								onPortDragStart={modulePortDragStartCallback}
								onPortDragMove={modulePortDragMoveCallback}
								onPortDragEnd={modulePortDragEndCallback}
							/>
						);
					})
				}
			</div>
		</div>
	);

};

export default DiagramCanvas;
