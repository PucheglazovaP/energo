import { CircleNo, CircleYes } from '../../Icons';
import { Point } from '../../Models/Points/types';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import { DateFormat, formatDate } from '../../Utils/dateUtils';

import styles from '../../Containers/PointsReports/PointsReports.module.css';

export function linkedTableAdapter(point?: Point) {
	const channels = point?.channels || [];
	const header: ITableColumn[] = [
		{
			accessor: 'number',
			text: '№ канала.',
			sortOrder: 0,
		},
		{
			accessor: 'name',
			text: 'Наименование канала',
			sortOrder: 0,
		},
		{
			accessor: 'deviceNumber',
			text: '№ прибора',
			sortOrder: 0,
		},
		{
			accessor: 'deviceName',
			text: 'Наименование прибора',
			sortOrder: 0,
		},
		{
			accessor: 'coefficient',
			text: 'Коэфф.',
			sortOrder: 0,
		},
		{
			accessor: 'state',
			text: 'Статус',
			sortOrder: 0,
		},
		{
			accessor: 'startTime',
			text: 'Начало',
			sortOrder: 0,
		},
		{
			accessor: 'endTime',
			text: 'Окончание',
			sortOrder: 0,
		},
	];
	const data: ITableBody[] = channels.map((channel) => ({
		dataLine: [
			{
				accessor: 'number',
				text: channel.number,
			},
			{
				accessor: 'name',
				text: channel.name,
			},
			{
				accessor: 'deviceNumber',
				text: channel.deviceNumber,
			},
			{
				accessor: 'deviceName',
				text: channel.deviceName,
			},
			{
				accessor: 'coefficient',
				text: channel.coefficient,
			},
			{
				accessor: 'state',
				text: '',
				renderCell: () =>
					point?.channelNumber === channel.number ? (
						<CircleYes className={styles.state_active} />
					) : (
						<CircleNo className={styles.state_inactive} />
					),
			},
			{
				accessor: 'startTime',
				text: channel.startTime
					? formatDate(channel.startTime, DateFormat.DisplayFormatWithoutTime)
					: '-',
			},
			{
				accessor: 'endTime',
				text: channel.endTime
					? formatDate(channel.endTime, DateFormat.DisplayFormatWithoutTime)
					: '-',
			},
		],
	}));
	return { header, data };
}
