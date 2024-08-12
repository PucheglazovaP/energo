import clsx from 'clsx';

import CardItem from './CardItem';
import { CardProps } from './types';

import styles from './Card.module.css';

function Card(props: CardProps) {
	const { className, items, title } = props;
	return (
		<div className={clsx(styles.card, className)}>
			<h3 className={styles.card_title}>{title}</h3>
			<div className={styles.card_body}>
				{items.map((card, idx) => (
					<CardItem
						key={idx}
						className={card.className}
						name={card.name}
						value={card.value}
					/>
				))}
			</div>
		</div>
	);
}

export default Card;
