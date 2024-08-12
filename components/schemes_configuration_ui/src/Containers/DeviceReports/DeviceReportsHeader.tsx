import { Switcher } from '@evraz/ui-kit';

import { getSelectedReportType } from '../ReportTable/utils';

import DeviceReportsHeaderButtons from './DeviceReportsHeaderButtons';
import { DeviceReportsHeaderProps } from './types';

import styles from './DeviceReports.module.css';

function DeviceReportsHeader({
	onDeviceEdit,
	onGenerateReport,
	reportTypes,
	onChangeType,
}: DeviceReportsHeaderProps) {
	return (
		<div className={styles.header}>
			<div className={styles.radiogroup}>
				<Switcher
					className={styles.switcher}
					items={reportTypes}
					selectedId={getSelectedReportType(reportTypes)}
					onSelect={onChangeType}
				/>
			</div>
			<DeviceReportsHeaderButtons
				onDeviceEdit={onDeviceEdit}
				onGenerateReport={onGenerateReport}
			/>
		</div>
	);
}

export default DeviceReportsHeader;
