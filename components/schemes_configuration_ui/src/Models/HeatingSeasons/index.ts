import { toast } from 'react-toastify';
import { createStore, sample } from 'effector';

import { LONG_AUTO_CLOSE } from '../../Shared/const';

import {
	addHeatingSeasonFx,
	deleteHeatingSeasonFx,
	getHeatingSeasonsFx,
	updateHeatingSeasonFx,
} from './effects';
import {
	changeCurrentHeatingSeasonId,
	setHeatingSeasons,
	setHeatingSeasonsIsLoading,
} from './events';
import { HeatingSeasons } from './types';

const initialStore = {
	heatingSeasons: [],
	currentSeasonId: null,
	isLoading: false,
};

export const $heatingSeasons = createStore<HeatingSeasons>(initialStore);

// Установка отопительных сезонов в модель
$heatingSeasons.on(setHeatingSeasons, (state, heatingSeasons) => {
	return {
		...state,
		heatingSeasons,
	};
});

$heatingSeasons.on(
	changeCurrentHeatingSeasonId,
	(state, seasonId: number | null) => {
		state.currentSeasonId = seasonId;
	},
);
$heatingSeasons.on(getHeatingSeasonsFx.doneData, (state) => {
	return { ...state, isLoading: false };
});
$heatingSeasons.on(setHeatingSeasonsIsLoading, (state, isLoading: boolean) => {
	return {
		...state,
		isLoading,
	};
});

// Отслеживание отправки запроса на загрузку отопительных сезонов
sample({ clock: getHeatingSeasonsFx.doneData, target: setHeatingSeasons });

// Отслеживание отправки запроса на изменение отопительного сезона
sample({
	clock: updateHeatingSeasonFx.doneData,
	fn: () => {
		toast.success('Отопительный сезон успешно изменен!', {
			autoClose: LONG_AUTO_CLOSE,
		});
	},
	target: getHeatingSeasonsFx,
});

// Отслеживание отправки запроса на добавление отопительного сезона
sample({
	clock: addHeatingSeasonFx.doneData,
	fn: () => {
		toast.success('Отопительный сезон успешно создан!', {
			autoClose: LONG_AUTO_CLOSE,
		});
	},
	target: getHeatingSeasonsFx,
});

// Отслеживание отправки запроса на удаление отопительного сезона
sample({
	clock: deleteHeatingSeasonFx.doneData,
	fn: () => {
		toast.success('Отопительный сезон успешно удален!', {
			autoClose: LONG_AUTO_CLOSE,
		});
	},
	target: getHeatingSeasonsFx,
});
