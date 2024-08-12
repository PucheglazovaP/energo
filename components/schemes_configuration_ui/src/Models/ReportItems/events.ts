import { createEvent } from 'effector';

import { ReportItem } from './types';

export const setReportItemsList = createEvent<ReportItem[]>();

export const onCloseReportItems = createEvent();

export const onToggleReportItem = createEvent<number>();
