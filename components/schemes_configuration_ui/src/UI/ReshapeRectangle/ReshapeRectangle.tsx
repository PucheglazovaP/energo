import { useCallback, useEffect, useState } from 'react';

import SelectedBorder from '../SelectedBorder';

import { ReshapeRectangleProps } from './types';

function ReshapeRectangle(props: ReshapeRectangleProps) {
	const {
		width,
		height,
		startX,
		startY,
		className,
		handleResizeEnd,
		handleDragEnd,
		onContextMenu,
	} = props;
	const [position, setPosition] = useState<{
		x: number;
		y: number;
	}>({
		x: startX,
		y: startY,
	});
	const [size, setSize] = useState<{
		width: number;
		height: number;
	}>({
		width: width,
		height: height,
	});

	const handleResize = (
		newX: number,
		newY: number,
		newWidth: number,
		newHeight: number,
	) => {
		setPosition({ x: newX, y: newY });
		setSize({ width: newWidth, height: newHeight });
	};
	const handleDrag = (newX: number, newY: number) => {
		setPosition({ x: newX, y: newY });
	};
	const handleKeyUp = useCallback(
		(e: KeyboardEvent) => {
			if (
				e.key === 'ArrowLeft' ||
				e.key === 'ArrowRight' ||
				e.key === 'ArrowUp' ||
				e.key === 'ArrowDown'
			) {
				handleDragEnd(position.x, position.y);
			}
		},
		[position, handleDragEnd],
	);

	const handleKeyPress = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowLeft':
				setPosition(({ x, y }) => ({ x: x - 1, y }));
				break;
			case 'ArrowRight':
				setPosition(({ x, y }) => ({ x: x + 1, y }));
				break;
			case 'ArrowUp':
				setPosition(({ x, y }) => ({ x, y: y - 1 }));
				break;
			case 'ArrowDown':
				setPosition(({ x, y }) => ({ x, y: y + 1 }));
		}
	};

	// Update intermediate position and size when original one is changed
	useEffect(() => {
		setPosition({ x: startX, y: startY });
		setSize({ width, height });
	}, [startX, startY, width, height]);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [handleKeyUp]);

	return (
		<SelectedBorder
			className={className}
			x={position.x}
			y={position.y}
			width={size.width}
			height={size.height}
			isSelected
			onDrag={handleDrag}
			onDragEnd={handleDragEnd}
			onResize={handleResize}
			onResizeEnd={handleResizeEnd}
		>
			{/* cuz <g>(root element of SelectedBorder doesn't support x,y,
				we need to add some component inside to make it change the appearance
			*/}
			<rect
				id={'reshape_rectangle_inner'}
				x={position.x}
				y={position.y}
				width={size.width}
				height={size.height}
				fill={'transparent'}
				onContextMenu={onContextMenu}
			/>
		</SelectedBorder>
	);
}

export default ReshapeRectangle;
