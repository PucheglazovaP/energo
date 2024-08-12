import React from 'react';
import clsx from 'clsx';

import BlockHeader from '../../Components/TreeBlockContent/BlockHeader';
import ContentBlock from '../../Components/TreeBlockContent/ContentBlock';
import TreeBlockParams from '../../Components/TreeBlockParams/TreeBlockParams';
import { FORWARD_TREE, REVERSE_TREE } from '../../Const';
import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import { filtersByDevice, filtersByGroups } from '../HomePageContainer';

import { devices, groups } from './data';
import styles from './TreeBlockContainer.module.scss';

interface TableContainerProps {
	isParametersActive: boolean;
	onAction(): void;
}

function TreeBlockContainer({
	isParametersActive,
	onAction,
}: TableContainerProps) {
	const { isDevicesListFetching, isGroupsListFetching } = useAppSelector(
		(state) => state.configuratorReducer,
	);

	return (
		<div
			className={
				isParametersActive
					? styles.tableContainer
					: clsx(styles.tableContainer, styles.noGap)
			}
		>
			<div className={styles.contentBlock}>
				<ContentBlock
					channels={false}
					filters={filtersByGroups}
					treeType={FORWARD_TREE}
				>
					<BlockHeader
						filterHeader={groups}
						isListFetching={isGroupsListFetching}
					/>
				</ContentBlock>

				<ContentBlock
					channels={true}
					filters={filtersByDevice}
					treeType={REVERSE_TREE}
				>
					<BlockHeader
						filterHeader={devices}
						isListFetching={isDevicesListFetching}
					/>
				</ContentBlock>
			</div>
			<TreeBlockParams isActive={isParametersActive} onAction={onAction} />
		</div>
	);
}

export default TreeBlockContainer;
