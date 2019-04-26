import React from "react";

import styles from "./index.module.scss";
import DiagramToolBoxGroup from "../AppToolBoxGroup";
import DiagramToolBoxItem from "../AppToolBoxItem";

const DiagramToolBox = (props) => {

	return (
		<div className={styles.hostNode}>
			<div className={styles.scrollNode}>
				{
					props.data.map((group, index) => {
						const {
							heading,
						} = group;

						return (
							<DiagramToolBoxGroup
								key={index}
								heading={heading}
							>
								{
									group.items.map((item, index) => {
										const {
											heading,
											fillColor,
											textColor,
										} = item;

										return (
											<DiagramToolBoxItem
												key={index}
												heading={heading}
												fillColor={fillColor}
												textColor={textColor}
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
