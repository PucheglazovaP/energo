import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { VerticalResizerProps } from './types';

import styles from './VerticalResizer.module.css';

function VerticalResizer({
	children,
	firstElementMinWidth,
	secondElementMinWidth,
	leftElementWidth = 20,
}: VerticalResizerProps) {
	const [leftWidth, setLeftWidth] = useState(leftElementWidth);

	useEffect(() => {
		setLeftWidth(leftElementWidth);
	}, [leftElementWidth]);

	const dragHandler = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			if (
				event.currentTarget.parentElement &&
				event.currentTarget.parentElement.parentElement
			) {
				const firstElementWidth =
					event.clientX -
					event.currentTarget.parentElement.getBoundingClientRect().left;
				const secondElementWidth =
					event.currentTarget.parentElement.getBoundingClientRect().width -
					firstElementWidth;
				const convertedFirstElementWidth =
					(firstElementWidth /
						event.currentTarget.parentElement.getBoundingClientRect().width) *
					100;
				if (
					convertedFirstElementWidth > 0 &&
					convertedFirstElementWidth !== leftWidth &&
					firstElementWidth >= firstElementMinWidth &&
					secondElementWidth >= secondElementMinWidth
				) {
					setLeftWidth(convertedFirstElementWidth);
				}
			}
		},
		[leftWidth, firstElementMinWidth, secondElementMinWidth],
	);

	const img = useMemo(() => {
		const img = new Image();
		img.src =
			'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
		return img;
	}, []);

	const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		// способ убрать ghostImage
		event.dataTransfer.setDragImage(img, 0, 0);
	};

	return (
		<div className={styles.root}>
			<div
				style={{
					width: `${leftWidth}%`,
				}}
				className={styles.part}
			>
				{children[0]}
			</div>
			{leftWidth > 0 && (
				<div
					className={styles.resizer}
					draggable={true}
					onDrag={dragHandler}
					onDragStart={handleDragStart}
				/>
			)}

			<div
				style={{
					width: `${100 - leftWidth}%`,
				}}
				className={styles.part}
			>
				{children[1]}
			</div>
		</div>
	);
}

export default VerticalResizer;
