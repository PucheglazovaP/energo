import React, { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $heatingSeasons } from '../../Models/HeatingSeasons';
import { getHeatingSeasonsFx } from '../../Models/HeatingSeasons/effects';
import { changeCurrentHeatingSeasonId } from '../../Models/HeatingSeasons/events';
import {
	HeatingSeason,
	HeatingSeasonStatus,
} from '../../Models/HeatingSeasons/types';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import { DateFormat, formatDate } from '../../Utils/dateUtils';

import { heatingSeasonStatusList } from './const';
import { HeatingSeasonButtons } from './HeatingSeasonButtons';
import { HeatingSeasonInfoItem } from './HeatingSeasonInfoItem';
import { HeatingSeasonsAccessors } from './types';

import styles from './HeatingSeasons.module.css';

export function useHeatingSeasons() {
	const { heatingSeasons, isLoading } = useStore($heatingSeasons);

	const heatingSeasonsTableHeader: ITableColumn[] = useMemo(
		() => [
			{
				accessor: HeatingSeasonsAccessors.SeasonStartDate,
				text: 'Начало',
				isResizable: false,
				isSortable: false,
				sortOrder: 0,
				width: 90,
			},
			{
				accessor: HeatingSeasonsAccessors.SeasonEndDate,
				text: 'Окончание',
				isResizable: false,
				isSortable: false,
				sortOrder: 0,
				width: 90,
			},
			{
				accessor: HeatingSeasonsAccessors.Info,
				text: '',
				isResizable: false,
				isSortable: false,
				sortOrder: 0,
				width: 34,
			},
			{
				accessor: HeatingSeasonsAccessors.Buttons,
				text: '',
				isResizable: false,
				isSortable: false,
				sortOrder: 0,
				width: 84,
			},
			{
				accessor: HeatingSeasonsAccessors.Status,
				text: 'Статус',
				isResizable: false,
				isSortable: false,
				sortOrder: 0,
				width: 104,
			},
		],
		[],
	);

	// Вызов модального окна для редактирования отопительного сезона
	const onHeatingSeasonUpdate = useCallback(
		(seasonId: number) => () => {
			changeCurrentHeatingSeasonId(seasonId);
			openModal(RegisteredModals.EditHeatingSeason);
		},
		[],
	);

	// Вызов модального окна для добавления отопительного сезона
	const onHeatingSeasonAdd = useCallback(() => {
		openModal(RegisteredModals.AddHeatingSeason);
	}, []);

	// Вызов модального окна для удаления отопительного сезона
	const onHeatingSeasonDelete = useCallback(
		(seasonId: number) => () => {
			changeCurrentHeatingSeasonId(seasonId);
			openModal(RegisteredModals.DeleteHeatingSeason);
		},
		[],
	);

	// Тело таблицы отопительных сезонов
	const heatingSeasonsTableBody = useMemo(() => {
		const heatingSeasonsTable: ITableBody[] = heatingSeasons.map(
			(season: HeatingSeason) => ({
				dataLine: [
					{
						accessor: HeatingSeasonsAccessors.SeasonStartDate,
						text: formatDate(
							season.seasonStartDate as string,
							DateFormat.DisplayFormatWithoutTime,
						),
					},
					{
						accessor: HeatingSeasonsAccessors.SeasonEndDate,
						text: season.seasonEndDate
							? formatDate(
									season.seasonEndDate,
									DateFormat.DisplayFormatWithoutTime,
							  )
							: '-',
					},
					{
						accessor: HeatingSeasonsAccessors.Info,
						text: '',
						renderCell: () => (
							<HeatingSeasonInfoItem
								createdBy={season.createdBy}
								creationDate={season.creationDate}
								modifications={season.modifications}
							/>
						),
					},
					{
						accessor: HeatingSeasonsAccessors.Buttons,
						text: '',
						renderCell: () => (
							<HeatingSeasonButtons
								onHeatingSeasonDelete={onHeatingSeasonDelete(season.seasonCode)}
								onHeatingSeasonUpdate={onHeatingSeasonUpdate(season.seasonCode)}
							/>
						),
					},
					{
						accessor: HeatingSeasonsAccessors.Status,
						text: heatingSeasonStatusList[season.status],
						className: clsx(
							styles.cell,
							styles.status,
							season.status === HeatingSeasonStatus.Current &&
								styles.status__active,
						),
					},
				],
			}),
		);

		return heatingSeasonsTable;
	}, [heatingSeasons, onHeatingSeasonDelete, onHeatingSeasonUpdate]);

	const onGetHeatingSeasons = useCallback(() => {
		getHeatingSeasonsFx();
	}, []);

	// Первая загрузка отопительных сезонов
	useEffect(() => {
		getHeatingSeasonsFx();
	}, []);

	return {
		heatingSeasonsTableHeader,
		heatingSeasonsTableBody,
		onHeatingSeasonAdd,
		onGetHeatingSeasons,
		isLoading,
	};
}
