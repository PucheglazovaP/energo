import { useState } from 'react';
import { AngleDown, Button, Calendar, Panel } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $diagnosticChart } from '../../../Models/DiagnosticChart';
import { setDates } from '../../../Models/DiagnosticChart/events';
import $diagnosticCurrentModel from '../../../Models/DiagnosticCurrent';
import DeviceChart from '../DeviceChart/DeviceChart';
import DeviceSummary from '../DeviceSummary/DeviceSummary';

import styles from './DeviceConnection.module.css';

function DeviceConnection() {
	const { dates } = useStore($diagnosticChart);
	const { selectedDeviceId, devices } = useStore($diagnosticCurrentModel);

	const [hidden, setHidden] = useState<boolean>(true);

	const chosenTitle =
		devices.find((device) => device.number === selectedDeviceId)?.name || '';

	const isContentHidden = hidden || !selectedDeviceId;

	const toggleHidden = () => setHidden(!hidden);

	const renderPanelButton = () => {
		return (
			<Button
				onClick={toggleHidden}
				className={clsx(
					styles.panel_button,
					!hidden && styles.panel_button__expanded,
				)}
			>
				<AngleDown />
			</Button>
		);
	};

	return (
		<Panel
			title="Связь с прибором"
			renderTitleLeft={renderPanelButton}
			className={clsx(styles.connection, hidden && styles.connection__hidden)}
		>
			{!isContentHidden && (
				<div className={styles.panel}>
					<div className={styles.panel_header}>
						<div className={styles.panel_title}>{chosenTitle}</div>
						<div className={styles.panel_date}>
							<Calendar
								dates={dates}
								onClose={setDates}
								className={styles.calendar}
								disableManualInput={false}
								isCloseOnSelect={false}
							/>
						</div>
					</div>
					<div className={styles.panel_body}>
						<DeviceChart id={Number(selectedDeviceId)} />
						<DeviceSummary id={Number(selectedDeviceId)} />
					</div>
				</div>
			)}
		</Panel>
	);
}

export default DeviceConnection;
