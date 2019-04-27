export function generateSvgPathData(points, curvy) {
	let pathData = [];

	for (let i = 0; i < points.length - 1; i++) {
		const firstPoint = points[i];
		const secondPoint = points[i + 1];

		if (i === 0) {
			pathData = ["M", firstPoint.x, firstPoint.y, "C"];
		}

		pathData.push(firstPoint.x + curvy, firstPoint.y);
		pathData.push(secondPoint.x - curvy, secondPoint.y);
		pathData.push(secondPoint.x, secondPoint.y);
	}

	return pathData.join(" ");
}

export function generateRoundedRect(x, y, width, height, radius) {
	return "M" + x + "," + y
		+ "h" + (width - radius)
		+ "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
		+ "v" + (height - 2 * radius)
		+ "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
		+ "h" + (radius - width)
		+ "z";
}

export function travelCurve(points, curvy, callback, step = 0.001) {
	for (let t = 0; t <= 1; t += step) {
		for (let index = 1, length = points.length; index < length; index++) {
			let origin = points[index - 1];
			let destination = points[index];
			let controlPoint1 = {
				x: origin.x + curvy,
				y: origin.y,
			};
			let controlPoint2 = {
				x: destination.x - curvy,
				y: destination.y,
			};

			let x = Math.pow(1 - t, 3) * origin.x + 3.0 * Math.pow(1 - t, 2) * t * controlPoint1.x + 3.0 * (1 - t) * t * t * controlPoint2.x + t * t * t * destination.x;
			let y = Math.pow(1 - t, 3) * origin.y + 3.0 * Math.pow(1 - t, 2) * t * controlPoint1.y + 3.0 * (1 - t) * t * t * controlPoint2.y + t * t * t * destination.y;

			if (callback(x, y, index)) {
				return index;
			}
		}
	}

	return -1;
}

export function indexOfPointInCurve(points, position, curvy, strokeWidth) {
	const tolerance = strokeWidth / 2;

	return travelCurve(points, curvy, (x1, y1) => {
		return Math.abs(x1 - position.x) < tolerance && Math.abs(y1 - position.y) < tolerance;
	});
}
