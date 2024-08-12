import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Edit } from '../../Icons';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { Path } from '../../Shared/types';
import Select from '../../UI/Select';
import { getBaseHour } from '../../Utils/getBaseHour';

import { EnergyResourceSelectorWithTitleProps } from './types';

import styles from './EnergyResourceSelectorWithTitle.module.css';

function EnergyResourceSelectorWithTitle({
	energyResources,
	onChangeEnergyResource,
	baseHour,
	title,
	className,
}: EnergyResourceSelectorWithTitleProps) {
	const location = useLocation();
	const handleOpenModal = useCallback(() => {
		openModal(RegisteredModals.EditBaseHour);
	}, []);
	return (
		<div className={styles.top_section}>
			<h2 className="scheme_title">{title}</h2>
			{!!energyResources.length && (
				<>
					<span className={styles.slash}>/</span>
					<Select
						options={energyResources}
						onSelect={onChangeEnergyResource}
						className={clsx(styles.selector, className)}
					/>
					{location.pathname.includes(Path.ReportByPoints) && (
						<div className={clsx(styles.base_hour)}>
							<span className={clsx(styles.base_hour__title)}>Час учета</span>
							{getBaseHour(baseHour || 0)}
							<Button className={clsx(styles.button)} onClick={handleOpenModal}>
								<Edit className={styles.icon} />
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default EnergyResourceSelectorWithTitle;
