import { Panel } from '@evraz/ui-kit';

import Table from '../../UI/Table';
import { ITableBody, ITableColumn } from '../../UI/Table/types';

import styles from './PointsReports.module.css';

function renderDeviceReportsTitle() {
	return (
		<div className={styles.linked_top_section}>
			<h2 className="scheme_title">{'Подключенные приборы и каналы'}</h2>
		</div>
	);
}

function LinkedDevicesAndChannelsTable({
	headers,
	data,
}: {
	headers: ITableColumn[];
	data: ITableBody[];
}) {
	return (
		<Panel
			className={styles.linked_panel}
			title={' '}
			renderTitleLeft={renderDeviceReportsTitle}
		>
			<Table className={styles.linked_table} headers={headers} data={data} />
		</Panel>
	);
}

export default LinkedDevicesAndChannelsTable;
