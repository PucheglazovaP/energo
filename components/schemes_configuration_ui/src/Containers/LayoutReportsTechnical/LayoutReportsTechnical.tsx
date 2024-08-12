import { Outlet } from 'react-router-dom';
import { Button, Calendar, Switcher } from '@evraz/ui-kit';

import Refresh from '../../Icons/Refresh';
import { CalendarType } from '../../Shared/types';
import Divider from '../../UI/Divider';

import useLayoutReportsTechnical from './useLayoutReportsTechnical';

import styles from './LayoutReportsTechnical.module.css';

function LayoutReportsTechnical() {
	const {
		reportItems,
		operInformItems,
		location,
		handleReportSwitcherChange,
		handleElectricPowerSwitcherChange,
		handlePeriodSelect,
		handleTypeChange,
		startDate,
		endDate,
		calendarType,
		isReportsPage,
		isElectricPowerPage,
		selectedReportType,
		hasRefresh,
		handleToggleRefresh,
	} = useLayoutReportsTechnical();

	return (
		<div className={styles.layout}>
			<header className={styles.header}>
				<div className={styles.header_left}>
					<Calendar
						dates={
							calendarType === CalendarType.Day
								? [endDate]
								: [startDate, endDate]
						}
						type={calendarType}
						onClose={handlePeriodSelect}
						className={styles.calendar}
						isCloseOnSelect={false}
						disableTypeSelector
						onTypeChange={handleTypeChange}
					/>
					{hasRefresh && (
						<>
							<Divider />
							<Button
								primary
								className={styles.header_button}
								onClick={handleToggleRefresh}
							>
								<Refresh className={styles.refresh} />
								<span>Обновить</span>
							</Button>
						</>
					)}
				</div>
				{isReportsPage && (
					<div className={styles.radiogroup}>
						<Switcher
							className={styles.switcher}
							items={reportItems}
							selectedId={location.pathname}
							onSelect={handleReportSwitcherChange}
						/>
					</div>
				)}
				{isElectricPowerPage && (
					<div className={styles.radiogroup}>
						<Switcher
							className={styles.switcher}
							items={operInformItems}
							selectedId={selectedReportType}
							onSelect={handleElectricPowerSwitcherChange}
						/>
					</div>
				)}
			</header>
			<Outlet />
		</div>
	);
}

export default LayoutReportsTechnical;
