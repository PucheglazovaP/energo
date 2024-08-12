import { ChangeEvent } from 'react';
import { Calendar } from '@evraz/ui-kit';

import {
	DeleteParams,
	EditPointChannelParams,
	Point,
} from '../../Models/Points/types';
import { UserId } from '../../Shared/types';
import { Module, ModuleName } from '../../Shared/Types/moduleName';
import Checkbox from '../../UI/Checkbox';
import Input from '../../UI/Input';
import { IconDelete } from '../../UI/Parameter/iconEditing';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import {
	DateFormat,
	formatDate,
	formatToDatabaseFormat,
} from '../../Utils/dateUtils';

import styles from '../../Containers/EditPointLinkedChannels/EditPointLinkedChannels.module.css';

export interface PointChannels extends UserId, Module {
	point?: Point;
	handleEditChannel: (data: EditPointChannelParams) => void;
	handleDeleteChannel: (data: DeleteParams) => void;
}

export function pointChannelsAdapter({
	point,
	handleEditChannel,
	handleDeleteChannel,
	userId,
	moduleName,
}: PointChannels) {
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
			width: 460,
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
			accessor: 'baseValue',
			text: 'Нач. значение',
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
		{
			accessor: 'delete',
			text: '',
			sortOrder: 0,
			width: 50,
		},
	];
	const data: ITableBody[] = channels.map((channel) => {
		const {
			id,
			number,
			coefficient,
			baseValue,
			startTime,
			endTime,
			lastModified,
		} = channel;

		const editChannelData = {
			id,
			number,
			coefficient,
			baseValue,
			startTime,
			endTime,
			lastModified,
			moduleName: ModuleName.PointChannelsAdapter_editChannelData,
		};

		return {
			dataLine: [
				{
					accessor: 'number',
					text: channel.number,
				},
				{
					accessor: 'name',
					text: channel.name,
					renderCell: () => (
						<span className={styles.table_text} title={channel.name}>
							{channel.name}
						</span>
					),
				},
				{
					accessor: 'deviceNumber',
					text: channel.deviceNumber,
				},
				{
					accessor: 'deviceName',
					text: channel.deviceName,
					renderCell: () => (
						<span className={styles.table_text} title={channel.deviceName}>
							{channel.deviceName}
						</span>
					),
				},
				{
					accessor: 'coefficient',
					text: editChannelData.coefficient,
					renderCell: () => (
						<Input
							type="number"
							defaultValue={Number(editChannelData.coefficient)}
							onBlur={(e: ChangeEvent<HTMLInputElement>) => {
								if (editChannelData.coefficient !== Number(e.target.value))
									handleEditChannel({
										...editChannelData,
										userId,
										coefficient: Number(e.target.value),
									});
							}}
						/>
					),
				},
				{
					accessor: 'baseValue',
					text: editChannelData.baseValue,
					renderCell: () => (
						<Input
							type="number"
							defaultValue={Number(editChannelData.baseValue)}
							onBlur={(e: ChangeEvent<HTMLInputElement>) => {
								if (editChannelData.baseValue !== Number(e.target.value))
									handleEditChannel({
										...editChannelData,
										userId,
										baseValue: Number(e.target.value),
									});
							}}
						/>
					),
				},
				{
					accessor: 'startTime',
					text: editChannelData.startTime
						? formatDate(
								editChannelData.startTime,
								DateFormat.DisplayFormatWithoutTime,
						  )
						: '-',
					renderCell: () => (
						<div className={styles.date}>
							<Checkbox
								name={`checkStart_${editChannelData.id}`}
								checked={Boolean(editChannelData.startTime)}
								onChange={() => {
									handleEditChannel({
										...editChannelData,
										userId,
										startTime: editChannelData.startTime
											? null
											: formatToDatabaseFormat(new Date()),
									});
								}}
								className={styles.checkbox}
							/>
							<Calendar
								className={styles.calendar}
								dates={[
									editChannelData.startTime
										? new Date(editChannelData.startTime)
										: new Date(),
									editChannelData.startTime
										? new Date(editChannelData.startTime)
										: new Date(),
								]}
								onSelect={(period) => {
									handleEditChannel({
										...editChannelData,
										userId,
										startTime: formatToDatabaseFormat(period[0]),
									});
								}}
								disableTypeSelector
								disabled={!editChannelData.startTime}
								disableManualInput={false}
								isCloseOnSelect={false}
							/>
						</div>
					),
				},
				{
					accessor: 'endTime',
					text: editChannelData.endTime
						? formatDate(
								editChannelData.endTime,
								DateFormat.DisplayFormatWithoutTime,
						  )
						: '-',
					renderCell: () => (
						<div className={styles.date}>
							<Checkbox
								name={`checkEnd_${editChannelData.id}`}
								checked={Boolean(editChannelData.endTime)}
								onChange={() => {
									handleEditChannel({
										...editChannelData,
										userId,
										endTime: editChannelData.endTime
											? null
											: formatToDatabaseFormat(new Date()),
									});
								}}
								className={styles.checkbox}
							/>
							<Calendar
								className={styles.calendar}
								dates={[
									editChannelData.endTime
										? new Date(editChannelData.endTime)
										: new Date(),
									editChannelData.endTime
										? new Date(editChannelData.endTime)
										: new Date(),
								]}
								onSelect={(period) => {
									handleEditChannel({
										...editChannelData,
										userId,
										endTime: formatToDatabaseFormat(period[0]),
									});
								}}
								disableTypeSelector
								disabled={!editChannelData.endTime}
								disableManualInput={false}
								isCloseOnSelect={false}
							/>
						</div>
					),
				},
				{
					accessor: 'delete',
					text: '',
					renderCell: () =>
						channel.canDelete ? (
							<button
								type="button"
								className={styles.delete_button}
								onClick={() =>
									handleDeleteChannel({
										id,
										lastModified,
										userId,
										moduleName,
									})
								}
							>
								<IconDelete className={styles.cross} />
							</button>
						) : (
							<></>
						),
				},
			],
		};
	});
	return { header, data };
}
