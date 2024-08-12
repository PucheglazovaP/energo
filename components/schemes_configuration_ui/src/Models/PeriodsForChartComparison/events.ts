import { createEvent } from 'effector';

import { PeriodList } from './types';

export const addPeriod = createEvent<PeriodList>();
export const deletePeriod = createEvent<string>();
export const setPeriods = createEvent<PeriodList[]>();
export const changePeriod = createEvent<{ period: Date[]; id: string }>();
export const resetPeriodList = createEvent();
