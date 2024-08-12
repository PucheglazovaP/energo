import { createEffect } from 'effector';

import { getHeatingSeasonsAdapter } from '../../Adapters/HeatingSeasons/heatingSeasonsAdapter';
import {
	getHeatingSeasonsQuery,
	heatingSeasonActionQuery,
} from '../../Const/Queries/heatingSeasons';
import {
	HeatingSeasonAction,
	HeatingSeasonOperation,
} from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { setHeatingSeasonsIsLoading } from './events';
import { HeatingSeason } from './types';

// Запрос отопительных сезонов
export const getHeatingSeasonsFx = createEffect(async () => {
	setHeatingSeasonsIsLoading(true);
	const heatingSeasons = await rpcQuery<HeatingSeason[]>(
		getHeatingSeasonsQuery(),
		getHeatingSeasonsAdapter,
	);
	return heatingSeasons;
});
getHeatingSeasonsFx.fail.watch(({ error }) => {
	handleError(error);
});

// Обновление значений отопительного сезона
export const updateHeatingSeasonFx = createEffect(
	async (params: HeatingSeasonAction) => {
		const queryParams: HeatingSeasonAction = {
			...params,
			operation: HeatingSeasonOperation.Update,
		};

		const heatingSeason = await rpcQuery<HeatingSeasonAction>(
			heatingSeasonActionQuery(queryParams),
		);

		return heatingSeason;
	},
);
updateHeatingSeasonFx.fail.watch(({ error }) => {
	handleError(error);
});

// Добавление отопительного сезона
export const addHeatingSeasonFx = createEffect(
	async (params: HeatingSeasonAction) => {
		const queryParams: HeatingSeasonAction = {
			...params,
			operation: HeatingSeasonOperation.Add,
		};

		const heatingSeason = await rpcQuery<HeatingSeasonAction>(
			heatingSeasonActionQuery(queryParams),
		);
		return heatingSeason;
	},
);
addHeatingSeasonFx.fail.watch(({ error }) => {
	handleError(error);
});

// Удаление отопительного сезона
export const deleteHeatingSeasonFx = createEffect(
	async (params: HeatingSeasonAction) => {
		const queryParams: HeatingSeasonAction = {
			...params,
			operation: HeatingSeasonOperation.Delete,
		};

		const heatingSeason = await rpcQuery<HeatingSeasonAction>(
			heatingSeasonActionQuery(queryParams),
		);
		return heatingSeason;
	},
);
deleteHeatingSeasonFx.fail.watch(({ error }) => {
	handleError(error);
});
