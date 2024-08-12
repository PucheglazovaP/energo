import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';

import ReportPreview from '../../Containers/ReportPreview';
import { Permissions } from '../../packages/KeycloakInstance/types';
import { Authenticated } from '../../UI/Authenticated';

import usePageDevicesStatus from './usePageDevicesStatus';

import styles from './PageDevicesStatus.module.css';

function PageDevicesStatus() {
	const { url } = usePageDevicesStatus();

	function renderDeviceStatus() {
		return (
			<div className={styles.top_section}>
				<h2 className="scheme_title">{'Статус приборов'}</h2>
			</div>
		);
	}

	return (
		<div className={clsx('page', styles.root)}>
			<Authenticated allowed={Permissions.CanAccessDevicesStatus}>
				<Panel
					className={styles.common}
					title={' '}
					renderTitleLeft={renderDeviceStatus}
				>
					<ReportPreview url={url} />
				</Panel>
			</Authenticated>
		</div>
	);
}

export default PageDevicesStatus;
