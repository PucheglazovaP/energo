import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';

import ListItem from './ListItem';
import { ListProps } from './types';

import styles from './List.module.css';

function List(props: ListProps) {
	const { items, selectedItemId, className } = props;

	return (
		<ul className={clsx('ui_list', styles.root, className)}>
			{!items.length && <li>Нет данных</li>}
			{items.map((item) => (
				<ListItem item={item} selectedId={selectedItemId} key={uuidv4()} />
			))}
		</ul>
	);
}

export default List;
