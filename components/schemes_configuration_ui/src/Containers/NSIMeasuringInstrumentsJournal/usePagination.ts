import React, { useCallback } from 'react';

/**
 * Допустимое отклонение (в пикселях) при скроллинге
 */
const DEVIATION = 5;

function usePagination(
	ref: React.RefObject<HTMLElement>,
	pageTotalCount: number,
	topPageNumber: number,
	bottomPageNumber: number,
	loadData: (
		pageNumber: number,
		topPageNumber: number,
		bottomPageNumber: number,
		shouldAddToTop?: boolean,
	) => void,
) {
	const onScroll = useCallback(() => {
		if (ref.current) {
			const { scrollTop, scrollHeight, clientHeight } = ref.current;
			const diff = scrollHeight - clientHeight - scrollTop;
			// Load data if we scrolled to the bottom
			if (diff <= DEVIATION && bottomPageNumber !== pageTotalCount) {
				const newPageNumber: number = bottomPageNumber + 2;
				loadData(newPageNumber, topPageNumber, newPageNumber, false);
			}
			// Load data if we scrolled to the top
			if (scrollTop === 0 && topPageNumber > 2) {
				const newPageNumber: number = topPageNumber - 2;
				loadData(newPageNumber, newPageNumber, bottomPageNumber, true);
			}
		}
	}, [pageTotalCount, topPageNumber, bottomPageNumber, loadData]);

	return {
		onScroll,
	};
}

export default usePagination;
