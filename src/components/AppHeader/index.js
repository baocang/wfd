import React from "react";

import styles from "./index.module.scss";

const AppHeader = (props) => {

	const {
		heading,
		children,
	} = props;

	return (
		<div className={styles.hostNode}>
			<h1 className={styles.titleNode}>
				{heading}
			</h1>
			<div className={styles.contentNode}>
				{children}
			</div>
		</div>
	);

};

export default AppHeader;
