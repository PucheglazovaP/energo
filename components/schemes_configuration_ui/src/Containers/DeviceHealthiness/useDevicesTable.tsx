import { useEffect, useState } from 'react';
import { AngleDown, Button } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Sort } from '../../Icons';
import { $user } from '../../Models/Auth';
import { $deviceHealthiness } from '../../Models/DeviceHealthiness';
import { fetchDiagnosticGroupCurrentStateFx } from '../../Models/DeviceHealthiness/effects';
import {
	collapseDevices,
	toggleExpandDevice,
} from '../../Models/DeviceHealthiness/events';
import { setSelectedDeviceIdEvent } from '../../Models/DiagnosticCurrent/events';
import { $formContextMenu } from '../../Models/FormContextMenu';
import { $navigation } from '../../Models/Navigation';
import { SortOrder, TreeTypes } from '../../Shared/types';
import { TransparentConfiguration } from '../../Shared/Types/formObject';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import { DateFormat, formatDate } from '../../Utils/dateUtils';
import { getNumber } from '../../Utils/guards';
import { getSortOrder, sortByOrder } from '../../Utils/tableUtils';

import DeviceHealthinessHeader from './DeviceHealthinessHeader';
import DeviceHealthinessHighlightCell from './DeviceHealthinessHighlightCell';
import DeviceHealthinessSection from './DeviceHealthinessSection';

import styles from './DeviceHealthiness.module.css';

type Accessors =
	| 'name'
	| 'id'
	| 'date'
	| 'ok'
	| 'crc'
	| 'timeout'
	| 'timeoutICP'
	| '';
type SortOptions = {
	accessor: Accessors;
	order: SortOrder;
};

