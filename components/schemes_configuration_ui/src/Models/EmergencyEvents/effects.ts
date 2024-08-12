import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import emergencyEventsTreeAdapter from '../../Adapters/emergencyEvents/emergencyEventsTreeAdapter';
import fetchAssignedEmergencyEventsAdapter from '../../Adapters/emergencyEvents/fetchAssignedEmergencyEventsAdapter';
import fetchAssignedEmergencyEventsNumberAdapter from '../../Adapters/emergencyEvents/fetchAssignedEmergencyEventsNumberAdapter';
import parameterCriterionsAdapter from '../../Adapters/emergencyEvents/parameterCriterionsAdapter';
import {
	acknowledgeAssignedEmergencyEventQuery,
	createParameterCriterion,
	deleteParameterCriterion,
	editParameterCriterion,
	fetchAssignedEmergencyEventsNumberQuery,
	fetchAssignedEmergencyEventsQuery,
	getEmergencyEventsTreeQuery,
	getParameterCriterions,
	moveParameter,
} from '../../Const/Queries/emergencyEvents';
import {
	AcknowledgeAssignedEmergencyEventParams,
	CreateParameterCriterionsParams,
	DeleteParameterCriterionsParams,
	EditParameterCriterionsParams,
	EmergencyEventsTreeItem,
	FetchAssignedEmergencyEventParams,
	MoveParameterParams,
	UserId,
} from '../../Shared/types';
import { RpcError, rpcQuery } from '../../Utils/requests';

export const getEmergencyEventsTreeFx = createEffect(async () => {
	const tree = await rpcQuery<EmergencyEventsTreeItem[]>(
		getEmergencyEventsTreeQuery(),
		emergencyEventsTreeAdapter,
	);
	return tree;
});
export const getParameterCriterionsFx = createEffect(
	async (activeNode: number) => {
		const criterions = await rpcQuery(
			getParameterCriterions(activeNode),
			parameterCriterionsAdapter,
		);
		return criterions;
	},
);
export const createParameterCriterionFx = createEffect(
	async (params: CreateParameterCriterionsParams) => {
		try {
			await rpcQuery(createParameterCriterion(params));
			toast.success('Критерий успешно создан');
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при создании критерия');
			}
		}
	},
);
export const editParameterCriterionFx = createEffect(
	async (params: EditParameterCriterionsParams) => {
		try {
			await rpcQuery(editParameterCriterion(params));
			toast.success('Критерий успешно отредактирован');
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при редактировании критерия');
			}
		}
	},
);
export const deleteParameterCriterionFx = createEffect(
	async (params: DeleteParameterCriterionsParams) => {
		try {
			await rpcQuery(deleteParameterCriterion(params));
			toast.success('Критерий успешно удален');
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при удалении критерия');
			}
		}
	},
);
export const moveParameterFx = createEffect(
	async (params: MoveParameterParams) => {
		rpcQuery(moveParameter(params));
	},
);

export const fetchAssignedEmergencyEventsNumberFx = createEffect(
	async (params: UserId) => {
		const response = await rpcQuery(
			fetchAssignedEmergencyEventsNumberQuery(params),
			fetchAssignedEmergencyEventsNumberAdapter,
		);

		return response;
	},
);
export const fetchAssignedEmergencyEventsFx = createEffect(
	async (params: FetchAssignedEmergencyEventParams) => {
		const response = await rpcQuery(
			fetchAssignedEmergencyEventsQuery(params),
			fetchAssignedEmergencyEventsAdapter,
		);

		return response;
	},
);
export const acknowledgeAssignedEmergencyEventsFx = createEffect(
	async (params: AcknowledgeAssignedEmergencyEventParams) => {
		try {
			await rpcQuery(acknowledgeAssignedEmergencyEventQuery(params));
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при квитировании аварийного события');
			}
		}
	},
);
