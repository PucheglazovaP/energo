import { useStore } from 'effector-react';

import { $diagnosticType } from '../../../Models/DiagnosticType';
import { DiagnosticType } from '../../../Shared/types';
import NavigationForForms from '../../NavigationForForms';

import DiagnosticControlChannelSwitcher from './DiagnosticControlChannelSwitcher';
import DiagnosticControlSwitcher from './DiagnosticControlSwitcher';
import DiagnosticControlTypeSwitcher from './DiagnosticControlTypeSwitcher';

import styles from './DiagnosticControlBar.module.css';

function DiagnosticControlBar() {
	const diagnosticType = useStore($diagnosticType);

	const renderSwitcher = () => {
		switch (diagnosticType) {
			case DiagnosticType.Device:
				return <DiagnosticControlSwitcher />;
			case DiagnosticType.Channel:
				return <DiagnosticControlChannelSwitcher />;
			default:
				() => null;
		}
	};

	return (
		<div className={styles.diagnostic_control_bar}>
			<NavigationForForms className={styles.navigation} />
			<DiagnosticControlTypeSwitcher type={diagnosticType} />
			{renderSwitcher()}
		</div>
	);
}

export default DiagnosticControlBar;
