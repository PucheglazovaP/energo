import { Button, Switcher } from '@evraz/ui-kit';
import clsx from 'clsx';

import MoreIcon from '../../Icons/More';
import { EmergencyEventsReportTypes } from '../../Shared/types';
import ContextMenu from '../../UI/ContextMenu';
import Input from '../../UI/Input';
import Select from '../../UI/Select';

import { REPORT_TYPES_LIST } from './consts';
import ReportFormProps from './types';
import useReportFormInfo from './useEmergencyEventsReportFormInfo';

import styles from './EmergencyEventsReportForm.module.css';

function EmergencyEventsReportForm({ className }: ReportFormProps) {
	const {
		reportLink,
		createReportLink,
		minDuration,
		kvitStatusList,
		eventTypeList,
		eventStatusList,
		position,
		iframeRef,
		contextMenuItems,
		handleContextMenu,
		handleMinDurationChange,
		handleKvitStatusSelect,
		handleEventStatusSelect,
		handleEventTypeSelect,
		setPosition,
		selectedReportType,
		hadnleReportTypeSelect,
	} = useReportFormInfo();

	return (
		<div className={clsx(styles.root, className)}>
			<div className={styles.header}>
				<Switcher
					items={REPORT_TYPES_LIST}
					selectedId={selectedReportType}
					onSelect={hadnleReportTypeSelect}
					className={styles.switcher}
				/>
				{selectedReportType === EmergencyEventsReportTypes.Events && (
					<div className={styles.btns}>
						<Select
							options={kvitStatusList}
							onSelect={handleKvitStatusSelect}
							className={styles.selector}
						/>
						<Select
							options={eventStatusList}
							onSelect={handleEventStatusSelect}
							className={styles.selector}
						/>
						<Select
							options={eventTypeList}
							onSelect={handleEventTypeSelect}
							className={styles.selector}
						/>
						<div className={styles.duration}>
							Мин длительность (мин)
							<Input
								type={'number'}
								className={styles.input}
								value={minDuration}
								onChange={handleMinDurationChange}
							/>
						</div>
						<Button className={styles.btn} onClick={createReportLink}>
							Запросить
						</Button>
						<Button className={styles.menu_btn} onClick={handleContextMenu}>
							<MoreIcon />
						</Button>
						{position && (
							<ContextMenu
								items={contextMenuItems}
								position={position}
								setPosition={setPosition}
								className={styles.menu}
							/>
						)}
					</div>
				)}
			</div>
			<iframe
				title="Отчет"
				src={reportLink}
				ref={iframeRef}
				className={styles.report}
			/>
		</div>
	);
}

export default EmergencyEventsReportForm;
