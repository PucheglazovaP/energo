import ContextMenu from '../../UI/ContextMenu';
import Table from '../../UI/Table';

import useParameterByValueTable from './useParameterByValueTable';

import styles from './ParameterByValueTable.module.css';

function ParameterByValueTable() {
	const {
		parameterByValueData,
		header,
		isLoading,
		sections,
		handleExpandCollapseSection,
		items,
		position,
		setPosition,
	} = useParameterByValueTable();

	return (
		<>
			<div className={styles.container}>
				<Table
					headers={header}
					data={parameterByValueData}
					sections={sections}
					handleExpandCollapse={handleExpandCollapseSection}
					className={styles.parameter_table}
					isLoading={isLoading}
				/>
			</div>
			<ContextMenu
				items={items}
				position={position}
				setPosition={setPosition}
			/>
		</>
	);
}

export default ParameterByValueTable;
