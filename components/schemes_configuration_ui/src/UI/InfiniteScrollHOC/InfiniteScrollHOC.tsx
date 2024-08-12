import { UIEvent, useRef, useState } from 'react';
import clsx from 'clsx';

import { InfiniteScrollHOCProps } from './types';

import styles from './InfiniteScrollHOC.module.css';

/**
 * HOC компонент, компонент обертка
 * Предназначен для добавления функционала бесконечного скроллинга
 * Загрузка данных работает как при прокрутке вниз, так и при прокрутке вверх
 *
 * @param {ReactNode} children Компонент, содержащий список элементов, не имеющий скролла
 * @param {Function} onDataLoad Метод, который будет вызван при необходимости загрузки новых данных
 * @param {boolean} isDataLoading Флаг, блокирующий увеличение номера страницы во время загрузки данных
 * @param {number} firstPage Номер первой страницы
 * @param {number} initialPage Номер начальной страницы, с которой отображать данные, может быть отличен от 0
 * @param {number} scrollMargin Процент отступа от границ области скролла,
 * при достижении которых начинается загрузка новых данных
 *
 * @return ReactNode
 */

function InfiniteScrollHOC({
	children,
	isDataLoading,
	totalPages,
	onDataLoad,
	firstPage = 0,
	initialPage = 0,
	scrollMargin = 20,
	className,
}: InfiniteScrollHOCProps) {
	const [currentPage, setCurrentPage] = useState(initialPage);
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const previousScrollValue = useRef(0);

	// Автоматический скролл вверх/вниз при получении новых данных
	const scrollTo = (isBottomScroll: boolean, maxScrollHeight: number) => {
		if (isBottomScroll) {
			scrollContainerRef.current?.scrollTo({
				top: maxScrollHeight - (maxScrollHeight / 100) * scrollMargin,
			});
		} else {
			scrollContainerRef.current?.scrollTo({
				top: 0 + (maxScrollHeight / 100) * scrollMargin,
			});
		}
	};

	// Расчет необходимости обновления текущей страницы и загрузки новых данных
	const handleScrollChange = (event: UIEvent<HTMLElement>) => {
		if (isDataLoading) {
			return;
		}

		const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
		const currentScrollPosition = scrollTop;
		const maxScrollPosition = scrollHeight - clientHeight;

		const isStartOfScroll =
			currentScrollPosition <= (maxScrollPosition / 100) * scrollMargin;
		const isEndOfScroll =
			currentScrollPosition >= (maxScrollPosition / 100) * (100 - scrollMargin);

		const isBottomScrolling =
			previousScrollValue.current < currentScrollPosition;
		previousScrollValue.current = currentScrollPosition;

		if (!isBottomScrolling && isStartOfScroll && currentPage > firstPage) {
			const nextPage = currentPage - 1;
			setCurrentPage(nextPage);
			onDataLoad(nextPage);
			scrollTo(isBottomScrolling, scrollHeight);
		} else if (isEndOfScroll && currentPage < totalPages) {
			const nextPage = currentPage + 1;
			setCurrentPage(nextPage);
			onDataLoad(nextPage);
			scrollTo(isBottomScrolling, scrollHeight);
		}
	};

	return (
		<div
			className={clsx(styles.scroll_area, className)}
			ref={scrollContainerRef}
			onScroll={handleScrollChange}
		>
			{children}
		</div>
	);
}

export default InfiniteScrollHOC;
