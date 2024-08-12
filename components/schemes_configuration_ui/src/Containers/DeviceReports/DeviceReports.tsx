import VerticalResizer from '../../UI/VerticalResizer';

import DeviceReportsHeader from './DeviceReportsHeader';
import { useDeviceReports } from './useDeviceReports';

import styles from './DeviceReports.module.css';

function DeviceReports() {
	const {
		isEditMode,
		reportTypes,
		onDeviceEdit,
		onGenerateReport,
		onChangeType,
		renderDeviceParameters,
		renderReportTable,
	} = useDeviceReports();

	return (
		<div className={styles.devices_reports_container}>
			{!isEditMode && (
				<DeviceReportsHeader
					reportTypes={reportTypes}
					onGenerateReport={onGenerateReport}
					onDeviceEdit={onDeviceEdit}
					onChangeType={onChangeType}
				/>
			)}
			<div className={styles.body}>
				{isEditMode ? (
					<VerticalResizer
						firstElementMinWidth={180}
						secondElementMinWidth={600}
					>
						{renderDeviceParameters}
						{renderReportTable}
					</VerticalResizer>
				) : (
					<>{renderReportTable}</>
				)}
			</div>
		</div>
	);
}

export default DeviceReports;
