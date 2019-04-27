import React from "react";
import classNames from "classnames";
import styles from "./index.module.scss";

const DiagramModulePort = (props) => {

	const {
		labelText,
		mode,
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
				{labelText}
			</span>
		</div>
	);

};

export default DiagramModulePort;
