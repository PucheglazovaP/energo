import { useCallback, useMemo, useState } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { $heatingSeasons } from '../../Models/HeatingSeasons';
import {
	addHeatingSeasonFx,
	updateHeatingSeasonFx,
} from '../../Models/HeatingSeasons/effects';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import { formatToDatabaseFormat } from '../../Utils/dateUtils';

import { HeatingSeasonMode } from './types';

export function useHeatingSeasonAddUpdate(modalMode: HeatingSeasonMode) {
	const { currentSeasonId, heatingSeasons } = useStore($heatingSeasons);
	const user = useStore($user);

	const [isEndDataChecked, setEndDataChecked] = useState(false);

	// Подготовка дат сезона из store в зависимости от режима работы модального окна
	const seasonDates = useMemo(() => {
		if (modalMode === HeatingSeasonMode.Edit) {
			const season = heatingSeasons.find(
				(season) => season.seasonCode === currentSeasonId,
			);
			return {
				seasonStartDate: season?.seasonStartDate,
				seasonEndDate: season?.seasonEndDate,
			};
		}
		// Режим добавления нового сезона
		return { seasonStartDate: null, seasonEndDate: null };
	}, [modalMode, heatingSeasons, currentSeasonId]);

	// Генерация массивов дат для работы с календарем
	const [currentStartDates, currentEndDates] = useMemo(() => {
		const { seasonStartDate, seasonEndDate } = seasonDates;

		// Подготовка даты начала сезона (в зависимости от режима работы модального окна)
		const resultStartDate =
			modalMode === HeatingSeasonMode.Add
				? new Date()
				: new Date(seasonStartDate as string);

		// Подготовка даты конца сезона (в зависимости от режима работы модального окна и открытого значения даты (null))
		const resultEndDate =
			modalMode === HeatingSeasonMode.Add
				? new Date()
				: modalMode === HeatingSeasonMode.Edit && seasonEndDate
				? new Date(seasonEndDate as string)
				: new Date();

		return [
			[resultStartDate, resultStartDate],
			[resultEndDate, resultEndDate],
		];
	}, [seasonDates, modalMode]);

	const [startDates, setStartDates] = useState(currentStartDates);
	const [endDates, setEndDates] = useState(currentEndDates);

	// Валидация дат календарей
	const isNotValidDate = useMemo(
		() => startDates[0] > endDates[0],
		[startDates, endDates],
	);

	const onCloseModal = useCallback(() => {
		closeModal(
			modalMode === HeatingSeasonMode.Add
				? RegisteredModals.AddHeatingSeason
				: RegisteredModals.EditHeatingSeason,
		);
	}, [modalMode]);

	// Изменение состояния чекбокса на конечную дату
	const onEndDataCheck = useCallback(() => {
		setEndDataChecked((checked) => !checked);
	}, []);

	// Callback для создания нового отопительного сезона
	const onAddConfirm = useCallback(() => {
		if (!user) return;
		addHeatingSeasonFx({
			seasonStartDate: formatToDatabaseFormat(startDates[0]),
			seasonEndDate: isEndDataChecked
				? formatToDatabaseFormat(endDates[0])
				: null,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseHeatingSeasonAddUpdate_addHeatingSeasonFx,
		});
		closeModal(RegisteredModals.AddHeatingSeason);
	}, [user, startDates, endDates, isEndDataChecked]);

	//  Callback для изменения отопительного сезона
	const onEditConfirm = useCallback(() => {
		if (!user) return;
		updateHeatingSeasonFx({
			seasonId: currentSeasonId,
			seasonStartDate: formatToDatabaseFormat(startDates[0]),
			seasonEndDate: isEndDataChecked
				? formatToDatabaseFormat(endDates[0])
				: null,
			userId: user.preferredUsername,
			moduleName: ModuleName.UseHeatingSeasonAddUpdate_updateHeatingSeasonFx,
		});
		closeModal(RegisteredModals.EditHeatingSeason);
	}, [user, currentSeasonId, startDates, endDates, isEndDataChecked]);

	// Подготовка callback подтверждения операции в зависимости от режима работы модального окна (изменение/добавление)
	const onConfirm = useMemo(
		() => (modalMode === HeatingSeasonMode.Add ? onAddConfirm : onEditConfirm),
		[modalMode, onAddConfirm, onEditConfirm],
	);

	return {
		startDates,
		setStartDates,
		endDates,
		setEndDates,
		isNotValidDate,
		onCloseModal,
		onEndDataCheck,
		onConfirm,
		isEndDataChecked,
	};
}
