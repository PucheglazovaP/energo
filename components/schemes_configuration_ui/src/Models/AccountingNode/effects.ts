import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { accountingNodeMethodsAdapter } from '../../Adapters/AccountingNode/accountingNodeAdapter';
import {
	createAccountingNodeQuery,
	getAccountingNodeCalculateMethodsQuery,
	getAccountingNodeMethodsQuery,
	updateAccountingNodeQuery,
} from '../../Const/Queries/accountingNode';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { AccountingNodeMethods } from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { RpcError, rpcQuery } from '../../Utils/requests';
import { closeModal } from '../Modal/events';
import { SaveAccountingNodeParams } from '../Points/types';

import { Method } from './types';

// Создание и редактирование базовой точки
export const saveAccountingNodeFx = createEffect(
	async (data: SaveAccountingNodeParams) => {
		try {
			await rpcQuery(
				data.parameterId
					? updateAccountingNodeQuery(data)
					: createAccountingNodeQuery(data),
			);
			closeModal(RegisteredModals.AccountingNodeModal);
			toast.success(
				`Узел учета успешно ${data.parameterId ? 'изменен' : 'добавлен'}`,
			);
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при обновлении узла учета');
			}
		}
	},
);

// Запрос методов узла учета
export const getAccountingNodeMethods = createEffect(
	async (params: AccountingNodeMethods) => {
		const methods = await rpcQuery<Method[]>(
			getAccountingNodeMethodsQuery(params),
			accountingNodeMethodsAdapter,
		);
		return methods;
	},
);
getAccountingNodeMethods.fail.watch(({ error }) => {
	handleError(error);
});

// Запрос способов вычисления узла учета
export const getAccountingNodeCalculateMethods = createEffect(
	async (params: AccountingNodeMethods) => {
		const methods = await rpcQuery<Method[]>(
			getAccountingNodeCalculateMethodsQuery(params),
			accountingNodeMethodsAdapter,
		);
		return methods;
	},
);
getAccountingNodeCalculateMethods.fail.watch(({ error }) => {
	handleError(error);
});
