import Modal from '../../Components/Modal';
import Select from '../../Components/Select';
import Table from '../../Components/Table';
import { useVacantEntities } from '../../Hooks/useVacantEntities';

import styles from './VacantEntities.module.scss';

function VacantEntities() {
	const {
		vacantEntitiesTableData,
		isVacantEntitiesLoading,
		handleCloseModal,
		onScroll,
		handleSelectedVacantEntityType,
		vacantEntitiesSelectorData,
		tableRef,
	} = useVacantEntities();

	return (
		<Modal
			title={'Список свободных номеров'}
			onClose={handleCloseModal}
			className={styles.modal}
		>
			<Select
				options={vacantEntitiesSelectorData}
				onSelect={handleSelectedVacantEntityType}
				className={styles.select}
			/>
			<Table
				header={vacantEntitiesTableData.header}
				rows={vacantEntitiesTableData.rows}
				isLoading={isVacantEntitiesLoading}
				onScroll={onScroll}
				ref={tableRef}
				className={styles.table}
			/>
		</Modal>
	);
}

export default VacantEntities;
