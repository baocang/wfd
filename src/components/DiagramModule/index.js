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
		moduleId,
		inputPortMapper,
		outputPortMapper,
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
					{
						inputPortMapper(moduleId, (item, index) => {
							const {
								text,
							} = item;

							return (
								<DiagramModulePort
									key={index}
									mode={'in'}
									text={text}
								/>
							);
						})
					}
				</div>
				<div className={styles.outputPorts}>
					{
						outputPortMapper(moduleId, (item, index) => {
							const {
								text,
							} = item;

							return (
								<DiagramModulePort
									key={index}
									mode={'out'}
									text={text}
								/>
							);
						})
					}
				</div>
			</div>
		</div>
	);

};

export default DiagramModule;