function useDevicesTable() {
	const user = useStore($user);
	const { object } = useStore($formContextMenu);
	const transparent = object as TransparentConfiguration;
	const { devices, expandedDevices } = useStore($deviceHealthiness);
	const isLoading = useStore(fetchDiagnosticGroupCurrentStateFx.pending);
	const { versionId, diagnosticId } = useStore($navigation);

	const [sortOptions, setSortOptions] = useState<SortOptions>({
		accessor: '',
		order: SortOrder.None,
	});

	const getUrl = (deviceId: number): string => {
		const path: string = `/monitoring/?versionId=${versionId}&treeType=${TreeTypes.Mnemoschemes}&formId=${diagnosticId}&deviceId=${deviceId}`;
		return path;
	};

	const handleExpand = (accessor: string) => {
		setSelectedDeviceIdEvent(accessor);
		toggleExpandDevice(Number(accessor));
	};

	const handleSortOptions = (accessor: Accessors) => {
		if (sortOptions.accessor === accessor) {
			const order: SortOrder = getSortOrder(sortOptions.order);
			setSortOptions({ accessor, order });
		} else {
			setSortOptions({
				accessor,
				order: SortOrder.Asc,
			});
		}
	};

	const getSortStyles = (accessor: Accessors) => {
		return {
			[styles.sort_icon_asc]:
				sortOptions.accessor === accessor &&
				sortOptions.order === SortOrder.Asc,
			[styles.sort_icon_desc]:
				sortOptions.accessor === accessor &&
				sortOptions.order === SortOrder.Desc,
			[styles.sort_icon]: true,
		};
	};

	const headers: ITableColumn[] = [
		{
			accessor: 'expand',
			sortOrder: 0,
			text: '',
			width: 15,
			renderHeaderCell: () => (
				<Button
					onClick={() => collapseDevices()}
					className={styles.section_expand}
				>
					<AngleDown className={styles.arrow_header} />
				</Button>
			),
		},
		{
			accessor: 'name',
			sortOrder: 0,
			text: 'Название прибора',
			renderHeaderCell: () => (
				<DeviceHealthinessHeader>
					<span>Название прибора</span>
					<Button
						onClick={() => handleSortOptions('name')}
						className={styles.section_expand}
					>
						<Sort className={clsx(getSortStyles('name'))} />
					</Button>
				</DeviceHealthinessHeader>
			),
		},
		{
			accessor: 'id',
			sortOrder: 0,
			text: 'Номер',
			width: 100,
			renderHeaderCell: () => (
				<DeviceHealthinessHeader>
					<span>Номер</span>
					<Button
						onClick={() => handleSortOptions('id')}
						className={styles.section_expand}
					>
						<Sort className={clsx(getSortStyles('id'))} />
					</Button>
				</DeviceHealthinessHeader>
			),
		},
		{
			accessor: 'date',
			sortOrder: 0,
			text: 'Дата и время',
			width: 140,
			renderHeaderCell: () => (
				<DeviceHealthinessHeader>
					<span>Дата и время</span>
					<Button
						className={styles.section_expand}
						onClick={() => handleSortOptions('date')}
					>
						<Sort className={clsx(getSortStyles('date'))} />
					</Button>
				</DeviceHealthinessHeader>
			),
		},
		{
			accessor: 'ok',
			sortOrder: 0,
			text: 'OK',
			width: 70,
			renderCell: ({ data }) => (
				<DeviceHealthinessHighlightCell
					backgroundColor={data.backgroundColor}
					text={String(data.text)}
				/>
			),
			renderHeaderCell: () => (
				<DeviceHealthinessHeader>
					<span className={styles.table_header_underline}>OK</span>
					<Button
						className={styles.section_expand}
						onClick={() => handleSortOptions('ok')}
					>
						<Sort className={clsx(getSortStyles('ok'))} />
					</Button>
				</DeviceHealthinessHeader>
			),
		},
		{
			accessor: 'crc',
			sortOrder: 0,
			text: 'CRC',
			width: 95,
			renderCell: ({ data }) => (
				<DeviceHealthinessHighlightCell
					backgroundColor={data.backgroundColor}
					text={String(data.text)}
				/>
			),
			renderHeaderCell: () => (
				<DeviceHealthinessHeader>
					<span className={styles.table_header_underline}>CRC</span>
					<Button
						className={styles.section_expand}
						onClick={() => handleSortOptions('crc')}
					>
						<Sort className={clsx(getSortStyles('crc'))} />
					</Button>
				</DeviceHealthinessHeader>
			),
		},
		{
			accessor: 'timeout',
			sortOrder: 0,
			text: 'Timeout',
			width: 95,
			renderCell: ({ data }) => (
				<DeviceHealthinessHighlightCell
					backgroundColor={data.backgroundColor}
					text={String(data.text)}
				/>
			),
			renderHeaderCell: () => (
				<DeviceHealthinessHeader>
					<span className={styles.table_header_underline}>Timeout</span>
					<Button
						className={styles.section_expand}
						onClick={() => handleSortOptions('timeout')}
					>
						<Sort className={clsx(getSortStyles('timeout'))} />
					</Button>
				</DeviceHealthinessHeader>
			),
		},
		{
			accessor: 'timeoutICP',
			sortOrder: 0,
			text: 'Timeout ICP-CON',
			width: 160,
			renderCell: ({ data }) => (
				<DeviceHealthinessHighlightCell
					backgroundColor={data.backgroundColor}
					text={String(data.text)}
				/>
			),
			renderHeaderCell: () => (
				<DeviceHealthinessHeader>
					<span className={styles.table_header_underline}>Timeout ICP-Con</span>
					<Button
						className={styles.section_expand}
						onClick={() => handleSortOptions('timeoutICP')}
					>
						<Sort className={clsx(getSortStyles('timeoutICP'))} />
					</Button>
				</DeviceHealthinessHeader>
			),
		},
	];

	const tableData: ITableBody[] = devices.map((device) => ({
		dataLine: [
			{
				accessor: 'expand',
				text: '',
				renderCell: () => (
					<Button
						onClick={() => handleExpand(String(device.id))}
						className={clsx(styles.section_expand, {
							[styles.section_expand_expanded]: !!expandedDevices.get(
								device.id,
							),
						})}
					>
						<AngleDown className={styles.section_arrow} />
					</Button>
				),
			},
			{
				accessor: 'name',
				text: device.name,
			},
			{
				accessor: 'id',
				text: device.id,
			},
			{
				accessor: 'date',
				text: formatDate(device.date, DateFormat.DefaultDisplayFormat),
			},
			{
				accessor: 'ok',
				text: device.ok,
				backgroundColor: device.okColor,
			},
			{
				accessor: 'crc',
				text: device.crc,
				backgroundColor: device.crcColor,
			},
			{
				accessor: 'timeout',
				text: device.timeout,
				backgroundColor: device.timeoutColor,
			},
			{
				accessor: 'timeoutICP',
				text: device.timeoutICP,
				backgroundColor: device.timeoutICPColor,
			},
		],
		isCollapsed: !!expandedDevices.get(device.id),
		child: () => (
			<DeviceHealthinessSection id={device.id} path={getUrl(device.id)} />
		),
		rowClassName: clsx(styles.row, {
			[styles.row_expanded]: !!expandedDevices.get(device.id),
		}),
	}));

	const finalData: ITableBody[] =
		sortOptions.order === SortOrder.None
			? tableData
			: sortByOrder(tableData, sortOptions.accessor, sortOptions.order);

	useEffect(() => {
		if (!user) return;
		fetchDiagnosticGroupCurrentStateFx({
			groupId: getNumber(transparent.groupId),
			userId: user.preferredUsername,
		});
	}, [transparent.groupId, user]);

	return {
		isLoading,
		headers,
		devices: finalData,
		handleExpand,
	};
}

export default useDevicesTable;
