import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SwitcherItemType } from '@evraz/ui-kit/dist/src/components/Switcher/types';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $electricPower } from '../../Models/ElectricPower';
import { setReportTypeEvent } from '../../Models/ElectricPower/events';
import { toggleRefresh } from '../../Models/InputForm/events';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { setDatePeriod } from '../../Models/ReportsTechnical/events';
import { ReportType } from '../../Pages/PageElectricPower/types';
import { CalendarType, Path } from '../../Shared/types';
import Select from '../../UI/Select';
import { SelectOption } from '../../UI/Select/types';

import { SELECT_ITEMS } from './constants';

import styles from './LayoutReportsTechnical.module.css';

function useLayoutReportsTechnical() {
	const location = useLocation();
	const navigate = useNavigate();
	const { startDate, endDate } = useStore($datePeriod);
	const { selectedReportType } = useStore($electricPower);

	const calendarType =
		location.pathname === Path.ReportByInputForms ||
		location.pathname === Path.ReportByInstrumentation ||
		location.pathname === Path.ElectricPower ||
		location.pathname === Path.NaturalGas
			? CalendarType.Day
			: CalendarType.Period;

	const hasRefresh = location.pathname === Path.ReportByInputForms;

	const handleToggleRefresh = () => {
		toggleRefresh();
	};
	const handleReportSwitcherChange = (id: string) => {
		navigate(id);
	};
	const handleElectricPowerSwitcherChange = (id: string) => {
		setReportTypeEvent(id as ReportType);
	};

	const handleSelectTab = (options: SelectOption[]) => {
		const selectedOption = options.find((selectOption) => {
			return selectOption.isSelected;
		});

		if (selectedOption) {
			navigate(selectedOption.value as string);
		}
	};

	const handlePeriodSelect = (period: Date[]) => {
		if (calendarType === CalendarType.Day && period[0] > startDate) {
			return setDatePeriod({
				startDate: startDate,
				endDate: period[1] || endDate,
			});
		}
		return setDatePeriod({
			startDate: period[0],
			endDate: period[1] || endDate,
		});
	};

	const handleTypeChange = (calendarType: CalendarType) => calendarType;

	const selectItems: SelectOption[] = [
		{
			value: Path.ReportByInputForms,
			label: 'Форма ввода',
			isSelected:
				location.pathname === Path.ReportByInputForms ||
				!SELECT_ITEMS.includes(location.pathname as Path),
		},
		{
			value: Path.ReportByLogBook,
			label: 'Журнал учета',
			isSelected: location.pathname === Path.ReportByLogBook,
		},
		{
			value: Path.ReportByCorrectionLog,
			label: 'Журнал коррекций',
			isSelected: location.pathname === Path.ReportByCorrectionLog,
		},
		{
			value: Path.ReportByConstantLog,
			label: 'Журнал констант',
			isSelected: location.pathname === Path.ReportByConstantLog,
		},
	];

	const reportItems: SwitcherItemType[] = [
		{
			id: Path.ReportByInstrumentation,
			title: 'Приборные данные',
		},
		{
			id: Path.ReportByInputForms,
			title: 'Форма ввода',
			renderFn: () => {
				return (
					<Select
						className={clsx(
							styles.select,
							SELECT_ITEMS.includes(location.pathname as Path) &&
								styles.select__active,
						)}
						options={selectItems}
						onSelect={handleSelectTab}
						key={Path.ReportByInputForms}
					/>
				);
			},
		},
		{
			id: Path.ReportByPeriod,
			title: 'Отчеты за период',
		},
		{
			id: Path.ReportByPrintForms,
			title: 'Печатные формы',
		},
	];

	const operInformItems: SwitcherItemType[] = [
		{
			id: ReportType.Day,
			title: 'За сутки',
		},
		{
			id: ReportType.Month,
			title: 'За месяц',
		},
		{
			id: ReportType.Total,
			title: 'Итоговое',
		},
	];

	const isReportsPage: boolean =
		location.pathname === Path.ReportByInstrumentation ||
		location.pathname === Path.ReportByInputForms ||
		location.pathname === Path.ReportByLogBook ||
		location.pathname === Path.ReportByCorrectionLog ||
		location.pathname === Path.ReportByConstantLog ||
		location.pathname === Path.ReportByPeriod ||
		location.pathname === Path.ReportByPrintForms;

	const isElectricPowerPage: boolean = location.pathname === Path.ElectricPower;

	useEffect(() => {
		handleTypeChange(calendarType);
	}, [calendarType]);

	return {
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
	};
}

export default useLayoutReportsTechnical;
