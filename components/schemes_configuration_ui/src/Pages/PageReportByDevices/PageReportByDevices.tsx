import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import DeviceReports from '../../Containers/DeviceReports';
import HeatingSeasons from '../../Containers/HeatingSeasons';
import { Permissions } from '../../packages/KeycloakInstance/types';
import { Authenticated } from '../../UI/Authenticated';

import styles from './PageReportByDevices.module.css';

function PageReportByDevices() {
	function renderDeviceReportsTitle() {
		return (
			<div className={styles.top_section}>
				<h2 className="scheme_title">{'Отчеты'}</h2>
				<h3>&nbsp;{'/ Показания приборов'}</h3>
			</div>
		);
	}

	function renderHeatingSeasonsTitle() {
		return (
			<div className={styles.top_section}>
				<h2 className="scheme_title">{'НСИ'}</h2>
			</div>
		);
	}

	return (
		<div className={clsx('page', styles.root)}>
			<Authenticated allowed={Permissions.CanSeeDeviceReports}>
				<Panel
					className={styles.common}
					title={' '}
					renderTitleLeft={renderDeviceReportsTitle}
				>
					<div className={styles.wrapper}>
						<DeviceReports />
					</div>
				</Panel>

				<Panel
					className={styles.nsi}
					title={' '}
					renderTitleLeft={renderHeatingSeasonsTitle}
				>
					<div className={styles.wrapper}>
						<HeatingSeasons />
					</div>
				</Panel>
			</Authenticated>
		</div>
	);
}

export default PageReportByDevices;
