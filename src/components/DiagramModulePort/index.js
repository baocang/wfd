import React from "react";

import classNames from "classnames";

import styles from "./index.module.scss";

const DiagramModulePort = (props) => {

	const {
		mode,
		text,
	} = props;

	return (

		<div
			className={classNames({
				[styles.hostNode]: true,
				[styles.inputPort]: mode === "in",
				[styles.outputPort]: mode === "out",
			})}
		>
			<span
				className={styles.labelNode}
			>
				{text}
			</span>
		</div>
	);

};

export default DiagramModulePort;
