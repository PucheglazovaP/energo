import { combine } from 'effector';

import { $user } from '../../Models/Auth';
import { $nsiSelectedUnit } from '../../Models/NSISelectedUnit';
import {
	$nsiUserParameterDataTypes,
	$nsiUserParameterOptions,
	$nsiUserParameters,
} from '../../Models/NSIUserParameters';

export const $userParametersConfigurationModel = combine({
	user: $user,
	selectedUnit: $nsiSelectedUnit,
	userParameterDataTypes: $nsiUserParameterDataTypes,
	userParameters: $nsiUserParameters,
	userParameterOptions: $nsiUserParameterOptions,
});
