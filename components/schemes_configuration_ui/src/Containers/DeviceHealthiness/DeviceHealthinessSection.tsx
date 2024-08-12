import { Link, useNavigate } from 'react-router-dom';

import { ArrowDown } from '../../Icons';
import DeviceChart from '../DiagnosticFormContainers/DeviceChart/DeviceChart';
import DeviceSummary from '../DiagnosticFormContainers/DeviceSummary/DeviceSummary';

import { DeviceHealthinessSectionProps } from './types';

import styles from './DeviceHealthiness.module.css';

function DeviceHealthinessSection(props: DeviceHealthinessSectionProps) {
	const { id, path } = props;
	const navigate = useNavigate();

	// Tip to make reload AFTER url change
	const reload = () => setTimeout(() => navigate(0));

	return (
		<div className={styles.section}>
			<div className={styles.section_header}>
				<span>
					<b>Связь с прибором</b>
				</span>
				{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
				<Link className={styles.section_redirect} to={path} onClick={reload}>
					<span>Диагностика</span>
					<ArrowDown className={styles.section_arrow} />
				</Link>
			</div>
			<div className={styles.section_body}>
				<div className={styles.section_chart}>
					<DeviceChart id={id} />
				</div>
				<div className={styles.section_table}>
					<DeviceSummary id={id} />
				</div>
			</div>
		</div>
	);
}

export default DeviceHealthinessSection;
