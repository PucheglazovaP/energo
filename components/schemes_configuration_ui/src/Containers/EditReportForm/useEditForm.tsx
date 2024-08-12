import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { GroupListItem } from '../../Models/HardwareGroup/types';
import { $navigation } from '../../Models/Navigation';
import { $reportForm } from '../../Models/ReportFormProperties';
import {
	removeSelectedGroupList,
	selectAllGroupsInReportForm,
	selectGroup,
	selectGroupInReportForm,
} from '../../Models/ReportFormProperties/events';
import Checkbox from '../../UI/Checkbox';
import { TableCell } from '../../UI/TablePair/types';

import {
	RenderHardwareGroupColumnFilterEWork,
	RenderHardwareGroupColumnFilterMethod,
	RenderHardwareGroupColumnFilterName,
	RenderHardwareGroupColumnFilterNumber,
} from './tableRenderCells';
import { getMethodColor, isDeviceSelected, isGroupSelected } from './utils';

import styles from './EditReportForm.module.css';

export function useEditForm() {
	const {
		groupsInReportForm,
		formId,
		devices,
		selectedGroups,
		selectedGroupsInReportForm,
	} = useStore($reportForm);

	const { versionId } = useStore($navigation);

	const onDeviceToggle = useCallback(
		(groupItem: GroupListItem, isChecked: boolean) => {
			selectGroup({ groupItem, isChecked });
		},
		[],
	);
	const filteredDevices = useMemo(
		() =>
			devices.filter(
				(device) =>
					!groupsInReportForm.some(
						(item) => item.groupNumber === device.number,
					),
			),
		[devices, groupsInReportForm],
	);
	const onGroupHeaderCheckboxToggle = useCallback(() => {
		removeSelectedGroupList();
	}, []);
	const devicesTableRows: TableCell[][] = useMemo(
		() => [
			[
				{
					name: 'checked',
					value: '',
					renderCell: () => (
						<Checkbox
							name={`all-groups-header-checkbox`}
							title=""
							disabled={selectedGroups.length === 0}
							checked={selectedGroups.length > 0}
							onChange={onGroupHeaderCheckboxToggle}
							className={clsx(styles.checkbox, styles.devices_checkbox)}
						/>
					),
				},
				{
					name: 'number',
					value: '№',
					renderCell: RenderHardwareGroupColumnFilterNumber,
				},
				{
					name: '№ eWork',
					value: 'eWork',
					renderCell: RenderHardwareGroupColumnFilterEWork,
				},
				{
					name: 'name',
					value: 'Наименование',
					renderCell: RenderHardwareGroupColumnFilterName,
				},
				{
					name: 'method',
					value: 'Метод',
					renderCell: RenderHardwareGroupColumnFilterMethod,
				},
			],
			...filteredDevices.map((e) => {
				const isChecked = isDeviceSelected(e, selectedGroups);
				const methodColor = getMethodColor(e.method);
				return [
					{
						name: 'checked',
						value: 'false',
						renderCell: () => (
							<Checkbox
								name={`group-${e.number}`}
								title=""
								checked={isChecked}
								onChange={() => {
									onDeviceToggle(e, !isChecked);
								}}
								className={styles.checkbox}
							/>
						),
					},
					{ name: 'number', value: e.number },
					{ name: '№ eWork', value: e.EWorkNumber },
					{ name: 'name', value: e.name },
					{
						name: 'method',
						value: e.method,
						renderCell: () => (
							<div
								className={styles.method_cell}
								style={{ backgroundColor: methodColor }}
							>
								{e.method}
							</div>
						),
					},
				];
			}),
		],
		[filteredDevices, selectedGroups, onGroupHeaderCheckboxToggle],
	);

	const onToggle = (groupNumber: number, isChecked: boolean) => {
		selectGroupInReportForm({ groupNumber, isChecked });
	};
	const onHeaderCheckboxToggle = () => {
		selectAllGroupsInReportForm();
	};
	const isHeaderCheckboxChecked = selectedGroupsInReportForm.length > 0;
	const tableRows: TableCell[][] = [
		[
			{
				name: 'Checkbox',
				value: '',
				width: 46,
				renderCell: () => (
					<Checkbox
						name={`group-header-checkbox`}
						title=""
						checked={isHeaderCheckboxChecked}
						onChange={onHeaderCheckboxToggle}
						className={styles.checkbox}
					/>
				),
			},
			{
				name: 'Order',
				value: 'П/п',
				width: 76,
			},
			{
				name: 'Group',
				value: 'Группа',
				width: 80,
			},
			{
				name: 'Name',
				value: 'Название группы',
			},
		],
		...groupsInReportForm.map((item) => {
			const isChecked = isGroupSelected(item, selectedGroupsInReportForm);
			return [
				{
					name: 'Checkbox',
					value: '',
					width: 45,
					renderCell: () => (
						<Checkbox
							name={`form-report-group-${item.groupNumber}`}
							title=""
							checked={isChecked}
							onChange={() => {
								onToggle(item.groupNumber, !isChecked);
							}}
							className={styles.checkbox}
						/>
					),
				},
				{
					name: 'Order',
					value: item.order,
					width: 75,
				},
				{
					name: 'Group',
					value: item.groupNumber,
					width: 80,
				},
				{
					name: 'Name',
					value: item.name,
				},
			];
		}),
	];

	return {
		tableRows,
		formId,
		devicesTableRows,
		versionId,
		selectedGroups,
		selectedGroupsInReportForm,
		groupsInReportForm,
	};
}
