import { useMemo } from 'react';
import { useStore } from 'effector-react';

import { $editMode } from '../../Models/EditMode';
import { $navigation } from '../../Models/Navigation';
import { FormTypes } from '../../Shared/types';
import DeviceTitleSection from '../ChannelChartContainers/TitleSection';
import ChartTitleSection from '../ChartTitleSection';
import CondensateDrainTitleSection from '../CondensateDrainChartSection/ChartTitleSection';
import DiagnosticControlBar from '../DiagnosticFormContainers/DiagnosticControlBar';
import EditSchemeSection from '../EditSchemeSection';
import SchemeSection from '../SchemeSection';
import SchemeTitleSection from '../SchemeTitleSection';

import styles from './Scheme.module.css';

function Scheme() {
	const { isEditing } = useStore($editMode);

	const { activeFormType } = useStore($navigation);

	const TitleSectionScheme = useMemo(() => {
		switch (activeFormType) {
			case FormTypes.Form: {
				return SchemeTitleSection;
			}
			case FormTypes.Chart:
			case FormTypes.MultiChart: {
				return ChartTitleSection;
			}
			case FormTypes.CondensateDrainForm: {
				return CondensateDrainTitleSection;
			}
			case FormTypes.DiagnosticForm: {
				return DiagnosticControlBar;
			}
			case FormTypes.DeviceChart:
			case FormTypes.ChannelChart: {
				return DeviceTitleSection;
			}
			default: {
				return () => null;
			}
		}
	}, [activeFormType]);

	return (
		<div className={styles['scheme-wrapper']}>
			<TitleSectionScheme />
			{!isEditing ? (
				<SchemeSection className={styles.scheme} />
			) : (
				<EditSchemeSection className={styles.scheme} />
			)}
		</div>
	);
}

export default Scheme;
