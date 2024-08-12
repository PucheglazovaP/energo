import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Panel } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import ButtonToggleSideBar from '../../Containers/ButtonToggleSideBar';
import EditEmergencyEventsReportForm from '../../Containers/EditEmergencyEventsReportForm';
import EmergencyEventsReportForm from '../../Containers/EmergencyEventsReportForm';
import TreeEmergencyEvents from '../../Containers/TreeEmergencyEvents';
import { $emergencyEventsInfo } from '../../Models/EmergencyEvents';
import { setDatePeriod } from '../../Models/EmergencyEvents/events';
import { setNavigation } from '../../Models/Navigation/events';
import { $sidebar } from '../../Models/Sidebar';
import { Permissions } from '../../packages/KeycloakInstance/types';
import { CalendarType } from '../../Shared/types';
import { SearchParameters } from '../../Shared/types';
import { Authenticated } from '../../UI/Authenticated';
import VerticalResizer from '../../UI/VerticalResizer';

import styles from './PageEmergencyEvents.module.css';

function PageEmergencyEvents() {
	const sidebar = useStore($sidebar);
	const { startDateTime, endDateTime, activeNodeInfo, isEditing } =
		useStore($emergencyEventsInfo);

	const renderTitleLeftFn = () => {
		return (
			<div className={styles.top_section}>
				<ButtonToggleSideBar className={styles.toggle_sidebar_btn} />
				Журнал аварийных событий / {activeNodeInfo?.name || ''}
			</div>
		);
	};
	const handlePeriodSelect = (period: Date[]) => {
		setDatePeriod(period);
	};

	const [searchParams] = useSearchParams();

	useEffect(() => {
		const paramControlParameterId = searchParams.get(
			SearchParameters.ControlParameterId,
		);
		const controlParameterId = paramControlParameterId
			? Number(paramControlParameterId)
			: undefined;
		setNavigation({
			controlParameterId,
		});
	}, [searchParams]);

	return (
		<section className={clsx('page', styles.root)}>
			<Authenticated allowed={Permissions.CanViewEmergencyEvents}>
				<div className={styles.header}>
					{!isEditing && (
						<Calendar
							dates={[startDateTime, endDateTime]}
							type={CalendarType.Period}
							onClose={handlePeriodSelect}
							onSelect={handlePeriodSelect}
							className={styles.calendar}
							disableManualInput={false}
							isCloseOnSelect={false}
							disableTypeSelector
						/>
					)}
				</div>
				<Panel
					className={clsx(styles.panel, isEditing && styles.panel__editing)}
					title={' '}
					renderTitleLeft={renderTitleLeftFn}
				>
					<VerticalResizer
						firstElementMinWidth={320}
						secondElementMinWidth={1000}
						leftElementWidth={sidebar.isOpen ? 20 : 0}
					>
						<div
							className={
								sidebar.isOpen ? styles.sidebar : styles.sidebar__hidden
							}
						>
							<TreeEmergencyEvents />
						</div>
						{isEditing ? (
							<EditEmergencyEventsReportForm />
						) : (
							<EmergencyEventsReportForm />
						)}
					</VerticalResizer>
				</Panel>
			</Authenticated>
		</section>
	);
}

export default PageEmergencyEvents;
