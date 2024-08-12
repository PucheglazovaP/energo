import { Outlet } from 'react-router-dom';
import { Switcher } from '@evraz/ui-kit';

import { REPORTS_UGE } from './constants';
import useLayoutReports from './useLayoutReports';

import styles from './LayoutReports.module.css';

function LayoutReports() {
	const { location, handleSwitcherChange } = useLayoutReports();

	return (
		<div className={styles.layout}>
			<header className={styles.header}>
				<div className={styles.radiogroup}>
					<Switcher
						className={styles.switcher}
						items={REPORTS_UGE}
						selectedId={location.pathname}
						onSelect={handleSwitcherChange}
					/>
				</div>
			</header>
			<Outlet />
		</div>
	);
}

export default LayoutReports;
