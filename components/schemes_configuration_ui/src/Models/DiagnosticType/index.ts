import { createStore } from 'effector';

import { DiagnosticType } from '../../Shared/types';

import { changeDiagnosticType } from './events';

const init: DiagnosticType = DiagnosticType.Device;

export const $diagnosticType = createStore<DiagnosticType>(init);

$diagnosticType.on(changeDiagnosticType, (_state, type) => type);
