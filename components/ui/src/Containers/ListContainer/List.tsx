import React from 'react';
import clsx from 'clsx';

import Spinner from '../../Components/Spinner';
import { REVERSE_TREE, UNUSED_CHANNELS_TREE } from '../../Const';
import { useTreeMenu } from '../../Hooks/ConfiguratorMenu/useTreeMenu';
import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import useTreeItemScroll from '../../Hooks/TreeItem/useTreeItemScroll';
import ContextMenu from '../../UI/ContextMenu';
import TreeContainer from '../TreeContainer/TreeContainer';

import ListHeader from './ListHeader';
import { FiltersTitle, ListProps } from './types';
import styles from './ListContainer.module.scss';

function List({ channels, treeType }: ListProps) {
	const scrollRef = useTreeItemScroll(treeType);
	const unusedChannelsScroll = useTreeItemScroll(UNUSED_CHANNELS_TREE);
	const { isUnusedChannelsListFetching } = useAppSelector(
		(state) => state.configuratorReducer,
	);
	const { handleContextMenu, menuItems, position, setPosition, ref } =
		useTreeMenu(channels ? FiltersTitle.UNUSED_CHANNELS : FiltersTitle.GROUPS);

	return (
		<div className={clsx(styles.list)}>
			<div
				className={clsx(styles.commonList, channels && styles.listWithChannels)}
			>
				<ListHeader
					count={true}
					range={true}
					uncover={true}
					treeType={treeType}
				/>
				<div
					className={clsx(
						styles.list__content,
						treeType === REVERSE_TREE && styles.list__contentDevices,
					)}
					ref={scrollRef}
				>
					<TreeContainer isShow={true} treeType={treeType} />
				</div>
			</div>

			{channels && (
				<div className={styles.unusedChannels}>
					<div className={styles.unusedChannels__header}>
						<div className={styles.header__title}>
							{FiltersTitle.UNUSED_CHANNELS}
						</div>
						<div className={styles.header__body} ref={ref}>
							<div>{isUnusedChannelsListFetching && <Spinner />}</div>
							<button
								onClick={handleContextMenu}
								className={clsx(
									styles.list__button,
									styles.unusedChannels__btn,
								)}
							/>
							{position && (
								<ContextMenu
									items={menuItems}
									position={position}
									setPosition={setPosition}
									className={styles.header__menu}
								/>
							)}
						</div>
					</div>
					<ListHeader
						uncover={true}
						range={false}
						count={false}
						unused={true}
						treeType={UNUSED_CHANNELS_TREE}
					/>
					<TreeContainer
						isShow={true}
						treeType={UNUSED_CHANNELS_TREE}
						unusedChannelsScrollRef={unusedChannelsScroll}
					/>
				</div>
			)}
		</div>
	);
}

export default List;
