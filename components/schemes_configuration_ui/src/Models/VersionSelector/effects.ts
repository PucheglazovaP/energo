import { createEffect } from 'effector';

import versionsListAdapter from '../../Adapters/versionsListAdapter';
import { fetchVersionsListQuery } from '../../Const/Queries';
import {
	checkResponseOutputWarnings,
	handleError,
} from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';
import { setActiveChartParameters } from '../ActiveChart/events';
import { setActiveFormParameters } from '../ActiveForm/events';

import { setVersionsIsLoading } from './events';
import { Version } from './types';

export const fetchVersionsFx = createEffect(async (formId?: string) => {
	const versions = await rpcQuery<Version[]>(
		fetchVersionsListQuery(),
		versionsListAdapter,
		checkResponseOutputWarnings,
	);
	return { versions, formId };
});

fetchVersionsFx.pending.watch(() => {
	setVersionsIsLoading(true);
	setActiveChartParameters({ isLoading: true });
	setActiveFormParameters({ isLoading: true });
});

fetchVersionsFx.fail.watch(({ error }) => {
	handleError(error);
	setActiveChartParameters({ isLoading: false });
	setActiveFormParameters({ isLoading: false });
});

fetchVersionsFx.finally.watch(() => {
	setVersionsIsLoading(false);
});
