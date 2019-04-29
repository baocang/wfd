import React, {
	useCallback,
} from "react";

import classNames from "classnames";

import styles from "./index.module.scss";

import DiagramModulePort from "../DiagramModulePort";

import useDraggable from "../../hooks/useDraggable";

const DiagramModule = (props) => {

	const {
		heading,
		width,
		offsetY,
		offsetX,
		fillColor,
		isSelected,
		moduleId,
		inputPortMapper,
		outputPortMapper,

		onMouseDown,
		onDragStart,
		onDragMove,
		onDragEnd,

		onPortMouseUp,
		onPortMouseDown,

		onPortDragStart,
		onPortDragMove,
		onPortDragEnd,
	} = props;

	const mouseDownCallback = useCallback((event) => {
		onMouseDown && onMouseDown(event, {moduleId});
	}, [moduleId, onMouseDown]);

	const dragStartCallback = useCallback((event) => {
		onDragStart && onDragStart(event, {moduleId});
	}, [moduleId, onDragStart]);

	const dragMoveCallback = useCallback((event, {
		movementX,
		movementY,
	}) => {
		onDragMove && onDragMove(event, {
			moduleId,
			movementX,
			movementY,
		})
	}, [moduleId, onDragMove]);

	const dragEndCallback = useCallback((event, {
		movementX,
		movementY,
	}) => {
		onDragEnd && onDragEnd(event, {
			moduleId,
			movementX,
			movementY,
		});
	}, [moduleId, onDragEnd]);

	const [moduleRef] = useDraggable(dragStartCallback, dragMoveCallback, dragEndCallback);

	return (
		<div
			ref={moduleRef}
			className={classNames({
				[styles.hostNode]: true,
				[styles.selected]: isSelected,
			})}
			style={{
				width: `${width}px`,
				top: `${offsetY}px`,
				left: `${offsetX}px`,
				backgroundColor: fillColor,
			}}
			onMouseDown={mouseDownCallback}
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
								id,
								text,
							} = item;

							return (
								<DiagramModulePort
									key={index}
									mode={'in'}
									text={text}
									portId={id}
									onMouseUp={onPortMouseUp}
								/>
							);
						})
					}
				</div>
				<div className={styles.outputPorts}>
					{
						outputPortMapper(moduleId, (item, index) => {
							const {
								id,
								text,
							} = item;

							return (
								<DiagramModulePort
									key={index}
									mode={'out'}
									text={text}
									portId={id}
									onMouseDown={onPortMouseDown}
									onDragStart={onPortDragStart}
									onDragMove={onPortDragMove}
									onDragEnd={onPortDragEnd}
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
