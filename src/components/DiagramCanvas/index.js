import React from "react";
import styles from "./index.module.scss";

const DiagramCanvas = (props) => {

	const {
		width,
		height,
		offsetX,
		offsetY,
		scale,
	} = props;

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
