import React from "react";

import styles from "./index.module.scss";

const DiagramToolBoxItem = (props) => {

	const {
		heading,
		fillColor,
		textColor,
		onDragStart,
	} = props;

	return (
		<li className={styles.hostNode}
			style={{
				color: textColor,
				backgroundColor: fillColor,
			}}
			draggable={true}
			onDragStart={onDragStart}
		>
			{heading}
		</li>
	);

};

export default DiagramToolBoxItem;
