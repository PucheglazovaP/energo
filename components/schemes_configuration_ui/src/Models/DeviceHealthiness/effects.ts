import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { deviceHealthinessAdapter } from '../../Adapters/deviceHealthinessAdapter';
import { fetchDiagnosticGroupCurrentStateQuery } from '../../Const/Queries/diagnosticQueries';
import { FetchDiagnosticGroupCurrentStateParams } from '../../Shared/types';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { DeviceHealthiness } from './types';

export const fetchDiagnosticGroupCurrentStateFx = createEffect(
	async (params: FetchDiagnosticGroupCurrentStateParams) => {
		try {
			const result: DeviceHealthiness[] = await rpcQuery<DeviceHealthiness[]>(
				fetchDiagnosticGroupCurrentStateQuery(params),
				deviceHealthinessAdapter,
			);
			return result;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении данных о текущем состоянии приборов по группе',
				);
			}
			return [];
		}
	},
);
