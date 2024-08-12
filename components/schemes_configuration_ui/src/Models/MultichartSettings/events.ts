import { createEvent } from 'effector';

import { Trend } from '../../Shared/types';

export const setMultichartActiveId = createEvent<number>();
export const setMultichartSeries = createEvent<Trend[]>();
