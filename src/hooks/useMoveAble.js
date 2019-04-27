import {useLayoutEffect, useRef, useState} from "react";

const useMoveAble = (targetRef, evaluate, callback) => {

	const hasMovedRef = useRef(false);
	const prevMousePosRef = useRef(null);

	const [allowMove, setAllowMove] = useState(false);

	useLayoutEffect(() => {
		const {current: target} = targetRef;

		if (target) {
			const handleMouseDown = (event) => {
				// event.stopPropagation();

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

			target.addEventListener('mousedown', handleMouseDown);

			return () => {
				target.removeEventListener('mousedown', handleMouseDown);
			};
		}
	}, [targetRef, evaluate]);

	useLayoutEffect(() => {
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

	useLayoutEffect(() => {
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
