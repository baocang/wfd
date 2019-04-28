import React, {
	useCallback,
	useState,
} from "react";

import classNames from "classnames";

import styles from "./index.module.scss";

import DiagramModulePort from "../DiagramModulePort";

import useMoveAble from "../../hooks/useMoveAble";

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
		onMoved,
		onMouseDown,
	} = props;

	const [translate, setTranslate] = useState({
		x: offsetX,
		y: offsetY,
	});

	const mouseDownCallback = useCallback((event) => {
		event.stopPropagation();
		onMouseDown(event, {moduleId});
	}, [moduleId, onMouseDown]);

	const moveCallback = useCallback((event, {x, y}) => {
		setTranslate({
			x: offsetX + x,
			y: offsetY + y
		});
	}, [offsetX, offsetY]);

	const endMoveCallback = useCallback((event, {x, y}) => {
		if (x || y) {
			onMoved && onMoved(event, {
				moduleId,
				movementX: x,
				movementY: y,
			});
		}
	}, [moduleId, onMoved]);

	const [moduleRef] = useMoveAble(moveCallback, endMoveCallback);

	return (
		<div
			ref={moduleRef}
			className={classNames({
				[styles.hostNode]: true,
				[styles.selected]: isSelected,
			})}
			style={{
				width: `${width}px`,
				backgroundColor: fillColor,
				transform: `translate(${translate.x}px, ${translate.y}px)`,
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
