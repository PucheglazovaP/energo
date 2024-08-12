import { AutoSizer, Column, Table } from 'react-virtualized';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import MoreIcon from '../../Icons/More';
import SettingsIcon from '../../Icons/Settings';
import Chart from '../../UI/Chart';
import ContextMenu from '../../UI/ContextMenu';
import HorizontalResizer from '../../UI/HorizontalResizer';
import Select from '../../UI/Select';
import Spinner from '../../UI/Spinner';

import BottomTableHeader from './BottomTableHeader';
import SupTableHeader from './SupTableHeader';
import ChartComparisonProps from './types';
import useChartComparison from './useChartComparison';

import styles from './ChartComparison.module.css';

function ChartComparison({ className }: ChartComparisonProps) {
	const {
		position,
		contextMenuItems,
		dynamicHeaders,
		series,
		tableData,
		chartOptions,
		comparisonChart,
		title,
		activeIndex,
		setActiveIndex,
		setPosition,
		handleSelectedDiscrete,
		handleSelectedUnit,
		handleContextMenu,
		onPeriodsListBtnClick,
		methodName,
		isConsumption,
		round,
	} = useChartComparison();

	return (
		<div className={clsx(styles.root, className)}>
			<div className={styles.btns}>
				<h3 className={styles.title}>
					{title}
					{comparisonChart.isLoading && (
						<div className={styles.spinner}>
							<Spinner className={styles.loading} />
						</div>
					)}
				</h3>
				<Select
					options={comparisonChart.discreteList}
					onSelect={handleSelectedDiscrete}
					disabled={comparisonChart.isLoading}
					className={clsx(
						styles.selector,
						styles['selector_discrete'],
						'selector_discrete',
					)}
				/>
				<Select
					options={comparisonChart.unitList}
					onSelect={handleSelectedUnit}
					disabled={comparisonChart.isLoading}
					className={clsx(styles.selector)}
				/>
				<div className={styles.settings}>
					<Button
						className={styles.settings_btn}
						onClick={onPeriodsListBtnClick}
					>
						<SettingsIcon className={styles.settings_icon} />
					</Button>
					<Button className={styles.menu_btn} onClick={handleContextMenu}>
						<MoreIcon />
					</Button>
					{position && (
						<ContextMenu
							items={contextMenuItems}
							position={position}
							setPosition={setPosition}
							className={styles.menu}
						/>
					)}
				</div>
			</div>
			<HorizontalResizer
				firstElementMinHeight={160}
				secondElementMinHeight={150}
				className={styles.resizer}
			>
				<Chart
					isNavigatorEnabled={false}
					series={series}
					chartOptions={chartOptions}
					className={'chart-comparison'}
				/>
				<div style={{ height: '80%' }}>
					<SupTableHeader
						methodName={methodName}
						data={comparisonChart.chartsData}
						isSumColumnVisible={comparisonChart.isSumColumnVisible}
					/>
					<AutoSizer
						style={{
							backgroundColor: '#ffffff',
							marginTop: '1em',
						}}
					>
						{({ height, width }) => (
							<Table
								height={height}
								width={width}
								headerHeight={40}
								rowHeight={30}
								className={styles.table}
								rowCount={tableData.length}
								rowGetter={({ index }) => tableData[index]}
								onRowClick={(item) => {
									setActiveIndex(item.index);
								}}
								scrollToIndex={activeIndex != -1 ? activeIndex : undefined}
								headerClassName={styles.table_header}
								rowClassName={(info) =>
									clsx(
										styles.table_row,
										activeIndex != -1 &&
											info.index === activeIndex &&
											styles.table_row__active,
									)
								}
							>
								{dynamicHeaders.map((item) =>
									item.isVisible ? (
										<Column
											label={item.text}
											dataKey={item.accessor}
											width={400}
											key={item.accessor}
											headerStyle={{ backgroundColor: '#ffffff' }}
										/>
									) : null,
								)}
							</Table>
						)}
					</AutoSizer>
					<BottomTableHeader
						methodName={methodName}
						data={comparisonChart.chartsData}
						isConsumption={isConsumption}
						round={round}
					/>
				</div>
			</HorizontalResizer>
		</div>
	);
}

export default ChartComparison;
