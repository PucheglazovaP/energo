import React, { useCallback } from 'react';

import { OptimizedPagination } from '../Shared/types';

/**
 * Допустимое отклонение (в пикселях) при скроллинге
 */
const DEVIATION = 5;

/**
 * Hook to provide working with optimized RPC.
 * Optimized RPC - procedure that returns more than one page on call
 * @param ref scrolled element
 * @param pagination pagination properties
 * @param loadData function to load data with new pagination
 */
function useOptimizedPagination(
	ref: React.RefObject<HTMLElement>,
	pagination: OptimizedPagination,
	loadData: (pagination: OptimizedPagination, shouldAddToTop?: boolean) => void,
) {
	const onScroll = useCallback(() => {
		if (ref.current) {
			const { scrollTop, scrollHeight, clientHeight } = ref.current;
			const diff = scrollHeight - clientHeight - scrollTop;
			// Load data if we scrolled to the bottom
			if (
				diff <= DEVIATION &&
				pagination.pageNumber !== pagination.pageTotalCount
			) {
				const newPagination: OptimizedPagination = {
					...pagination,
					pageNumber: pagination.pageNumber + 2,
				};
				loadData(newPagination, false);
			}
			// Load data if we scrolled to the top
			if (scrollTop === 0 && pagination.pageNumber > 2) {
				const newPagination: OptimizedPagination = {
					...pagination,
					pageNumber: pagination.pageNumber - 2,
				};
				loadData(newPagination, true);
			}
		}
	}, [pagination, loadData]);

	return {
		onScroll,
	};
}

export default useOptimizedPagination;
