import React, {useCallback} from "react";

import styles from "./index.module.scss";

import useMoveAble from "../../hooks/useMoveAble";
import DiagramModule from "../DiagramModule";

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
		moduleMapper,
		inputPortMapper,
		outputPortMapper,
		onMoveModule,
		onSelectModule,
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

	useMoveAble(canvasRef,(event) => event.altKey, onMoveCanvas);

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
