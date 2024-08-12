import { Button } from '@evraz/ui-kit';
import { v4 as uuidv4 } from 'uuid';

import { ArrowRight } from '../../Icons';

import { LINKED_POINT_PARAMETERS } from './constants';
import useLinkedPoint from './useLinkedPoint';

import styles from './ParameterByValueTable.module.css';

function LinkedPoint() {
	const { point, handleLinkedPointRedirectClick } = useLinkedPoint();

	return (
		<div className={styles.modal_body}>
			<div className={styles.linked_point_container}>
				{point?.map((item, index) => (
					<div key={uuidv4()} className={styles.linked_point}>
						<span className={styles.param_name}>
							{LINKED_POINT_PARAMETERS[index]}
						</span>
						<span className={styles.divider}></span>
						<span title={String(item)} className={styles.param_value}>
							{item || '-'}
						</span>
					</div>
				))}
			</div>
			<div className={styles.buttons}>
				<Button
					className={styles.confirm_button}
					onClick={handleLinkedPointRedirectClick}
				>
					<span>Перейти к базовой точке учета</span>
					<ArrowRight className={styles.arrow_icon} />
				</Button>
			</div>
		</div>
	);
}

export default LinkedPoint;
