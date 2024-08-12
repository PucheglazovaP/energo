import { createEffect } from 'effector';

import transparentEmergencyEventsStatusAdapter from '../../Adapters/emergencyEvents/transparentEmergencyEventsStatusAdapter';
import { getTransparentEmergencyEventsStatus } from '../../Const/Queries/emergencyEvents';
import { checkResponseOutputWarnings } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

export const fetchTransparentEmergencyEventsStatus = createEffect(
	async (id: number) => {
		const result = await rpcQuery(
			getTransparentEmergencyEventsStatus(id),
			transparentEmergencyEventsStatusAdapter,
			checkResponseOutputWarnings,
		);
		return result;
	},
);
