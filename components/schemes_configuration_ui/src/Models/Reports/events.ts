import { createEvent } from 'effector';

import { Report } from './types';

export const setReportsList = createEvent<Report[]>();
