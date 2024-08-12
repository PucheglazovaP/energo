import React from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { ReactComponent as LogoMore } from '../../Assets/images/LogoMore.svg';
import { ReactComponent as LogoUpdate } from '../../Assets/images/LogoUpdate.svg';
import { useConfiguratorHeaderFilters } from '../../Hooks/ConfiguratorFilters/useConfiguratorHeaderFilters';
import { useTreeMenu } from '../../Hooks/ConfiguratorMenu/useTreeMenu';
import ContextMenu from '../../UI/ContextMenu';
import Spinner from '../Spinner';

import { BlockHeaderProps } from './types';
import styles from './TreeBlock.module.scss';

function BlockHeader({ filterHeader, isListFetching }: BlockHeaderProps) {
	const { handleRefreshClick, handleFilterItemClick, activeFilter } =
		useConfiguratorHeaderFilters(filterHeader);
	const { handleContextMenu, menuItems, position, setPosition, ref } =
		useTreeMenu(filterHeader.title);

	return (
		<div className={styles.contentHeader}>
			<div className={styles.contentHeader__groups}>
				<div className={styles.contentHeader__title}>{filterHeader.title}</div>
				<div className={styles.groups__buttons}>
					{filterHeader.buttons.map((el, index) => (
						<Button
							key={`${el}_${index}`}
							onClick={handleFilterItemClick(index)}
							className={
								activeFilter - 1 === index
									? clsx(styles.groups__button, styles.groups__active)
									: styles.groups__button
							}
						>
							{el.title}
						</Button>
					))}
				</div>
			</div>
			<div className={styles.contentHeader__buttons_container}>
				<div className={styles.spinner__container}>
					{isListFetching && <Spinner />}
				</div>
				<div className={styles.contentHeader__buttons} ref={ref}>
					<button
						className={clsx(styles.buttons, styles.buttons__updateBtn)}
						onClick={handleRefreshClick}
					>
						<LogoUpdate />
					</button>
					<button
						className={clsx(styles.buttons, styles.buttons__moreBtn)}
						onClick={handleContextMenu}
					>
						<LogoMore />
					</button>
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
		</div>
	);
}

export default BlockHeader;
