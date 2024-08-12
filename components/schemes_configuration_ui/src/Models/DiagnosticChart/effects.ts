import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { fetchDiagnosticChartAdapter } from '../../Adapters/diagnosticAdapters';
import { fetchDiagnosticChartQuery } from '../../Const/Queries/diagnosticQueries';
import { FetchDiagnosticChartParams } from '../../Shared/types';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { DiagnosticShape } from './types';

export const fetchDiagnosticChartFx = createEffect(
	async (params: FetchDiagnosticChartParams) => {
		try {
			const result = await rpcQuery<DiagnosticShape[]>(
				fetchDiagnosticChartQuery(params),
				fetchDiagnosticChartAdapter,
			);
			return result;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					"Что-то пошло не так при получении данных панели 'Связь с прибором'",
				);
			}
			return [];
		}
	},
);
