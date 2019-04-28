import React from "react";

import styles from "./index.module.scss";

import {
	UndoIcon,
	RedoIcon,
} from '../../icons/AppIcons';

const AppToolBar = (props) => {

	const {
		onUndo,
		onRedo,
	} = props;

	return (
		<div className={styles.hostNode}>
			<div className={styles.group}>
				<div
					className={styles.item}
					onClick={onUndo}
				>
					<UndoIcon
						className={styles.itemIcon}
					/>
					<span
						className={styles.itemText}
					>
						Undo
					</span>
				</div>
				<div className={styles.divider}/>
				<div
					className={styles.item}
					onClick={onRedo}
				>
					<RedoIcon
						className={styles.itemIcon}
					/>
					<span
						className={styles.itemText}
					>
						Redo
					</span>
				</div>
			</div>
			<div className={styles.spacing}/>
			<div className={styles.group}>
				<div
					className={styles.item}
					onClick={onUndo}
				>
					<UndoIcon
						className={styles.itemIcon}
					/>
					<span
						className={styles.itemText}
					>
						Undo
					</span>
				</div>
				<div className={styles.divider}/>
				<div
					className={styles.item}
					onClick={onRedo}
				>
					<RedoIcon
						className={styles.itemIcon}
					/>
					<span
						className={styles.itemText}
					>
						Redo
					</span>
				</div>
			</div>
		</div>
	);

};

export default AppToolBar;
