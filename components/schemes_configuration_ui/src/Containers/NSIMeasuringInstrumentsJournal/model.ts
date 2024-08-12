import { combine } from 'effector';

import { $user } from '../../Models/Auth';
import {
	$nsiMeasuringInstruments,
	$nsiMeasuringInstrumentsFilters,
	$nsiMeasuringInstrumentsSearchValues,
	$selectedRow,
} from '../../Models/NSIMeasuringInstruments';

export const $measuringInstrumentsJournal = combine({
	user: $user,
	instrumentsData: $nsiMeasuringInstruments,
	searchValues: $nsiMeasuringInstrumentsSearchValues,
	filters: $nsiMeasuringInstrumentsFilters,
	selectedInstrumentNumber: $selectedRow,
});
