import { createEvent } from 'effector';

import { HeatingSeason } from './types';

export const setHeatingSeasons = createEvent<HeatingSeason[]>();
export const changeCurrentHeatingSeasonId = createEvent<number | null>();
export const setHeatingSeasonsIsLoading = createEvent<boolean>();
