import React, { useCallback } from 'react';

import { Pagination } from '../Shared/types';

/**
 * Hook to provide pagination with infinite scroll
 */

const DEVIATION = 5;

function usePagination(
	ref: React.RefObject<HTMLElement>,
	pagination: Pagination,
	totalCount: number,
	loadData: (pagination: Pagination) => void,
) {
	const onScroll = useCallback(() => {
		if (ref.current) {
			const { scrollTop, scrollHeight, clientHeight } = ref.current;
			if (
				scrollTop + clientHeight + DEVIATION >= scrollHeight &&
				pagination.pageNumber !== totalCount
			) {
				const newPagination: Pagination = {
					...pagination,
					pageNumber: pagination.pageNumber + 1,
				};
				loadData(newPagination);
			}
		}
	}, [pagination, loadData]);

	return {
		onScroll,
	};
}

export default usePagination;
