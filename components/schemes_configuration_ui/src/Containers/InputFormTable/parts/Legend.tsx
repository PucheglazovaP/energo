import clsx from 'clsx';

import styles from '../InputFormTable.module.css';

function Legend() {
	return (
		<section className={styles.legend}>
			<div>
				<div className={clsx(styles.block, styles.priority)} />
				<span>Приоритетное значение</span>
			</div>
			<div>
				<div className={clsx(styles.block, styles.middle)} />
				<span>Среднее за период</span>
			</div>
			<div>
				<div className={clsx(styles.block, styles.correction)} />
				<span>Коррекция</span>
			</div>
			<div>
				<div className={clsx(styles.block, styles.constant)} />
				<span>Константа</span>
			</div>
		</section>
	);
}

export default Legend;
