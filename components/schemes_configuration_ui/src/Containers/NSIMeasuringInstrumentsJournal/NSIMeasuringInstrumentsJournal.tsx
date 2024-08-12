import { useEffect } from 'react';
import { useStore } from 'effector-react';

import { getMeasuringInstrumentsListFx } from '../../Models/NSIMeasuringInstruments/effects';
import { setPagination } from '../../Models/NSIMeasuringInstruments/events';
import { Permissions } from '../../packages/KeycloakInstance/types';
import usePermissions from '../../packages/KeycloakInstance/usePermissions';
import { checkPermission } from '../../packages/KeycloakInstance/utils';
import { ModuleName } from '../../Shared/Types/moduleName';
import ContextMenu from '../../UI/ContextMenu';
import DataTable from '../NSIUserParameters/components/DataTable';

import { $measuringInstrumentsJournal } from './model';
import useMeasuringInstrumentJournalContextMenu from './useMeasuringInstrumentJournalContextMenu';
import useMeasuringInstrumentsJournalScroll from './useMeasuringInstrumentsJournalScroll';
import usePagination from './usePagination';
import { getTableData } from './utils';

import styles from './NSIMeasuringInstrumentsJournal.module.css';

function NSIMeasuringInstrumentsJournal() {
	const {
		user,
		instrumentsData,
		searchValues,
		filters,
		selectedInstrumentNumber,
	} = useStore($measuringInstrumentsJournal);
	const scrollRef = useMeasuringInstrumentsJournalScroll();
	const { instrumentsList, pagination } = instrumentsData;
	const permissions = usePermissions();
	const hasNSIEditingPermission: boolean = checkPermission(
		permissions,
		Permissions.CanEditNSIPage,
	);
	const {
		position,
		contextMenuItems,
		setPosition,
		handleEquipmentContextMenu,
	} = useMeasuringInstrumentJournalContextMenu();

	const fetchInstrumentsList = (
		pageNumber: number,
		topPageNumber: number,
		bottomPageNumber: number,
		shouldAddToTop: boolean = false,
	) => {
		if (user !== null) {
			getMeasuringInstrumentsListFx({
				action: 'add',
				measurementTypeCode: filters.measurementType,
				equipmentShortName:
					searchValues.equipmentShortName !== ''
						? searchValues.equipmentShortName
						: null,
				factoryNumber:
					searchValues.factoryNumber !== '' ? searchValues.factoryNumber : null,
				manufacturerTypeName:
					searchValues.manufacturerTypeName !== ''
						? searchValues.manufacturerTypeName
						: null,
				productionYear: null,
				userStatusCode: filters.userStatus,
				equipmentNumber: null,
				location: searchValues.location !== '' ? searchValues.location : null,
				pageRowCount: 20,
				pageNumber: pageNumber,
				firstRow: 0,
				selectRow: null,
				pageTotalCount: 0,
				userId: user.preferredUsername,
				moduleName:
					ModuleName.NSIMeasuringInstrumentsJournal_getMeasuringInstrumentsListFx,
				shouldAddToTop: shouldAddToTop,
			});
			setPagination({ ...pagination, topPageNumber, bottomPageNumber });
		}
	};

	const { onScroll } = usePagination(
		scrollRef,
		pagination.pageTotalCount,
		pagination.topPageNumber,
		pagination.bottomPageNumber,
		fetchInstrumentsList,
	);

	useEffect(() => {
		if (user !== null && !selectedInstrumentNumber) {
			getMeasuringInstrumentsListFx({
				action: 'set',
				measurementTypeCode: null,
				equipmentShortName: null,
				manufacturerTypeName: null,
				productionYear: null,
				factoryNumber: null,
				userStatusCode: null,
				equipmentNumber: null,
				location: null,
				pageRowCount: 20,
				pageNumber: 1,
				firstRow: 0,
				selectRow: null,
				pageTotalCount: 0,
				userId: user.preferredUsername,
				moduleName:
					ModuleName.NSIMeasuringInstrumentsJournal_getMeasuringInstrumentsListFx,
				shouldAddToTop: false,
			});
		}
	}, [user]);

	const tableData =
		user !== null
			? getTableData(
					hasNSIEditingPermission,
					user.preferredUsername,
					instrumentsList,
					searchValues,
					filters,
			  )
			: null;

	return (
		<div className={styles.container}>
			{tableData !== null ? (
				<DataTable
					headerData={tableData.header}
					headerClassName={styles.table_header}
					bodyData={tableData.body}
					bodyClassName={styles.table_body}
					orientation="row"
					ref={scrollRef}
					onScroll={onScroll}
					selectedInstrumentNumber={selectedInstrumentNumber}
					className={styles.measuring_instruments_journal_table}
					onContextMenu={handleEquipmentContextMenu}
				/>
			) : null}
			<ContextMenu
				position={position}
				setPosition={setPosition}
				items={contextMenuItems}
			/>
		</div>
	);
}

export default NSIMeasuringInstrumentsJournal;
