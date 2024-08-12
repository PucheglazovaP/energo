import { useStore } from 'effector-react';

import { START_DIAGNOSTIC_PAGE } from '../../../Models/DiagnosticCurrent/constants';
import { fetchDiagnosticCurrentStateEffect } from '../../../Models/DiagnosticCurrent/effects';
import {
	setDiagnosticPaginationPageEvent,
	toggleBooleanStorageEvent,
} from '../../../Models/DiagnosticCurrent/events';
import { StorageFieldName } from '../../../Models/DiagnosticCurrent/types';
import InfiniteScrollHOC from '../../../UI/InfiniteScrollHOC';
import Table from '../../../UI/Table';

import useStateTableProps from './useStateTableProps';

import styles from './DevicesStateTable.module.css';

function DevicesStateTable() {
	const { header, sections, data, totalPages } = useStateTableProps();
	const isLoading = useStore(fetchDiagnosticCurrentStateEffect.pending);

	const handleExpandCollapseSection = (accessor: string) => {
		toggleBooleanStorageEvent({
			storageFieldName: StorageFieldName.DevicesExpandStorage,
			dictionaryKey: accessor,
			initialValue: true,
		});
	};

	return (
		<InfiniteScrollHOC
			firstPage={START_DIAGNOSTIC_PAGE}
			initialPage={START_DIAGNOSTIC_PAGE}
			onDataLoad={setDiagnosticPaginationPageEvent}
			isDataLoading={isLoading}
			className={styles.scroll_area}
			totalPages={totalPages}
		>
			<Table
				headers={header}
				data={data}
				className={styles.diagnostic_current_table}
				sections={sections}
				handleExpandCollapse={handleExpandCollapseSection}
				isLoading={isLoading}
			/>
		</InfiniteScrollHOC>
	);
}

export default DevicesStateTable;
