import React, {useCallback, useRef} from "react";
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
		onMoveModule,
		onSelect,
	} = props;

	const moduleRef = useRef(null);

	const handleSelect = useCallback((event) => {
		event.stopPropagation();
		onSelect(moduleId);
	}, [moduleId, onSelect]);

	useMoveAble(moduleRef, () => true, ({hasMoved, movementX, movementY}) => {
		onMoveModule({moduleId, hasMoved, movementX, movementY});
	});

	return (
		<div
			ref={moduleRef}
			className={classNames({
				[styles.hostNode]: true,
				[styles.selected]: isSelected,
			})}
			style={{
				top: `${offsetY}px`,
				left: `${offsetX}px`,
				backgroundColor: fillColor,
				width: `${width}px`,
			}}
			onMouseDown={handleSelect}
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
