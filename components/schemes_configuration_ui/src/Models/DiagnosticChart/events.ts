import { createEvent } from 'effector';

import { AddShapeFnParams, DiagnosticShape } from './types';

export const setShape = createEvent<DiagnosticShape[]>();
export const setDates = createEvent<Date[]>();
export const addShapes = createEvent<AddShapeFnParams>();
