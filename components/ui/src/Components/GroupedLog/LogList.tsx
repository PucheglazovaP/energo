import clsx from 'clsx';
import { format } from 'date-fns';

import { LogListProps } from './types';

import styles from './GroupedLog.module.css';

function LogList({ className, style, list }: LogListProps) {
	return (
		<ul className={clsx(styles.log_list, className)} style={style}>
			{list.map((logItem, index) => {
				const dateTime: string = format(logItem.dateTime, 'dd.MM.yyyy HH:mm');
				return (
					<li className={styles.log_item} key={`${dateTime}-${index}`}>
						<time className={styles.log_time}>{dateTime}</time>
						<span className={styles.log_message}>{logItem.message}</span>
					</li>
				);
			})}
		</ul>
	);
}

export default LogList;
