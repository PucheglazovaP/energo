import { User } from '@evraz/ui-kit';

import { TreeNodeProps } from './types';

import styles from './TreeForms.module.css';

function TreeNode(props: TreeNodeProps) {
	const { isOwned, name } = props;
	if (!isOwned) {
		return <span>{name}</span>;
	}
	return (
		<>
			<span>{name}</span>
			<User className={styles.tree__icon} />
		</>
	);
}

export default TreeNode;
