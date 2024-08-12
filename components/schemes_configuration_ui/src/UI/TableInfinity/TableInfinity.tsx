import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import TablePair from '../TablePair';

import { TableInfinityProps } from './types';

import styles from './TableInfinity.module.css';

function TableInfinity({
	className,
	style,
	firstRowAsHeader,
	data,
	areRowSelected,
	loadNext,
	loadPrev,
	onChangeScrollPosition,
	scrollPosition,
}: TableInfinityProps) {
	const [isNextHandle, setIsNextHandle] = useState(false);
	const [isPrevHandle, setIsPrevHandle] = useState(true);
	const tableRef = useRef<HTMLDivElement>(null);
	const tableWrapperRef = useRef<HTMLDivElement>(null);
	const scroll = () => {
		if (tableRef.current == null || tableWrapperRef.current == null) return;
		onChangeScrollPosition &&
			onChangeScrollPosition(tableWrapperRef.current.scrollTop);
		const tableRect = tableRef.current.getBoundingClientRect();
		const tableWrapperRect = tableWrapperRef.current.getBoundingClientRect();
		const bottomDelta = tableRect.bottom - tableWrapperRect.bottom;
		const topDelta = tableWrapperRect.top - tableRect.top;

		if (bottomDelta > 30) setIsNextHandle(false);
		if (bottomDelta < 30 && !isNextHandle) {
			loadNext && loadNext();
			setIsNextHandle(true);
		}
		if (topDelta > 30) setIsPrevHandle(false);
		if (topDelta < 30 && !isPrevHandle) {
			loadPrev && loadPrev();
			setIsPrevHandle(true);
		}
	};

	useEffect(() => {
		if (
			tableWrapperRef.current == null ||
			scrollPosition == null ||
			onChangeScrollPosition == null
		)
			return;
		tableWrapperRef.current.scrollTop = scrollPosition;
	}, [onChangeScrollPosition, scrollPosition]);

	return (
		<div
			ref={tableWrapperRef}
			className={clsx(styles.root, className)}
			style={style}
			onScroll={scroll}
		>
			<TablePair
				ref={tableRef}
				data={data}
				firstRowAsHeader={firstRowAsHeader}
				areRowSelected={areRowSelected}
			/>
		</div>
	);
}

export default TableInfinity;
