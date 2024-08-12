import { useEffect, useRef, useState } from 'react';
import React from 'react';

import { ActionType, SelectedBorderProps } from './types';

import styles from './SelectedBorder.module.css';

function SelectedBorder({
	x,
	y,
	width,
	height,
	onResize,
	onDrag,
	onDragStart = () => {},
	onDragEnd = () => {},
	onResizeStart = () => {},
	onResizeEnd = () => {},
	children,
	isSelected,
	checkboxSize = 0,
	isActionsDisabled = false,
	className,
}: SelectedBorderProps) {
	const objectRef = useRef<SVGGElement>(null);

	const [isDragging, setIsDragging] = useState(false);

	// Value to differentiate 2D coords when moving element
	const dragPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

	const handleDragMove = useRef((e: MouseEvent) => {
		if (!objectRef.current) {
			return;
		}
		e.preventDefault();
		let { pageX, pageY } = e;
		// Trick to get the svg relative to the <g> element
		const svgField: SVGSVGElement = objectRef.current
			.parentElement as unknown as SVGSVGElement;
		if (svgField == undefined) {
			return;
		}
		// Trace first change in the movement to indicate that drag is started
		if (!dragPosition.current.x || !dragPosition.current.y) {
			onDragStart();
		}
		// Find diff between prev and curr movement based on viewport
		const xDiff: number = dragPosition.current.x
			? pageX - dragPosition.current.x
			: 0;
		const yDiff: number = dragPosition.current.y
			? pageY - dragPosition.current.y
			: 0;
		// Create new svg point with x and y coordinates of <g> element
		let svgPoint: DOMPoint = DOMPoint.fromPoint(
			objectRef.current.getBoundingClientRect(),
		);
		// Calculate viewport coordinates after moving the element
		svgPoint.x += xDiff;
		svgPoint.y += yDiff;
		// Create new point related to the <svg> element isntead of viewport
		const cursorPointSvg: DOMPoint = svgPoint.matrixTransform(
			svgField.getScreenCTM()?.inverse(),
		);
		// Update prev movement
		dragPosition.current.x = pageX;
		dragPosition.current.y = pageY;
		// Call drag method with new values
		onDrag(Math.round(cursorPointSvg.x), Math.round(cursorPointSvg.y));
	});

	const handleDragStop = useRef(() => {
		if (!objectRef.current) {
			return;
		}
		// Trick to get the svg relative to the <g> element
		const svgField: SVGSVGElement = objectRef.current
			.parentElement as unknown as SVGSVGElement;
		if (svgField == undefined) {
			return;
		}
		// Take x,y of the object relative to viewport
		// We can't use props x,y here because the function wrapper in useRef
		const { x: objectX, y: objectY } = objectRef.current.getBBox();
		onDragEnd(objectX, objectY);
		setIsDragging(false);
	});

	const startResize = (
		e: React.MouseEvent<SVGGElement>,
		currentAction: ActionType,
	) => {
		e.preventDefault();
		let { pageX: startX, pageY: startY } = e;
		onResizeStart();
		const svg = objectRef.current?.parentElement as unknown as SVGSVGElement;
		const onMove = (e: MouseEvent) => {
			const { pageX, pageY } = e;
			const deltaX = pageX - startX;
			const deltaY = pageY - startY;
			const { newX, newY, newWidth, newHeight } = applyMouseMoveAction(
				deltaX,
				deltaY,
				currentAction,
			);
			onResize(newX, newY, newWidth, newHeight);
			startX = pageX;
			startY = pageY;
		};

		const onUp = () => {
			if (objectRef.current) {
				const currentX = Math.round(objectRef.current.getBBox().x);
				const currentY = Math.round(objectRef.current.getBBox().y);
				const currentWidth = Math.round(objectRef.current.getBBox().width);
				const currentHeight = Math.round(objectRef.current.getBBox().height);
				// diff between old and new position
				const deltaX: number = x - currentX;
				const deltaY: number = y - currentY;
				const deltaWidth: number = width - currentWidth;
				const deltaHeight: number = height - currentHeight;
				onResizeEnd(
					deltaX,
					deltaY,
					deltaWidth - (checkboxSize > 0 ? currentHeight : 0),
					deltaHeight,
				);
			}
			svg.removeEventListener('mousemove', onMove);
			svg.removeEventListener('mouseup', onUp);
		};
		svg.addEventListener('mousemove', onMove);
		svg.addEventListener('mouseup', onUp);
	};

	const applyMouseMoveAction = (
		deltaX: number,
		deltaY: number,
		currentAction: string,
	) => {
		let deltaTop = 0;
		let deltaLeft = 0;
		let deltaWidth = 0;
		let deltaHeight = 0;
		if (currentAction == ActionType.TopLeftResize) {
			deltaWidth = -deltaX;
			deltaLeft = deltaX;
			deltaHeight = -deltaY;
			deltaTop = deltaY;
		}
		if (currentAction == ActionType.BottomLeftResize) {
			deltaWidth = -deltaX;
			deltaLeft = deltaX;
			deltaHeight = deltaY;
		}

		if (currentAction == ActionType.BottomRightResize) {
			deltaWidth = deltaX;
			deltaHeight = deltaY;
		}

		if (currentAction == ActionType.TopRightResize) {
			deltaWidth = deltaX;
			deltaHeight = -deltaY;
			deltaTop = deltaY;
		}
		const { newX, newY } = getNewPosition(deltaLeft, deltaTop);
		const { newWidth, newHeight } = getNewSize(deltaWidth, deltaHeight);
		return { newX, newY, newWidth, newHeight };
	};

	const getNewPosition = (deltaX: number, deltaY: number) => {
		if (objectRef.current) {
			const svg = objectRef.current.parentElement as any;
			let point = DOMPoint.fromPoint(svg as DOMPoint);
			const currentX = Math.round(objectRef.current.getBBox().x);
			const currentY = Math.round(objectRef.current.getBBox().y);
			point.x = currentX + deltaX;
			point.y = currentY + deltaY;
			return { newX: point.x, newY: point.y };
		}
		return { newX: deltaX, newY: deltaY };
	};

	const getNewSize = (deltaWidth: number, deltaHeight: number) => {
		if (objectRef.current) {
			const svg = objectRef.current?.parentElement as any;
			let point = DOMPoint.fromPoint(svg as DOMPoint);
			const currentHeight = Math.round(objectRef.current.getBBox().height);
			const currentWidth = Math.round(objectRef.current.getBBox().width);
			point.x =
				currentWidth + deltaWidth - (checkboxSize > 0 ? currentHeight : 0);
			point.y = currentHeight + deltaHeight;
			const minSize = 10;
			if (point.x < minSize) {
				point.x = minSize;
			}
			if (point.y < minSize) {
				point.y = minSize;
			}

			return {
				newWidth: point.x,
				newHeight: point.y,
			};
		}
		return { newWidth: 10, newHeight: 10 };
	};

	useEffect(() => {
		if (!objectRef.current) {
			return;
		}
		const svgField: SVGSVGElement = objectRef.current
			.parentElement as unknown as SVGSVGElement;
		if (svgField == undefined) {
			return;
		}
		if (isDragging) {
			// Add listener responsible for dragging to the <svg> element
			// Note: Because of refs, events do not duplicate
			svgField.addEventListener('mousemove', handleDragMove.current);
			svgField.addEventListener('mouseup', handleDragStop.current);
		} else {
			// Remove event listeners from <svg> element
			svgField.removeEventListener('mousemove', handleDragMove.current);
			svgField.removeEventListener('mouseup', handleDragStop.current);
			// Reset drag position
			dragPosition.current = {
				x: 0,
				y: 0,
			};
		}
	}, [isDragging]);

	return (
		<>
			<g
				ref={objectRef}
				onMouseDown={() => {
					!isActionsDisabled && setIsDragging(true);
				}}
				onMouseUp={() => {
					!isActionsDisabled && setIsDragging(false);
				}}
				shapeRendering="optimizeSpeed"
				className={className}
			>
				{children}
			</g>
			{isSelected && (
				<>
					<rect
						className={styles.corner}
						x={x - 2}
						y={y - 2}
						onMouseDown={(e) =>
							!isActionsDisabled && startResize(e, ActionType.TopLeftResize)
						}
					/>
					<rect
						className={styles.corner}
						x={x - 2}
						y={y + height - 4}
						onMouseDown={(e) =>
							!isActionsDisabled && startResize(e, ActionType.BottomLeftResize)
						}
					/>
					<rect
						className={styles.corner}
						x={x + width - 4}
						y={y - 2}
						onMouseDown={(e) =>
							!isActionsDisabled && startResize(e, ActionType.TopRightResize)
						}
					/>
					<rect
						className={styles.corner}
						x={x + width - 4}
						y={y + height - 4}
						onMouseDown={(e) =>
							!isActionsDisabled && startResize(e, ActionType.BottomRightResize)
						}
					/>
				</>
			)}
		</>
	);
}

export default SelectedBorder;
