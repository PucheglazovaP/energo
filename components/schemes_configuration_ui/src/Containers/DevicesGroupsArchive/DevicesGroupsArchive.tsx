import { useEffect, useState } from 'react';
import { useStore } from 'effector-react';

import WarningIcon from '../../Icons/Warning';
import { $user } from '../../Models/Auth';
import { getDevicesGroupsArchiveFx } from '../../Models/Devices/effects';
import { DevicesArchiveList } from '../../Models/Devices/types';
import { $formContextMenu } from '../../Models/FormContextMenu';
import { ModuleName } from '../../Shared/Types/moduleName';
import Spinner from '../../UI/Spinner';
import Table from '../../UI/Table';
import { ITableBody, ITableColumn } from '../../UI/Table/types';

import { NameCell } from './NameCell';

import styles from './DevicesGroupsArchive.module.css';

function DevicesGroupsArchive() {
	const user = useStore($user);
	const { object: contextMenuObject } = useStore($formContextMenu);

	const [devicesArchiveList, setDevicesArchiveList] = useState<
		DevicesArchiveList[]
	>([]);
	const isLoading = useStore(getDevicesGroupsArchiveFx.pending);

	useEffect(() => {
		if (!user) return;
		if (contextMenuObject && contextMenuObject.groupId)
			getDevicesGroupsArchiveFx({
				number: contextMenuObject.groupId,
				userId: user.preferredUsername,
				moduleName: ModuleName.DevicesGroupsArchive_getDevicesGroupsArchiveFx,
			}).then((devicesArchiveList) => {
				setDevicesArchiveList(devicesArchiveList);
			});
	}, []);

	const headers: ITableColumn[] = [
		{
			accessor: 'device',
			sortOrder: 0,
			text: 'Прибор',
			width: 15,
		},
		{
			accessor: 'name',
			sortOrder: 0,
			text: 'Точка учета',
			renderCell: ({ data }) => <NameCell {...data} />,
		},
		{
			accessor: 'deviceType',
			sortOrder: 0,
			text: 'Тип прибора',
			width: 150,
		},
	];
	const tableData: ITableBody[] = devicesArchiveList.map((device) => ({
		dataLine: [
			{
				accessor: 'device',
				text: device.number,
			},
			{
				accessor: 'name',
				text: device.name,
				number: device.number,
			},
			{
				accessor: 'deviceType',
				text: device.deviceType,
			},
		],
		rowClassName: styles.row,
	}));

	return (
		<div className={styles.root}>
			<div className={styles.title}>{contextMenuObject?.groupName}</div>
			{isLoading ? (
				<div className={styles.spinner}>
					<Spinner className={styles.loading} />
				</div>
			) : devicesArchiveList.length > 0 ? (
				<Table headers={headers} data={tableData} className={styles.table} />
			) : (
				<div className={styles.no_data}>
					<WarningIcon className={styles.icon} />
					<span className={styles.no_data_message}>Данные отсутсвуют</span>
				</div>
			)}
		</div>
	);
}

export default DevicesGroupsArchive;
