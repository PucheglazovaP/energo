import { Button, Calendar } from '@evraz/ui-kit';
import clsx from 'clsx';
import { Options } from 'highcharts';

import HistogramIcon from '../../Icons/Histogram';
import ReportIcon from '../../Icons/Report';
import Chart from '../../UI/Chart';
import Checkbox from '../../UI/Checkbox';
import Input from '../../UI/Input';
import Select from '../../UI/Select';
import Spinner from '../../UI/Spinner';

import ColumnChartSectionProps from './types';
import useColumnChartInfo from './useColumnChartInfo';

import styles from './ColumnChartSection.module.css';

function ColumnChartSection({ className }: ColumnChartSectionProps) {
	const chartOptions: Options = {
		plotOptions: {
			series: {
				animation: false,
				states: {
					hover: {
						enabled: false,
					},
				},
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true,
						},
					},
				},
			},
			column: {
				centerInCategory: true,
				groupPadding: 0,
				states: {
					hover: {
						color: '#000000',
					},
				},
			},
		},
	};
	const {
		reportLink,
		onHistogramBtnClick,
		onReportBtnClick,
		onChangeUpdateDelay,
		onToggleUpdate,
		handlePeriodSelect,
		onCalendarTypeChange,
		handleSelectedDiscrete,
		usedCalendarTypes,
		series,
		title,
		isLoading,
		startDateTime,
		endDateTime,
		selectedCalendarType,
		discreteList,
		isUpdateChartEnabled,
		updateDelay,
		isChartVisible,
	} = useColumnChartInfo();

	return (
		<div className={clsx(styles.root, className)}>
			<h3 className={styles.title}>
				{title}
				{isLoading && (
					<div className={styles.spinner}>
						<Spinner className={styles.loading} />
					</div>
				)}
			</h3>
			<div className={styles.btns}>
				<Calendar
					dates={[startDateTime, endDateTime]}
					type={selectedCalendarType}
					usedTypes={usedCalendarTypes}
					onClose={handlePeriodSelect}
					className={styles.calendar}
					onTypeChange={onCalendarTypeChange}
					disableManualInput={false}
					isCloseOnSelect={false}
				/>
				<Select
					options={discreteList}
					onSelect={handleSelectedDiscrete}
					disabled={isLoading}
					className={clsx(
						styles.selector,
						styles['selector_discrete'],
						'selector_discrete',
					)}
				/>
				<Checkbox
					name={'histogramm-reload'}
					title="Обновление"
					checked={isUpdateChartEnabled}
					onChange={onToggleUpdate}
					className={styles.checkbox}
				/>
				<Input
					type={'number'}
					className={styles.input}
					value={updateDelay}
					onChange={(e) => {
						onChangeUpdateDelay(Number(e.target.value));
					}}
					disabled={!isUpdateChartEnabled}
				/>
				{isChartVisible ? (
					<Button className={styles.btn} onClick={onReportBtnClick}>
						{' '}
						<ReportIcon className={styles.report_icon} />
						Отчет
					</Button>
				) : (
					<Button className={styles.btn} onClick={onHistogramBtnClick}>
						{' '}
						<HistogramIcon className={styles.icon} />
						Гистограмма
					</Button>
				)}
			</div>
			{isChartVisible ? (
				<Chart series={series} chartOptions={chartOptions} />
			) : (
				<iframe title="Отчет" src={reportLink} className={styles.report} />
			)}
		</div>
	);
}

export default ColumnChartSection;
