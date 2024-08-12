/* global CSSModuleClasses */
import { useState } from 'react';

import { SortOptions, SortOrder } from '../../../Shared/types';
import { getSortOrder } from '../../../Utils/tableUtils';

function useSortOptions(styles: CSSModuleClasses) {
	const [sortOptions, setSortOptions] = useState<SortOptions>({
		accessor: '',
		order: SortOrder.None,
	});
	const handleSortOptions = (accessor: string) => {
		if (sortOptions.accessor === accessor) {
			const order: SortOrder = getSortOrder(sortOptions.order);
			setSortOptions({ accessor, order });
		} else {
			setSortOptions({
				accessor,
				order: SortOrder.Asc,
			});
		}
	};

	const getSortStyles = (accessor: string) => {
		return {
			[styles.sort_icon_asc]:
				sortOptions.accessor === accessor &&
				sortOptions.order === SortOrder.Asc,
			[styles.sort_icon_desc]:
				sortOptions.accessor === accessor &&
				sortOptions.order === SortOrder.Desc,
			[styles.sort_icon]: true,
		};
	};

	return {
		sortOptions,
		handleSortOptions,
		getSortStyles,
	};
}

export default useSortOptions;
