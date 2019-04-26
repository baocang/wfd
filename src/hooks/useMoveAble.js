import {useEffect, useRef, useState} from "react";

const useMoveAble = (evaluate, callback) => {

	const prevMousePosRef = useRef(null);

	const [allowMove, setAllowMove] = useState(false);

	useEffect(() => {
		const handleMouseDown = (event) => {
			if (!prevMousePosRef.current) {
				prevMousePosRef.current = {
					x: event.clientX,
					y: event.clientY,
				};
			}
			if (evaluate(event)) {
				setAllowMove(true);
			}
		};

		window.addEventListener('mousedown', handleMouseDown);

		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
		};
	}, [evaluate]);

	useEffect(() => {
		const handleMouseUp = (event) => {
			setAllowMove(false);
		};

		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	useEffect(() => {
		const handleMouseMove = (event) => {
			if (allowMove) {
				callback({
					movementX: event.clientX - prevMousePosRef.current.x,
					movementY: event.clientY - prevMousePosRef.current.y
				});
			}
			prevMousePosRef.current = {
				x: event.clientX,
				y: event.clientY,
			};
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, [allowMove, callback]);

};

export default useMoveAble;
