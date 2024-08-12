import React, { FC } from 'react';
import clsx from 'clsx';

import { ReactComponent as LogoMore } from '../../Assets/images/LogoMore.svg';
import { ReactComponent as LogoParams } from '../../Assets/images/LogoParams.svg';
import { useTooltipMenu } from '../../Hooks/ConfiguratorMenu/useTooltipMenu';
import ContextMenu from '../../UI/ContextMenu';

import styles from './HomePageComponents.module.scss';

interface HomePageHeaderProps {
	isParametersActive: boolean;
	openHistory: () => void;
}

const HomePageHeader: FC<HomePageHeaderProps> = ({
	isParametersActive,
	openHistory,
}) => {
	const {
		handleContextMenu,
		contextMenuItems,
		parametersButtonHandler,
		position,
		setPosition,
	} = useTooltipMenu();

	return (
		<div className={styles.header}>
			<div className={styles.header__title}>Конфигуратор тегов</div>
			<div className={styles.header__filters}>
				<button
					className={clsx(styles.btn, styles.buttonHistory)}
					onClick={openHistory}
				>
					История действий
				</button>
				<div className={styles.buttonMore__container}>
					<button
						className={clsx(styles.btn, styles.buttonMore)}
						onClick={handleContextMenu}
					>
						<LogoMore />
					</button>
					{position && (
						<ContextMenu
							items={contextMenuItems}
							position={position}
							setPosition={setPosition}
							className={styles.header__menu}
						/>
					)}
				</div>

				<button
					onClick={parametersButtonHandler}
					className={clsx(styles.btn, styles.buttonParams, {
						[styles.buttonParams__disabled]: !isParametersActive,
						[styles.buttonParams__active]: isParametersActive,
					})}
				>
					<LogoParams />
				</button>
			</div>
		</div>
	);
};

export default HomePageHeader;
