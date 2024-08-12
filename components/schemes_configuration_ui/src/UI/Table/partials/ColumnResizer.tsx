/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
	FC,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import clsx from 'clsx';

// Styles
import styles from '../Table.module.css';

interface IProps {
	disabled: boolean | undefined;
	minWidth?: number;
}

const ColumnResizer: FC<IProps> = ({ disabled, minWidth }) => {
	const [isActive, setActive] = useState(false);
	const resizeRef = useRef<HTMLDivElement>(null);
	const [mouseX, setMouseX] = useState(0);
	const [startPos, setStartPos] = useState(0);
	const [startWidthPrev, setStartWidthPrev] = useState(0);

	const dragColumn = useCallback(() => {
		if (disabled) {
			return;
		}
		setActive(true);
		setStartPos(mouseX);
		setStartWidthPrev(0);
		/* 		document.body.style.cursor = 'col-resize'; */
		const element = resizeRef.current?.parentElement as HTMLTableCellElement;
		setStartWidthPrev(element.clientWidth);
	}, [disabled, setActive, mouseX, setStartPos, setStartWidthPrev]);
	const endDragColumn = useCallback(() => {
		if (disabled) {
			return;
		}
		setActive(false);
	}, [disabled, setActive]);

	const onMouseMove = useCallback(
		(e: MouseEvent) => {
			if (disabled) {
				return;
			}
			setMouseX(e.screenX);
			if (!isActive) {
				return;
			}
			const element = resizeRef.current?.parentElement as HTMLTableCellElement;
			const moveDiff = startPos - mouseX;
			let newPrev = startWidthPrev - moveDiff;

			if (!minWidth || (newPrev >= minWidth && element)) {
				element.style.width = newPrev + 'px';
				element.style.minWidth = newPrev + 'px';
				element.style.maxWidth = newPrev + 'px';
			}
		},
		[disabled, minWidth, startWidthPrev, isActive, startPos, mouseX, resizeRef],
	);
	const removeListeners = useCallback(() => {
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', endDragColumn);
		/* 		document.body.style.cursor = 'default'; */
	}, [onMouseMove, endDragColumn]);

	useEffect(() => {
		if (!disabled) {
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', endDragColumn);
		}

		return () => {
			removeListeners();
		};
	}, [disabled, onMouseMove, endDragColumn, removeListeners]);
	return (
		<>
			{!disabled && (
				<div
					className={clsx(
						styles['resize-handle'],
						isActive && styles['active'],
					)}
					ref={resizeRef}
					onMouseDown={dragColumn}
				/>
			)}
		</>
	);
};

export default memo(ColumnResizer);
