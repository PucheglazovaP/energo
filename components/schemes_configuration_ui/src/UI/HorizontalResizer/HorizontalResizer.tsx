import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

import { HorizontalResizerProps } from './types';

import styles from './HorizontalResizer.module.css';

function HorizontalResizer({
	children,
	firstElementMinHeight,
	secondElementMinHeight,
	className,
}: HorizontalResizerProps) {
	const [topHeight, setTopHeight] = useState(50);

	const dragHandler = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			if (
				event.currentTarget.parentElement &&
				event.currentTarget.parentElement.parentElement
			) {
				const firstElementHeight =
					event.clientY -
					event.currentTarget.parentElement.getBoundingClientRect().top;
				const secondElementHeight =
					event.currentTarget.parentElement.getBoundingClientRect().height -
					firstElementHeight;
				const convertedFirstElementHeight =
					(firstElementHeight /
						event.currentTarget.parentElement.getBoundingClientRect().height) *
					100;
				if (
					convertedFirstElementHeight > 0 &&
					convertedFirstElementHeight !== topHeight &&
					firstElementHeight >= firstElementMinHeight &&
					secondElementHeight >= secondElementMinHeight
				) {
					setTopHeight(convertedFirstElementHeight);
				}
			}
		},
		[topHeight, firstElementMinHeight, secondElementMinHeight],
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
		<div className={clsx(styles.root, className)}>
			<div
				style={{
					height: `${topHeight}%`,
					width: '100%',
				}}
			>
				{children[0]}
			</div>
			<div
				className={styles.resizer}
				draggable={true}
				onDrag={dragHandler}
				onDragStart={handleDragStart}
			/>
			<div
				style={{
					height: `${100 - topHeight}%`,
					width: '100%',
				}}
			>
				{children[1]}
			</div>
		</div>
	);
}

export default HorizontalResizer;
