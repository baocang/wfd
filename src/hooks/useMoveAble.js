import {
	useEffect,
	useRef,
} from "react";

let mutexLocked = false;

const useMoveAble = (moveCallback, endCallback) => {

	const targetRef = useRef(null);
	const mouseDownEventRef = useRef(null);

	useEffect(() => {
		const target = targetRef.current;

		if (target) {
			const handleMouseDown = (event) => {
				if (!mutexLocked) {
					mutexLocked = true;
					mouseDownEventRef.current = event;
				}
			};

			target.addEventListener('mousedown', handleMouseDown);

			return () => {
				target.removeEventListener('mousedown', handleMouseDown);
			};
		}
	}, [targetRef]);

	useEffect(() => {
		const handleMouseMove = (event) => {
			if (mouseDownEventRef.current) {
				const {
					clientX,
					clientY
				} = mouseDownEventRef.current;

				moveCallback && moveCallback(event, {
					x: event.clientX - clientX,
					y: event.clientY - clientY,
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
			if (mouseDownEventRef.current) {
				const {
					clientX,
					clientY
				} = mouseDownEventRef.current;

				endCallback && endCallback(event, {
					x: event.clientX - clientX,
					y: event.clientY - clientY,
				});

				mutexLocked = false;
				mouseDownEventRef.current = null;
			}
		};

		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [endCallback]);

	return [targetRef];

};

export default useMoveAble;
