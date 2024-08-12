import { useEffect, useState } from 'react';
import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { $navigation } from '../../Models/Navigation';
import { setActiveVersionId } from '../../Models/Navigation/events';
import { fetchFormTreeDataFx } from '../../Models/TreeForms/effects';
import { loadForm } from '../../Models/TreeForms/events';
import { $versionsList } from '../../Models/VersionSelector';
import { Version } from '../../Models/VersionSelector/types';
import { Permissions } from '../../packages/KeycloakInstance/types';
import usePermissions from '../../packages/KeycloakInstance/usePermissions';
import { checkPermission } from '../../packages/KeycloakInstance/utils';
import { Path } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import Dropdown from '../../UI/Dropdown';
import { TOption, TOptionHeading } from '../../UI/Dropdown/types';
import { isHeadingOption } from '../../Utils/guards';
import { updateSearchParams } from '../../Utils/searchParams';

import { Balance, HeaderProps, OperInform, Report } from './types';

import styles from './Header.module.css';

function Header(props: HeaderProps) {
	const { className } = props;
	const { versions } = useStore($versionsList);
	const user = useStore($user);
	const { formId } = useStore($navigation);
	const location = useLocation();
	const permissions = usePermissions();
	const [downloadVersions, setDownloadVersions] = useState<Version[]>([
		{
			code: 0,
			name: 'Мониторинг',
			systemCode: 0,
		},
	]);

	const [selectedMonitoringOption, setSelectedMonitoringOption] =
		useState<TOption>({
			value: String(downloadVersions[0].code),
			label: String(downloadVersions[0].name),
		});

	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const handleSelectMonitoringOption = (option: TOption) => {
		setActiveVersionId(Number(option.value));
		setSelectedMonitoringOption(option);
		const updatedSearchParams: URLSearchParams = updateSearchParams(
			searchParams,
			{
				versionId: Number(option.value),
				deviceId: undefined,
				channelId: undefined,
				serverId: undefined,
				formId: undefined,
			},
		);
		setSearchParams(updatedSearchParams);
		// костылечек, чтобы при выбранной одной и той же версии все обновлялось
		if (selectedMonitoringOption.value === option.value && user) {
			const versionId = Number(option.value);
			if (versionId)
				fetchFormTreeDataFx({
					versionCode: versionId,
					userId: user.preferredUsername,
					moduleName: ModuleName.TreeForms_fetchFormTreeDataFx,
				}).then(() => {
					loadForm({
						versionId,
						formId,
						userId: user.preferredUsername,
					});
				});
		}
	};

	// Набор селектора "Мониторинг"
	const monitoringOptions: TOption[] = downloadVersions.map(
		(downloadVersion) => {
			return {
				value: String(downloadVersion.code),
				label: downloadVersion.name,
			};
		},
	);

	// Набор селектора "Отчеты"
	const reportsOptions: (TOption | TOptionHeading)[] = [
		{
			value: Path.ReportByDevices,
			label: Report.ByDevices,
			disabled: !checkPermission(permissions, Permissions.CanSeeDeviceReports),
		},
		{
			title: 'Отчеты УГЭ',
			withSeparator: true,
		},
		{
			value: Path.ReportByInputForms,
			label: Report.Technical,
			disabled: !checkPermission(permissions, Permissions.CanAccessOperWork),
		},
		{
			value: Path.ReportByPoints,
			label: Report.NSI,
			disabled: !checkPermission(permissions, Permissions.CanAccessNsi),
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
			disabled: !checkPermission(
				permissions,
				Permissions.CanAccessDevicesStatus,
			),
		},
		{
			value: Path.RetrofittingAccountingNodes,
			label: Balance.RetrofittingAccountingNodes,
			disabled: !checkPermission(
				permissions,
				Permissions.CanAccessRetrofittingAccountingNodes,
			),
		},
		{
			value: Path.StatisticalProcessing,
			label: Balance.StatisticalProcessing,
			disabled: !checkPermission(
				permissions,
				Permissions.CanAccessStatisticalProcessing,
			),
		},
	];

	// Набор селектора "Оперативная справка"
	const operInformOptions: (TOption | TOptionHeading)[] = [
		{
			value: Path.ElectricPower,
			label: OperInform.ElectricPower,
			disabled: !checkPermission(
				permissions,
				Permissions.CanAccessElectricPower,
			),
		},
		{
			value: Path.NaturalGas,
			label: OperInform.NaturalGas,
			disabled: !checkPermission(permissions, Permissions.CanAccessNaturalGas),
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

	// Логика селектора "Отчеты"
	const handleSelectReport = (selectedReportOption: TOption) => {
		navigate(selectedReportOption.value);
	};

	// Логика селектора "Балансы"
	const handleSelectBalance = (selectedBalanceOption: TOption) => {
		navigate(selectedBalanceOption.value);
	};

	// Логика селектора "Оперативная справка"
	const handleSelectOperInform = (selectedOperInformOption: TOption) => {
		navigate(selectedOperInformOption.value);
	};

	const handleRedirectToRoot = () => {
		window.location.replace(window.location.origin);
	};

	/* Логика наполнения downloadVersions данными и когда подгрузились данные,
	 присваиваем значение selectedMonitoringOption в Dropdown */
	useEffect(() => {
		if (versions.length > 0) {
			setDownloadVersions(versions);
			setSelectedMonitoringOption({
				value: String(versions[0].code),
				label: String(versions[0].name),
			});
		}
	}, [versions]);

	return (
		<div className={clsx(styles.root, className)}>
			<a
				href={window.location.origin}
				rel="noreferrer"
				className={styles.link}
				onClick={handleRedirectToRoot}
			>
				Конфигуратор тэгов
			</a>
			{!location.pathname.includes(Path.Monitoring) ? (
				<Link to={Path.Monitoring} className={styles.link}>
					Мониторинг
				</Link>
			) : (
				<Dropdown
					options={monitoringOptions}
					selectedOption={selectedMonitoringOption}
					setSelectedOption={handleSelectMonitoringOption}
					isActive={true}
					className={styles.dropdown}
				/>
			)}
			<Link
				to={Path.EmergencyEvents}
				className={clsx(
					styles.link,
					location.pathname.includes(Path.EmergencyEvents) &&
						styles.link__active,
					!checkPermission(permissions, Permissions.CanViewEmergencyEvents) &&
						styles.link__disabled,
				)}
			>
				Аварийные события
			</Link>
			<Dropdown
				options={operInformOptions}
				selectedOption={operInformSelectedOption}
				setSelectedOption={handleSelectOperInform}
				isActive={isOperInformActive()}
				className={styles.dropdown}
			/>
			<Link
				to={Path.NSI}
				className={clsx(
					styles.link,
					location.pathname.includes(Path.NSI) && styles.link__active,
					!checkPermission(permissions, Permissions.CanAccessNSIPage) &&
						styles.link__disabled,
				)}
			>
				НСИ
			</Link>
			<Dropdown
				options={reportsOptions}
				selectedOption={reportSelectedOption}
				setSelectedOption={handleSelectReport}
				isActive={isReportsActive()}
				className={styles.dropdown}
			/>
			<Dropdown
				options={balancesOptions}
				selectedOption={balanceSelectedOption}
				setSelectedOption={handleSelectBalance}
				isActive={isBalancesActive()}
				className={styles.dropdown}
			/>
		</div>
	);
}

export default Header;
