import { Copy } from '../../Components/Icons';
import { Cell, Row } from '../../Components/Table/types';
import { VACANT_ENTITIES_TABLE_HEADER } from '../../Containers/VacantEntities/const';
import { VacantEntity } from '../../Store/reducers/VacantEntitySlice/types';

import styles from '../../Containers/VacantEntities/VacantEntities.module.scss';

export function vacantEntitiesTableAdapter(vacantEntities: VacantEntity[]) {
	const header: Cell[] = VACANT_ENTITIES_TABLE_HEADER;
	const rows: Row[] = vacantEntities.map((entity) => {
		return {
			id: entity.id,
			cells: [
				{
					name: 'id',
					value: entity.id,
					className: styles.table__id,
				},
				{
					name: 'action',
					renderFn: () => (
						<button
							className={styles.button__action}
							onClick={() => navigator.clipboard.writeText(entity.id)}
						>
							<Copy />
						</button>
					),
				},
			],
		};
	});
	return {
		header,
		rows,
	};
}
