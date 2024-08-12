import { createEffect, merge } from 'effector';

import {
	assignedResponsiblePersonsAdapter,
	responsiblePersonsAdapter,
} from '../../Adapters/emergencyEvents/responsiblePersonsAdapter';
import { saveNewParameterAdapter } from '../../Adapters/emergencyEvents/saveParameterAdapter';
import { getEnumValuesAdapter } from '../../Adapters/getEnumValuesAdapter';
import {
	assignResponsiblePerson,
	changeAssignedResponsiblePerson,
	deleteParameter,
	getAssignedResponsiblePersons,
	getResponsiblePersons,
	saveNewParameter,
	saveParameter,
	unassginResponsiblePerson,
} from '../../Const/Queries/emergencyEvents';
import { getEnumValuesQuery } from '../../Const/Queries/getEnumValues';
import {
	AssignResponsiblePersonParams,
	ChangeAssignedResponsiblePersonParams,
	CreateNewParameterParams,
	DeleteParameterCriterionsParams,
	SaveParameterParams,
	UnassignResponsiblePersonParams,
} from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { setResponsiblePersonsListIsLoading } from './events';
import { ResponsiblePersons } from './types';

export const fetchResponsiblePersonsListFx = createEffect(async () => {
	const result = await rpcQuery<ResponsiblePersons[]>(
		getResponsiblePersons(),
		responsiblePersonsAdapter,
	);
	return result;
});
export const fetchAssignedResponsiblePersonsListFx = createEffect(
	async (parameterId: number) => {
		const result = await rpcQuery<ResponsiblePersons[]>(
			getAssignedResponsiblePersons(parameterId),
			assignedResponsiblePersonsAdapter,
		);
		return result;
	},
);
export const assignResponsiblePersonsFx = createEffect(
	async (params: AssignResponsiblePersonParams) => {
		await rpcQuery(assignResponsiblePerson(params));
	},
);
export const unassginResponsiblePersonFx = createEffect(
	async (params: UnassignResponsiblePersonParams) => {
		await rpcQuery(unassginResponsiblePerson(params));
	},
);
export const changeAssignedResponsiblePersonFx = createEffect(
	async (params: ChangeAssignedResponsiblePersonParams) => {
		await rpcQuery(changeAssignedResponsiblePerson(params));
	},
);

fetchResponsiblePersonsListFx.pending.watch((pending) => {
	if (pending) {
		setResponsiblePersonsListIsLoading(true);
	}
});
fetchResponsiblePersonsListFx.finally.watch(() => {
	setResponsiblePersonsListIsLoading(false);
});

export const saveNewParameterFx = createEffect(
	async (params: CreateNewParameterParams) => {
		const treeItem = await rpcQuery(
			saveNewParameter(params),
			saveNewParameterAdapter,
		);
		return treeItem;
	},
);
export const saveParameterFx = createEffect(
	async (params: SaveParameterParams) => {
		await rpcQuery(saveParameter(params));
	},
);
export const deleteParameterFx = createEffect(
	async (params: DeleteParameterCriterionsParams) => {
		const id = await rpcQuery(deleteParameter(params));
		return id;
	},
);
export const getEnumValuesFx = createEffect(async () => {
	// id = 2 выдает список вида данных
	const result = await rpcQuery(getEnumValuesQuery(2), getEnumValuesAdapter);

	return result.map((item) => ({
		...item,
		isSelected: item.label.toLowerCase() === 'по умолчанию',
	}));
});
saveNewParameterFx.fail.watch(({ error }) => {
	handleError(error);
});

export const handleQueryFails = merge([
	fetchResponsiblePersonsListFx.fail,
	fetchAssignedResponsiblePersonsListFx.fail,
	assignResponsiblePersonsFx.fail,
	unassginResponsiblePersonFx.fail,
	changeAssignedResponsiblePersonFx.fail,
	saveNewParameterFx.fail,
	saveParameterFx.fail,
	deleteParameterFx.fail,
	getEnumValuesFx.fail,
]);
