import React from "react";
import classNames from "classnames";
import styles from "./index.module.scss";
import DiagramModulePort from "../DiagramModulePort";

const DiagramModule = (props) => {

	const {
		heading,
		width,
		offsetY,
		offsetX,
		fillColor,
	} = props;

	return (
		<div
			className={classNames({
				[styles.hostNode]: true,
			})}
			style={{
				top: `${offsetY}px`,
				left: `${offsetX}px`,
				backgroundColor: fillColor,
				width: `${width}px`,
			}}
		>
			<div
				className={styles.headerNode}
			>
				<h2 className={styles.titleNode}>{heading}</h2>
			</div>
			<div className={styles.contentNode}>
				<div className={styles.inputPorts}>
					<DiagramModulePort mode={'in'} labelText={'In'}/>
				</div>
				<div className={styles.outputPorts}>
					<DiagramModulePort mode={'out'} labelText={'Out'}/>
				</div>
			</div>
		</div>
	);

};

export default DiagramModule;
