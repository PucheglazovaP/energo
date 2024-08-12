import { Button } from '@evraz/ui-kit';

import PrintFormParametersList from '../PrintFormParametersList';

import usePrintFormParameters from './usePrintFormParameters';

import styles from './PrintFormParameters.module.css';

function PrintFormParameters() {
	const {
		isPrintFormSelected,
		isAvailablePrintFormParametersListEmpty,
		handleSyncButtonClick,
	} = usePrintFormParameters();

	if (!isPrintFormSelected) {
		return <div className={styles.message}>Печатная форма не выбрана</div>;
	}

	return (
		<div className={styles.root}>
			<div className={styles.parameters_list}>
				<PrintFormParametersList />
			</div>
			{!isAvailablePrintFormParametersListEmpty && (
				<div className={styles.button_row}>
					<Button
						className={styles.add_param_button}
						onClick={handleSyncButtonClick}
					>
						Добавить параметр
					</Button>
				</div>
			)}
		</div>
	);
}

export default PrintFormParameters;
