import { combine } from 'effector';

import { FormTypes } from '../../Shared/types';
import { $activeChart } from '../ActiveChart';
import { $activeChart as $activeCondensateDrainChart } from '../ActiveCondensateDrainChart';
import { $activeForm } from '../ActiveForm';

type SchemeStore = {
	id: number | null;
	formType: FormTypes;
};

function getActiveStore(stores: SchemeStore[]) {
	return stores.find((store) => store.id);
}

export const $editModeSettings = combine(
	$activeChart,
	$activeForm,
	$activeCondensateDrainChart,
	(activeChart, activeForm, activeCondensateDrainChart) => {
		const activeStore = getActiveStore([
			activeChart,
			activeForm,
			activeCondensateDrainChart,
		]);
		return {
			activeId: activeStore?.id || null,
			formType: activeStore?.formType || FormTypes.Form,
		};
	},
);
