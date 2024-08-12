import { useStore } from 'effector-react';

import { $editModeSettings } from '../../Models/EditModeSettings';
import { FormTypes } from '../../Shared/types';
import EditChartContainer from '../EditChart/EditChartContainer';
import EditCondensateDrainChart from '../EditCondensateDrainChart';
import EditFormContainer from '../EditForm/EditFormContainer';
import EditReportForm from '../EditReportForm';

import EditSchemeSectionProps from './types';

function EditSchemeSection({ className }: EditSchemeSectionProps) {
	const { formType } = useStore($editModeSettings);

	const renderScheme = () => {
		switch (formType) {
			case FormTypes.Chart:
			case FormTypes.MultiChart:
				return <EditChartContainer />;
			case FormTypes.CondensateDrainForm:
				return <EditCondensateDrainChart />;
			case FormTypes.ReportForm:
				return <EditReportForm />;
			case FormTypes.Form:
			default:
				return <EditFormContainer />;
		}
	};

	return <div className={className}>{renderScheme()}</div>;
}

export default EditSchemeSection;
