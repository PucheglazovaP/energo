import { useCallback, useState } from 'react';

import { Path } from '../../Shared/types';
import { checkLocalhost, isHeadingOption } from '../../Shared/Utils/utils';
import { TOption, TOptionHeading } from '../../UI/Dropdown/types';

import { Balance, HeaderItems, OperInform, Report } from './types';

function useHeader() {
	const [activeHeaderItem, setActiveHeaderItem] = useState<HeaderItems>(
		HeaderItems.Configurator,
	);
	const handleHomePageClick = useCallback(() => {
		window.location.assign(window.location.origin);
		setActiveHeaderItem(HeaderItems.Configurator);
	}, []);

	const handleRedirect = useCallback(
		(url: Path) => () => {
			window.location.assign(
				(checkLocalhost()
					? import.meta.env.VITE_DEV_POINT
					: window.location.origin
				).concat(`/schemes/#${url}`),
			);
		},
		[],
	);

	const handleSelectRedirect = (selectedOption: TOption) => {
		handleRedirect(selectedOption.value as Path)();
	};

	// Набор селектора "Отчеты"
	const reportsOptions: (TOption | TOptionHeading)[] = [
		{
			value: Path.ReportByDevices,
			label: Report.ByDevices,
		},
		{
			title: 'Отчеты УГЭ',
			withSeparator: true,
		},
		{
			value: Path.ReportByInputForms,
			label: Report.Technical,
		},
		{
			value: Path.ReportByPoints,
			label: Report.NSI,
		},
		{
			title: 'Технические отчеты',
			withSeparator: true,
		},
		{
			value: 'В разработке...',
			label: 'В разработке...',
			disabled: true,
		},
	];
	// Набор селектора "Балансы"
	const balancesOptions: (TOption | TOptionHeading)[] = [
		{
			value: Path.DevicesStatus,
			label: Balance.DevicesStatus,
		},
		{
			value: Path.RetrofittingAccountingNodes,
			label: Balance.RetrofittingAccountingNodes,
		},
		{
			value: Path.StatisticalProcessing,
			label: Balance.StatisticalProcessing,
		},
	];

	// Набор селектора "Оперативная справка"
	const operInformOptions: (TOption | TOptionHeading)[] = [
		{
			value: Path.ElectricPower,
			label: OperInform.ElectricPower,
		},
		{
			value: Path.NaturalGas,
			label: OperInform.NaturalGas,
		},
	];

	const reportSelectedOption: TOption = {
		value: 'Отчеты',
		label: 'Отчеты',
	};

	const balanceSelectedOption: TOption = {
		value: 'Балансы',
		label: 'Балансы',
	};

	const operInformSelectedOption: TOption = {
		value: 'Оперативная справка',
		label: 'Оперативная справка',
	};

	const isReportsActive = (): boolean => {
		const reports: string[] = reportsOptions
			.filter((report) => !isHeadingOption(report))
			.map((report) => (report as TOption).value);
		const flag: boolean = reports.some((report) =>
			location.pathname.includes(report),
		);
		return flag;
	};

	const isBalancesActive = (): boolean => {
		const balances: string[] = balancesOptions
			.filter((balance) => !isHeadingOption(balance))
			.map((balance) => (balance as TOption).value);
		const flag: boolean = balances.some((balance) =>
			location.pathname.includes(balance),
		);

		return flag;
	};

	const isOperInformActive = (): boolean => {
		const operInform: string[] = operInformOptions
			.filter((operInform) => !isHeadingOption(operInform))
			.map((operInform) => (operInform as TOption).value);
		const flag: boolean = operInform.some((operInform) =>
			location.pathname.includes(operInform),
		);

		return flag;
	};

	return {
		handleHomePageClick,
		handleRedirect,
		activeHeaderItem,
		reportsOptions,
		reportSelectedOption,
		balancesOptions,
		balanceSelectedOption,
		operInformOptions,
		operInformSelectedOption,
		handleSelectRedirect,
		isReportsActive,
		isBalancesActive,
		isOperInformActive,
	};
}

export default useHeader;
