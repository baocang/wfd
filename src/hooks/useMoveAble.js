import {useEffect, useRef, useState} from "react";

const useMoveAble = (evaluate, callback) => {

	const hasMovedRef = useRef(false);
	const prevMousePosRef = useRef(null);

	const [allowMove, setAllowMove] = useState(false);

	useEffect(() => {
		const handleMouseDown = (event) => {
			event.stopPropagation();

			if (!prevMousePosRef.current) {
				prevMousePosRef.current = {
					x: event.clientX,
					y: event.clientY,
				};
			}
			if (evaluate(event)) {
				setAllowMove(true);
				hasMovedRef.current = false;
			}
		};

		window.addEventListener('mousedown', handleMouseDown);

		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
		};
	}, [evaluate]);

	useEffect(() => {
		const handleMouseUp = (event) => {
			event.stopPropagation();
			setAllowMove(false);
			hasMovedRef.current = false;
		};

		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	useEffect(() => {
		const handleMouseMove = (event) => {
			event.stopPropagation();

			if (allowMove) {
				const hasMoved = hasMovedRef.current;
				const movementX = event.clientX - prevMousePosRef.current.x;
				const movementY = event.clientY - prevMousePosRef.current.y;

				callback({hasMoved, movementX, movementY});

				hasMovedRef.current = true;
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
