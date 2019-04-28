import React from "react";

import styles from "./index.module.scss";

import DiagramToolBoxGroup from "../AppToolBoxGroup";
import DiagramToolBoxItem from "../AppToolBoxItem";

const DiagramToolBox = (props) => {

	const {
		onItemDragStart,
	} = props;

	return (
		<div className={styles.hostNode}>
			<div className={styles.scrollNode}>
				{
					props.data.map((group, groupIndex) => {
						const {
							heading,
						} = group;

						return (
							<DiagramToolBoxGroup
								key={groupIndex}
								heading={heading}
							>
								{
									group.items.map((item, itemIndex) => {
										const {
											heading,
											fillColor,
											textColor,
										} = item;

										return (
											<DiagramToolBoxItem
												key={itemIndex}
												index={itemIndex}
												groupIndex={groupIndex}
												heading={heading}
												fillColor={fillColor}
												textColor={textColor}
												onDragStart={onItemDragStart}
											/>
										);
									})
								}
							</DiagramToolBoxGroup>
						);
					})
				}
			</div>
		</div>

	);

};

export default DiagramToolBox;
