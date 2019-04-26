import React from "react";

import styles from "./index.module.scss";

const DiagramToolBoxGroup = (props) => {

	const {
		heading,
		children,
	} = props;

	return (
		<div className={styles.hostNode}>
			<div className={styles.headerNode}>
				<h3 className={styles.titleNode}>{heading}</h3>
			</div>
			<ul className={styles.contentNode}>{children}</ul>
		</div>
	);

};

export default DiagramToolBoxGroup;
