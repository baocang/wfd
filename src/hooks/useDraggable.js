import {
	useEffect,
	useRef,
} from "react";

let mutex = {
	locked: false,
};

const useDraggable = (startCallback, moveCallback, endCallback) => {

	const targetRef = useRef(null);
	const mouseEventRef = useRef(null);

	useEffect(() => {
		const target = targetRef.current;

		if (target) {
			const handleMouseDown = (event) => {
				if (!mutex.locked) {
					mutex.locked = true;
					mouseEventRef.current = event;
					startCallback && startCallback(event);
				}
			};

			target.addEventListener('mousedown', handleMouseDown);

			return () => {
				target.removeEventListener('mousedown', handleMouseDown);
			};
		}
	}, [startCallback]);

	useEffect(() => {
		const handleMouseMove = (event) => {
			if (mouseEventRef.current) {
				const {
					clientX,
					clientY
				} = mouseEventRef.current;

				mouseEventRef.current = event;

				moveCallback && moveCallback(event, {
					movementX: event.clientX - clientX,
					movementY: event.clientY - clientY,
				});
			}
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, [moveCallback]);

	useEffect(() => {
		const handleMouseUp = (event) => {
			if (mouseEventRef.current) {
				const {
					clientX,
					clientY
				} = mouseEventRef.current;

				endCallback && endCallback(event, {
					movementX: event.clientX - clientX,
					movementY: event.clientY - clientY,
				});

				mutex.locked = false;
				mouseEventRef.current = null;
			}
		};

		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [endCallback]);

	return [targetRef];

};

export default useDraggable;
