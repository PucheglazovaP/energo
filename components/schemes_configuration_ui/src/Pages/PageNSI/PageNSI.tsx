import {
	Button,
	Filter,
	Panel,
	Tooltip,
	TooltipDirection,
} from '@evraz/ui-kit';

import ModalNSITreeExtendedFiltersChips from '../../Containers/ModalNSITreeExtendedFiltersChips';
import NSIInformationPanel from '../../Containers/NSIInformationPanel';
import TreeDevices from '../../Containers/TreeDevices';
import Refresh from '../../Icons/Refresh';
import ContextMenu from '../../UI/ContextMenu';
import Spinner from '../../UI/Spinner';
import VerticalResizer from '../../UI/VerticalResizer';

import usePageNSI from './usePageNSI';
import useTreeNSIContextMenu from './useTreeNSIContextMenu';

import styles from './PageNSI.module.css';

function PageNSI() {
	const {
		renderTitleLeftFn,
		sidebar,
		isFilterButtonDisabled,
		areDevicesLoading,
		handleTreeItemClick,
		handleFilterButtonClick,
		handleRefreshButtonClick,
	} = usePageNSI();
	const {
		handleTreeItemsContextMenu,
		position,
		setPosition,
		contextMenuItems,
	} = useTreeNSIContextMenu();

	const filterButton = isFilterButtonDisabled ? (
		<Tooltip
			tooltip="Для выбранного типа объекта НСИ нет доступных фильтров"
			forceDirection={TooltipDirection.Right}
		>
			<div>
				<Button className={styles.sidebar_control} disabled>
					<Filter className={styles.control_icon} />
					Фильтр
				</Button>
			</div>
		</Tooltip>
	) : (
		<Button
			className={styles.sidebar_control}
			onClick={handleFilterButtonClick}
		>
			<Filter className={styles.control_icon} />
			Фильтр
		</Button>
	);

	return (
		<section className={`page ${styles.container}`}>
			<Panel
				className={styles.panel}
				title={' '}
				renderTitleLeft={renderTitleLeftFn}
			>
				<VerticalResizer
					firstElementMinWidth={320}
					secondElementMinWidth={1000}
					leftElementWidth={sidebar.isOpen ? 20 : 0}
				>
					<div
						className={sidebar.isOpen ? styles.sidebar : styles.sidebar__hidden}
					>
						<div>
							<div className={styles.sidebar_header}>
								Дерево приборов
								{areDevicesLoading && <Spinner />}
								<div className={styles.sidebar_controls_block}>
									<Button
										className={styles.sidebar_control}
										onClick={handleRefreshButtonClick}
										disabled={areDevicesLoading}
									>
										<Refresh className={styles.control_icon} /> Обновить
									</Button>
									{filterButton}
								</div>
							</div>
							<ModalNSITreeExtendedFiltersChips />
						</div>

						<TreeDevices
							className={styles.devices_tree}
							containerName="nsi"
							onTreeItemClick={handleTreeItemClick}
							onTreeItemContextMenu={handleTreeItemsContextMenu}
						/>
						<ContextMenu
							position={position}
							setPosition={setPosition}
							items={contextMenuItems}
						/>
					</div>
					<NSIInformationPanel />
				</VerticalResizer>
			</Panel>
		</section>
	);
}

export default PageNSI;
