import React, { ReactNode } from 'react';

import List from '../../Containers/ListContainer/List';
import ListContainer from '../../Containers/ListContainer/ListContainer';
import { TreeType } from '../../Types';

import Filters from './Filters';
import styles from './TreeBlock.module.scss';

interface ContentBlockProps {
	channels: boolean;
	filters: String[];
	treeType: TreeType;
	children: ReactNode;
}

function ContentBlock({
	channels,
	filters,
	treeType,
	children,
}: ContentBlockProps) {
	return (
		<div className={styles.content}>
			{children}
			<Filters filters={filters} treeType={treeType} />
			<ListContainer>
				<List channels={channels} treeType={treeType} />
			</ListContainer>
		</div>
	);
}

export default ContentBlock;
