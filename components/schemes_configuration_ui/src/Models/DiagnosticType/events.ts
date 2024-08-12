import { createEvent } from 'effector';

import { DiagnosticType } from '../../Shared/types';

export const changeDiagnosticType = createEvent<DiagnosticType>(
	'Change diagnostic type',
);
