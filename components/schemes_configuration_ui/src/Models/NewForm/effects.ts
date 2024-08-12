import { createEffect } from 'effector';

import { formActionAdapter } from '../../Adapters/formActionAdapter';
import { formTypesAdapter } from '../../Adapters/formCreation/formTypesAdapter';
import {
	copyFormQuery,
	getFormTypesQuery,
	saveFormQuery,
} from '../../Const/Queries/form';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';
import { closeModal } from '../Modal/events';
import { fetchFormTreeDataFx } from '../TreeForms/effects';
import { getFormInfoById } from '../TreeForms/events';

import { setFormTypes, setTypesIsLoading } from './events';
import { FormActionParams, FormType } from './types';

export const fetchFormTypesFx = createEffect(async (versionId: number) => {
	const formTypes = await rpcQuery<FormType[]>(
		getFormTypesQuery(versionId),
		formTypesAdapter,
	);
	return formTypes;
});

fetchFormTypesFx.done.watch(({ result }) => {
	setFormTypes(result);
});

fetchFormTypesFx.fail.watch(({ error }) => {
	handleError(error);
});

fetchFormTypesFx.pending.watch((pending) => {
	if (pending) {
		setTypesIsLoading(true);
	}
});

fetchFormTypesFx.finally.watch(() => {
	setTypesIsLoading(false);
});

// TODO: Improve logic, remove 3 different actions, join them in one
export const saveNewFormFx = createEffect(async (params: FormActionParams) => {
	const code = await rpcQuery(saveFormQuery(params), formActionAdapter);
	return code;
});

saveNewFormFx.fail.watch(({ error }) => {
	handleError(error);
});

export const copyFormFx = createEffect(async (params: FormActionParams) => {
	const code = await rpcQuery(copyFormQuery(params), formActionAdapter);
	return code;
});

copyFormFx.done.watch(async ({ params, result }) => {
	closeModal(RegisteredModals.CreateNewForm);
	await fetchFormTreeDataFx({
		versionCode: params.versionCode || 0,
		userId: params.userId || '',
		moduleName: ModuleName.CopyFormFx_watch_fetchFormTreeDataFx,
	});
	getFormInfoById({
		formId: result,
		versionCode: params.versionCode || 0,
		userId: params.userId,
	});
});

copyFormFx.fail.watch(({ error }) => {
	handleError(error);
});
