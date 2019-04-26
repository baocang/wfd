import React from "react";

export const UndoIcon = (props) => (
	<svg
		{...props}
		viewBox="0 0 1024 1024"
	>
		<path
			fill="#87DD00"
			stroke="#398A01"
			strokeWidth="30"
			d="M777.856,1024 C891.58144,817.9712 910.75072,503.68512 464,514.17088 L464,768 L80,384 L464,0 L464,248.38144 C998.95808,234.43456 1058.57536,720.5888 777.856,1024 Z"/>
	</svg>
);

export const RedoIcon = (props) => (
	<svg
		{...props}
		viewBox="0 0 1024 1024"
	>
		<path
			fill="#87DD00"
			stroke="#398A01"
			strokeWidth="30"
			d="M560,248.384 L560,0 L944,384 L560,768 L560,514.176 C113.248,503.68 132.416,817.952 246.144,1024 C-34.56,720.576 25.056,234.432 560,248.384 Z"/>
	</svg>
);
