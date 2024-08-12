import { createEffect } from 'effector';

import {
	fetchDiagnosticCurrentStateEffectAdapter,
	FetchDiagnosticCurrentStateEffectAdapterReturn,
	FetchDiagnosticCurrentStateSampleAdapterReturn,
	UpdateDeviceFavoriteStateAdapterReturn,
	updateDeviceFavoriteStateEffectAdapter,
	UpdateDeviceFavoriteStateEffectAdapterReturn,
} from '../../Adapters/diagnosticAdapters';
import {
	fetchDiagnosticCurrentStateEffectQuery,
	updateDeviceFavoriteStateEffectQuery,
} from '../../Const/Queries/diagnosticQueries';
import { checkResponseOutputWarnings } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

export const fetchDiagnosticCurrentStateEffect = createEffect(
	async (data: FetchDiagnosticCurrentStateSampleAdapterReturn) => {
		return await rpcQuery<FetchDiagnosticCurrentStateEffectAdapterReturn>(
			fetchDiagnosticCurrentStateEffectQuery(data),
			fetchDiagnosticCurrentStateEffectAdapter,
			checkResponseOutputWarnings,
		);
	},
);

export const updateDeviceFavoriteStateEffect = createEffect(
	async (data: UpdateDeviceFavoriteStateAdapterReturn) => {
		return await rpcQuery<UpdateDeviceFavoriteStateEffectAdapterReturn>(
			updateDeviceFavoriteStateEffectQuery(data),
			updateDeviceFavoriteStateEffectAdapter(data.deviceNumber),
			checkResponseOutputWarnings,
		);
	},
);

export default {};
