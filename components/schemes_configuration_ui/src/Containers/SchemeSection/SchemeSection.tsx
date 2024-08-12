import { useMemo } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $navigation } from '../../Models/Navigation';
import { FormTypes } from '../../Shared/types';
import ActivePowerForm from '../ActivePowerForm';
import ChannelChartSection from '../ChannelChartContainers/ChartSection';
import ChartSection from '../ChartSection';
import CondensateDrainChartSection from '../CondensateDrainChartSection/ChartSection/ChartSection';
import DiagnosticForm from '../DiagnosticFormContainers/DiagnosticForm';
import Form from '../Form';
import ReportForm from '../ReportForm';

import SchemeSectionProps from './types';

/* const Form = lazy(() => {
	return import('../Form');
});
const ChartSection = lazy(() => {
	return import('../ChartSection');
});
const CondensateDrainChartSection = lazy(() => {
	return import('../CondensateDrainChartSection/ChartSection');
});
const DiagnosticForm = lazy(() => {
	return import('../DiagnosticFormContainers/DiagnosticForm/');
});
const ChannelChartSection = lazy(() => {
	return import('../ChannelChartContainers/ChartSection');
});
const ReportForm = lazy(() => {
	return import('../ReportForm');
});
const ActivePowerForm = lazy(() => {
	return import('../ActivePowerForm');
});
 */
import styles from './SchemeSection.module.css';

function SchemeSection({ className }: SchemeSectionProps) {
	const { activeFormType } = useStore($navigation);
	const SectionScheme = useMemo(() => {
		switch (activeFormType) {
			case FormTypes.Form: {
				return Form;
			}
			case FormTypes.Chart:
			case FormTypes.MultiChart: {
				return ChartSection;
			}
			case FormTypes.CondensateDrainForm: {
				return CondensateDrainChartSection;
			}
			case FormTypes.DiagnosticForm: {
				return DiagnosticForm;
			}
			case FormTypes.DeviceChart:
			case FormTypes.ChannelChart: {
				return ChannelChartSection;
			}
			case FormTypes.ReportForm: {
				return ReportForm;
			}
			case FormTypes.ActivePowerForm: {
				return ActivePowerForm;
			}
			default: {
				return Form;
			}
		}
	}, [activeFormType]);

	return (
		<div className={clsx(styles.root, className)}>
			<SectionScheme />
		</div>
	);
}

export default SchemeSection;
