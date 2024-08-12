import React, { memo, RefObject, useCallback } from 'react';
import clsx from 'clsx';

import { FORWARD_TREE, REVERSE_TREE, UNUSED_CHANNELS_TREE } from '../../Const';
import { useContextMenu } from '../../Hooks/ContextMenu/useContextMenu';
import useAppDispatch from '../../Hooks/Store/useAppDispatch';
import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import { setParametersActive } from '../../Store/reducers/ParametersSlice/parametersSlice';
import { TreeType } from '../../Types';

import ForwardTree from './ForwardTree';
import ReverseTree from './ReverseTree';
import UnusedChannels from './UnusedChannels';
import styles from './TreeContainer.module.scss';

interface TreeContainerProps {
	isShow?: boolean;
	treeType: TreeType;
	unusedChannelsScrollRef?: RefObject<HTMLDivElement> | null;
}

function TreeContainer({
	isShow,
	treeType,
	unusedChannelsScrollRef,
}: TreeContainerProps) {
	const {
		serversList,
		groupsList,
		groupsListChildren,
		channelsList,
		devicesList,
		devicesListChildren,
		unusedChannelsList,
	} = useAppSelector((state) => state.configuratorReducer);
	const { setContextMenu } = useContextMenu();
	const dispatch = useAppDispatch();

	const handleClick = useCallback(() => {
		dispatch(setParametersActive(true));
	}, [dispatch]);

	return (
		<div
			className={
				isShow
					? clsx(
							styles.treeContainer,
							treeType === UNUSED_CHANNELS_TREE &&
								styles.treeContainer__scrollBlock,
					  )
					: clsx(styles.treeContainer, styles.treeContainer__noGap)
			}
			ref={unusedChannelsScrollRef}
		>
			<div
				className={
					isShow
						? styles.treeList
						: clsx(styles.treeList, styles.treeList__hide)
				}
			>
				{treeType === FORWARD_TREE && (
					<ForwardTree
						serversList={serversList}
						groupsList={groupsList}
						channelsList={channelsList}
						devicesList={devicesListChildren}
						onClick={handleClick}
						setContextMenu={setContextMenu}
					/>
				)}
				{treeType === REVERSE_TREE && (
					<ReverseTree
						serversList={serversList}
						groupsList={groupsListChildren}
						channelsList={channelsList}
						devicesList={devicesList}
						onClick={handleClick}
						setContextMenu={setContextMenu}
					/>
				)}
				{treeType === UNUSED_CHANNELS_TREE && (
					<UnusedChannels
						serversList={serversList}
						groupsList={groupsListChildren}
						channelsList={unusedChannelsList}
						devicesList={[]}
						onClick={handleClick}
						setContextMenu={setContextMenu}
					/>
				)}
			</div>
		</div>
	);
}

export default memo(TreeContainer);
