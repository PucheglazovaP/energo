import { Fragment } from 'react';
import clsx from 'clsx';

import LogList from './LogList';
import { GroupedLogProps } from './types';
import { getGroupsList, getListOfGroup } from './utils';

import styles from './GroupedLog.module.css';

function GroupedLog({ className, style, list }: GroupedLogProps) {
	const groups: string[] = getGroupsList(list);
	return (
		<div className={clsx(styles.root, className)} style={style}>
			{groups.map((groupName) => {
				return (
					<Fragment key={groupName}>
						<strong className={styles.group_name}>{groupName}</strong>
						<LogList list={getListOfGroup(groupName, list)} />
					</Fragment>
				);
			})}
		</div>
	);
}

export default GroupedLog;
