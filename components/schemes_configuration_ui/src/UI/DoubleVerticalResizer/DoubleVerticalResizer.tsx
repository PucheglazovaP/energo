import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DoubleVerticalResizerProps } from './types';

import styles from './DoubleVerticalResizer.module.css';

function DoubleVerticalResizer({
	children,
	leftElementMinWidth,
	rightElementMinWidth,
	leftElementMaxWidth = 100,
	rightElementMaxWidth = 100,
	leftElementDefaultWidth,
	rightElementDefaultWidth,
}: DoubleVerticalResizerProps) {
	const [leftWidth, setLeftWidth] = useState(
		leftElementDefaultWidth || leftElementMinWidth,
	);
	const [rightWidth, setRightWidth] = useState(
		rightElementDefaultWidth || rightElementMinWidth,
	);

	useEffect(() => {
		setLeftWidth(leftElementDefaultWidth || leftElementMinWidth);
		setRightWidth(rightElementDefaultWidth || rightElementMinWidth);
	}, [
		leftElementMinWidth,
		rightElementMinWidth,
		leftElementDefaultWidth,
		rightElementDefaultWidth,
	]);

	const dragHandler = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			if (
				event.currentTarget.parentElement &&
				event.currentTarget.parentElement.parentElement &&
				event.clientX !== 0
			) {
				if (event.currentTarget?.id === 'resizerLeft') {
					const leftElementWidth =
						event.clientX -
						event.currentTarget.parentElement.getBoundingClientRect().left;

					const convertedLeftElementWidth =
						(leftElementWidth /
							event.currentTarget.parentElement.getBoundingClientRect().width) *
						100;

					const isResizeAllowed: boolean =
						convertedLeftElementWidth > 0 &&
						convertedLeftElementWidth !== leftWidth &&
						convertedLeftElementWidth >= leftElementMinWidth &&
						convertedLeftElementWidth <= leftElementMaxWidth;

					if (isResizeAllowed) {
						setLeftWidth(convertedLeftElementWidth);
					}
				}
				if (event.currentTarget?.id === 'resizerRight') {
					const rightElementWidth = Math.abs(
						event.currentTarget.parentElement.getBoundingClientRect().right -
							event.clientX,
					);
					const convertedRightElementWidth =
						(rightElementWidth /
							event.currentTarget.parentElement.getBoundingClientRect().width) *
						100;
					const isResizeAllowed: boolean =
						convertedRightElementWidth > 0 &&
						convertedRightElementWidth !== leftWidth &&
						convertedRightElementWidth >= leftElementMinWidth &&
						convertedRightElementWidth <= rightElementMaxWidth;

					if (isResizeAllowed) {
						setRightWidth(convertedRightElementWidth);
					}
				}
			}
		},
		[leftWidth, rightWidth, rightElementMinWidth, leftElementMinWidth],
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
				className={styles.content_wrapper}
				style={{
					width: `${leftWidth}%`,
				}}
			>
				{children[0]}
			</div>
			{leftWidth > 0 && (
				<div
					id="resizerLeft"
					className={styles.resizer}
					draggable={true}
					onDrag={dragHandler}
					onDragStart={handleDragStart}
				/>
			)}

			<div className={styles.content_wrapper_centered}>{children[1]}</div>

			{rightWidth > 0 && (
				<div
					id="resizerRight"
					className={styles.resizer}
					draggable={true}
					onDrag={dragHandler}
					onDragStart={handleDragStart}
				/>
			)}
			<div
				className={styles.content_wrapper}
				style={{
					width: `${rightWidth}%`,
				}}
			>
				{children[2]}
			</div>
		</div>
	);
}

export default DoubleVerticalResizer;
