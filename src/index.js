import React from 'react';
import ReactDOM from 'react-dom';

import './index.module.scss';

import AppShell from './AppShell';

import * as serviceWorker from './serviceWorker';

const root = document.getElementById("root");

ReactDOM.render(<AppShell/>, root, () => {
	setTimeout(() => {
		root.classList.remove("unresolved");
	}, 10);
});

if ("hot" in module) {
	module.hot.accept("./AppShell", () => {
		ReactDOM.render(<AppShell/>, root);
	});
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
