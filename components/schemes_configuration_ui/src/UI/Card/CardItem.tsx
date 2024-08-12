import clsx from 'clsx';

import { ICardItem } from './types';

import styles from './Card.module.css';

function CardItem(props: ICardItem) {
	const { className, name, value } = props;
	return (
		<div className={clsx(styles.item, className)}>
			<div className={styles.item_name}>{name}</div>
			<div className={styles.item_empty} />
			<div className={styles.item_value}>{value}</div>
		</div>
	);
}

export default CardItem;
