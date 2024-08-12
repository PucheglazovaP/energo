import { useStore } from 'effector-react';

import { $printFormSidebarsState } from '../../Models/PrintForms';
import { toggleRightSidebarState } from '../../Models/PrintForms/events';
import ButtonToggleSidebarIndividual from '../ButtonToggleSidebarIndividual';

function ReferenceByFormsHeaderRight() {
	const { isRightSidebarOpen } = useStore($printFormSidebarsState);

	return (
		<ButtonToggleSidebarIndividual
			isSidebarOpen={isRightSidebarOpen}
			onClick={toggleRightSidebarState}
		/>
	);
}

export default ReferenceByFormsHeaderRight;
