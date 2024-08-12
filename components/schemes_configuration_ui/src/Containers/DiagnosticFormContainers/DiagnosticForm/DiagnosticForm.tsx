import { useStore } from 'effector-react';

import { $diagnosticType } from '../../../Models/DiagnosticType';
import { DiagnosticType } from '../../../Shared/types';
import ChannelDiagnostic from '../ChannelDiagnostic/ChannelDiagnostic';
import DiagnosticCurrentState from '../DiagnosticCurrentState/DiagnosticCurrentState';

function DiagnosticForm() {
	const diagnosticType = useStore($diagnosticType);

	const renderDiagnostic = () => {
		switch (diagnosticType) {
			case DiagnosticType.Device:
				return <DiagnosticCurrentState />;
			case DiagnosticType.Channel:
				return <ChannelDiagnostic />;
			default:
				return null;
		}
	};

	return renderDiagnostic();
}

export default DiagnosticForm;
