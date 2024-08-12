import { combine } from 'effector';

import { $user } from '../../Models/Auth';
import {
	$nsiUserParameterOptions,
	$nsiUserParameters,
} from '../../Models/NSIUserParameters';

export const $nsiGroupChangeValuesModel = combine({
	user: $user,
	userParameters: $nsiUserParameters,
	userParameterOptions: $nsiUserParameterOptions,
});
