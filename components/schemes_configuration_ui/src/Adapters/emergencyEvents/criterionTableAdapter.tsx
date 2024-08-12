import { Calendar } from '@evraz/ui-kit';

import InputCell from '../../Containers/EditEmergencyEventsReportForm/InputCell';
import IconClose from '../../Icons/Close';
import {
	DeleteParameterCriterionsParams,
	EditParameterCriterionsParams,
	ParameterCriterions,
	UserId,
} from '../../Shared/types';
import { Module, ModuleName } from '../../Shared/Types/moduleName';
import Checkbox from '../../UI/Checkbox';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import {
	DateFormat,
	formatDate,
	formatToDatabaseFormat,
} from '../../Utils/dateUtils';

import styles from '../../Containers/EditEmergencyEventsReportForm/EditEmergencyEventsReportForm.module.css';

export interface TableAdapterParams extends UserId, Module {
	parameterId: number;
	criterions: ParameterCriterions[];
	handleEditCriterion: (data: EditParameterCriterionsParams) => void;
	handleDeleteCriterion: (data: DeleteParameterCriterionsParams) => void;
	handleRowClick: (rowIndex: number) => void;
	dataType: string;
}

export function tableAdapter({
	parameterId,
	criterions,
	handleEditCriterion,
	handleDeleteCriterion,
	handleRowClick,
	userId,
	moduleName,
	dataType,
}: TableAdapterParams) {
	const header: ITableColumn[] = [
		{
			accessor: 'controlGroupNumber',
			text: '№ группы',
			sortOrder: 0,
		},
		{
			accessor: 'dataType',
			text: 'Вид данных',
			sortOrder: 0,
		},
		{
			accessor: 'dynamicObjectGroupNumber',
			text: '№ группы',
			sortOrder: 0,
		},
		{
			accessor: 'min',
			text: 'Min',
			sortOrder: 0,
		},
		{
			accessor: 'max',
			text: 'Max',
			sortOrder: 0,
		},
		{
			accessor: 'unit',
			text: 'Ед. измерения',
			sortOrder: 0,
			width: 90,
			minWidth: 90,
		},
		{
			accessor: 'evaluationInterval',
			text: 'Интервал (мин)',
			sortOrder: 0,
		},
		{
			accessor: 'startDateTime',
			text: 'Начало',
			sortOrder: 0,
		},
		{
			accessor: 'endDateTime',
			text: 'Окончание',
			sortOrder: 0,
		},
		{
			accessor: 'delete',
			text: '',
			sortOrder: 0,
			width: 30,
		},
	];
	const data: ITableBody[] = criterions.map((criterion, index) => {
		const {
			id,
			evaluationInterval,
			max,
			min,
			startDateTime,
			endDateTime,
			lastModified,
		} = criterion;
		const editChannelData = {
			id,
			evaluationInterval,
			max,
			min,
			startDateTime,
			endDateTime,
			lastModified,
			userId,
			parameterId,
			moduleName,
		};

		return {
			onRowClick: () => {
				handleRowClick(index);
			},
			dataLine: [
				{
					accessor: 'controlGroupNumber',
					text: criterion.controlGroupNumber || '',
				},
				{
					accessor: 'dataType',
					text: dataType,
				},
				{
					accessor: 'dynamicObjectGroupNumber',
					text: criterion.dynamicObjectGroupNumber || '',
				},
				{
					accessor: 'min',
					text: criterion.min || '',
					renderCell: () => (
						<InputCell
							value={criterion.min}
							onEdit={(value) => {
								handleEditCriterion({
									...editChannelData,
									min: value,
									moduleName: ModuleName.TableAdapter_handleEditCriterion_min,
								});
							}}
						/>
					),
				},
				{
					accessor: 'max',
					text: criterion.max || '',
					renderCell: () => (
						<InputCell
							value={editChannelData.max}
							onEdit={(value) => {
								handleEditCriterion({
									...editChannelData,
									max: value,
									moduleName: ModuleName.TableAdapter_handleEditCriterion_max,
								});
							}}
						/>
					),
				},
				{
					accessor: 'unit',
					text: criterion.unitName,
				},
				{
					accessor: 'evaluationInterval',
					text: criterion.evaluationInterval || '',
					renderCell: () => (
						<InputCell
							value={editChannelData.evaluationInterval}
							onEdit={(value) => {
								handleEditCriterion({
									...editChannelData,
									evaluationInterval: value,
									moduleName:
										ModuleName.TableAdapter_handleEditCriterion_evaluationInterval,
								});
							}}
						/>
					),
				},
				{
					accessor: 'startDateTime',
					text: criterion.startDateTime
						? formatDate(
								criterion.startDateTime,
								DateFormat.DisplayFormatWithoutTime,
						  )
						: '-',
					renderCell: () => (
						<div
							className={styles.date}
							onClick={(e) => e.stopPropagation()}
							aria-hidden="true"
						>
							<Calendar
								className={styles.calendar}
								dates={[new Date(criterion.startDateTime)]}
								onSelect={(period) => {
									handleEditCriterion({
										...editChannelData,
										startDateTime: formatToDatabaseFormat(period[0]),
										moduleName:
											ModuleName.TableAdapter_handleEditCriterion_startDateTime,
									});
								}}
								disableTypeSelector
								disableManualInput={false}
								isCloseOnSelect={false}
							/>
						</div>
					),
				},
				{
					accessor: 'endDateTime',
					text: criterion.endDateTime
						? formatDate(
								criterion.endDateTime,
								DateFormat.DisplayFormatWithoutTime,
						  )
						: '-',
					renderCell: () => (
						<div
							className={styles.date}
							onClick={(e) => e.stopPropagation()}
							aria-hidden="true"
						>
							<Checkbox
								name={'checkEnd'}
								checked={Boolean(criterion.endDateTime)}
								onChange={() => {
									handleEditCriterion({
										...editChannelData,
										endDateTime: criterion.endDateTime
											? null
											: formatToDatabaseFormat(new Date()),
										moduleName:
											ModuleName.TableAdapter_handleEditCriterion_endDateTime_Checkbox,
									});
								}}
								className={styles.checkbox}
							/>
							<Calendar
								className={styles.calendar}
								dates={[
									criterion.endDateTime
										? new Date(criterion.endDateTime)
										: new Date(),
									criterion.endDateTime
										? new Date(criterion.endDateTime)
										: new Date(),
								]}
								onSelect={(period) => {
									handleEditCriterion({
										...editChannelData,
										endDateTime: formatToDatabaseFormat(period[0]),
										moduleName:
											ModuleName.TableAdapter_handleEditCriterion_endDateTime_Calendar,
									});
								}}
								disableTypeSelector
								disabled={!criterion.endDateTime}
								disableManualInput={false}
								isCloseOnSelect={false}
							/>
						</div>
					),
				},
				{
					accessor: 'delete',
					text: '',
					renderCell: () => (
						<button
							type="button"
							className={styles.delete_button}
							onClick={() =>
								handleDeleteCriterion({ id, lastModified, userId, moduleName })
							}
						>
							<IconClose className={styles.cross} />
						</button>
					),
				},
			],
		};
	});
	return { header, data };
}
