import { combine } from 'effector';

import { $user } from '../../Models/Auth';
import { $nsiMeasuringInstruments } from '../../Models/NSIMeasuringInstruments';
import { getMeasuringInstrumentsListFx } from '../../Models/NSIMeasuringInstruments/effects';
import {
	$nsiSelectedTab,
	$nsiSelectedUnit,
} from '../../Models/NSISelectedUnit';
import { $nsiUserParameters } from '../../Models/NSIUserParameters';

export const $informationPanelModel = combine({
	user: $user,
	selectedUnit: $nsiSelectedUnit,
	selectedTab: $nsiSelectedTab,
	userParameters: $nsiUserParameters,
	measuringInstruments: $nsiMeasuringInstruments,
	isInstrumentsJournalPending: getMeasuringInstrumentsListFx.pending,
});
