import React, {
	useCallback,
} from "react";

import styles from "./index.module.scss";

const DiagramToolBoxItem = (props) => {

	const {
		heading,
		index,
		groupIndex,
		fillColor,
		textColor,
		onDragStart,
	} = props;

	const handleDragStart = useCallback((event) => {
		event.detail = {
			groupIndex,
			itemIndex: index,
		};
		onDragStart(event);
	}, [index, groupIndex, onDragStart]);

	return (
		<li className={styles.hostNode}
			style={{
				color: textColor,
				backgroundColor: fillColor,
			}}
			draggable={true}
			onDragStart={handleDragStart}
		>
			{heading}
		</li>
	);

};

export default DiagramToolBoxItem;
