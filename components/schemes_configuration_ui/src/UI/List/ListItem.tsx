import clsx from 'clsx';

import { ListItemProps } from './types';

import styles from './List.module.css';

function ListItem(props: ListItemProps) {
	const { item, selectedId } = props;
	const { id, onClick, renderFn, className, ...args } = item;

	return (
		<li>
			<button
				id={id}
				className={clsx(
					styles.item,
					id === selectedId && styles.item__active,
					className,
				)}
				onClick={onClick}
				{...args}
			>
				{renderFn ? renderFn(item) : item.title}
			</button>
		</li>
	);
}

export default ListItem;
