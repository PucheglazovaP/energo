import clsx from 'clsx';

import { useContextMenu } from '../../Hooks/ContextMenu/useContextMenu';

import styles from './CustomContextMenu.module.scss';

function CustomContextMenu() {
	const { contextMenuItems, position, closeMenu, contextRef } =
		useContextMenu();

	return (
		<>
			<ul
				className={styles.contextMenu}
				style={{ left: position[0], top: position[1] }}
				onMouseLeave={closeMenu}
				ref={contextRef}
			>
				{contextMenuItems?.map((item) => (
					<div key={item.name} className={styles.contextMenu__itemContainer}>
						{item.isVisible && (
							<button
								className={clsx(
									styles.contextMenu__item,
									item.disabled && styles.contextMenu__disabledItem,
								)}
								onClick={item.onClick}
								disabled={item.disabled}
							>
								<img
									className={styles.contextMenu__icon}
									src={item.icon}
									alt=""
								/>
								<span>{item.name}</span>
							</button>
						)}
						{item.needRenderSeparator && (
							<div className={styles.contextMenu__separator}></div>
						)}
					</div>
				))}
			</ul>
		</>
	);
}

export default CustomContextMenu;
