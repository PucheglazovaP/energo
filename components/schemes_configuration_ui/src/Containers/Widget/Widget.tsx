import { useEffect, useRef, useState } from 'react';
import {
	Rnd,
	RndDragCallback,
	RndDragEvent,
	RndResizeCallback,
} from 'react-rnd';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { Button, Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Close } from '../../Icons';
import BarChartIcon from '../../Icons/BarChart';
import Col2LineIcon from '../../Icons/Col2Line';
import CopypIcon from '../../Icons/Copy';
import DragDropIcon from '../../Icons/DragDrop';
import MaxSizeIcon from '../../Icons/MaxSize';
import { TooltipDirection } from '../../Shared/types';
import Chart from '../../UI/Chart';
import Spinner from '../../UI/Spinner';

import WidgetProps from './types';
import useWidgetInfo from './useWidgetInfo';

import styles from './Widget.module.css';

function Widget({ className }: WidgetProps) {
	const {
		onTableBtnClick,
		onChartBtnClick,
		onMaxSizeBtnClick,
		onHideBtnClick,
		onCloseBtnClick,
		series,
		title,
		isLoading,
		chartOptions,
		isChartVisible,
		dynamicHeaders,
		tableData,
		date,
		discrete,
		isBodyVisible,
		isWidgetOpen,
	} = useWidgetInfo();
	const nodeRef = useRef<HTMLDivElement>(null);

	const [dimensions, setDimensions] = useState({
		width: `610px`,
		height: `340px`,
		x: window.innerWidth - 640,
		y: window.innerHeight - 360,
	});

	const onDragStop: RndDragCallback = (
		e: RndDragEvent,
		d: { x: number; y: number },
	) => {
		setDimensions({
			x: d.x,
			y: d.y,
			width: dimensions.width,
			height: dimensions.height,
		});
	};

	const onResize: RndResizeCallback = (e, direction, ref, delta, position) => {
		setDimensions({
			width: ref.style.width,
			height: ref.style.height,
			...position,
		});
	};

	useEffect(() => {
		if (isBodyVisible) {
			setDimensions((prev) => ({
				...prev,
				height: `340px`,
			}));
		} else {
			setDimensions((prev) => ({
				...prev,
				height: `60px`,
			}));
		}
	}, [isBodyVisible]);

	return (
		<>
			{isWidgetOpen && (
				<Rnd
					dragHandleClassName={styles.handle}
					style={{ zIndex: 9999 }}
					enableResizing={{
						top: true,
						right: true,
						bottom: true,
						left: true,
						topRight: true,
						bottomRight: true,
						bottomLeft: true,
						topLeft: true,
					}}
					size={{ width: dimensions.width, height: dimensions.height }}
					position={{ x: dimensions.x, y: dimensions.y }}
					onDragStop={onDragStop}
					onResize={onResize}
					minWidth={300}
					minHeight={isBodyVisible ? 200 : 60}
					maxHeight={!isBodyVisible ? 60 : undefined}
					bounds=".page"
				>
					<div className={clsx(styles.root, className)} ref={nodeRef}>
						<div className={styles.panel}>
							<div className={styles.handle}>
								<DragDropIcon className={styles.icon} />
							</div>
							<h4 className={styles.title}>{title}</h4>
							<div className={styles.control_btns}>
								<Tooltip
									tooltip="Открыть в теле документа"
									direction={TooltipDirection.Up}
								>
									<Button
										className={styles.control_btn}
										onClick={onMaxSizeBtnClick}
										key={'tooltip-1'}
									>
										<MaxSizeIcon className={styles.control_icon} />
									</Button>
								</Tooltip>
								<Tooltip tooltip="Свернуть" direction={TooltipDirection.Down}>
									<Button
										className={styles.control_btn}
										onClick={onHideBtnClick}
										key={'tooltip-2'}
									>
										<CopypIcon className={styles.control_icon} />
									</Button>
								</Tooltip>
								<Tooltip tooltip="Закрыть" direction={TooltipDirection.Down}>
									<Button
										className={styles.control_btn}
										onClick={onCloseBtnClick}
										key={'tooltip-3'}
									>
										<Close className={styles.control_icon} />
									</Button>
								</Tooltip>
							</div>
						</div>
						{isBodyVisible && (
							<>
								<div className={styles.info_panel}>
									<div className={styles.info}>
										<span className={styles.date}>{date}</span> / {discrete}
									</div>
									<div className={styles.btns}>
										<Button className={styles.btn} onClick={onChartBtnClick}>
											<BarChartIcon className={styles.icon} />
										</Button>
										<Button className={styles.btn} onClick={onTableBtnClick}>
											<Col2LineIcon className={styles.icon} />
										</Button>
									</div>
								</div>

								<div className={styles.wrapper}>
									{isLoading ? (
										<div className={styles.spinner}>
											<Spinner className={styles.loading} />
										</div>
									) : (
										<>
											{isChartVisible && (
												<Chart
													series={series}
													chartOptions={chartOptions}
													height="100%"
												/>
											)}
											{!isChartVisible && (
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
															headerHeight={30}
															rowHeight={30}
															className={styles.table}
															rowCount={tableData.length}
															rowGetter={({ index }) => tableData[index]}
															headerClassName={styles.table_header}
															rowClassName={clsx(styles.table_row)}
														>
															{dynamicHeaders.map((item) => (
																<Column
																	label={item.text}
																	dataKey={item.accessor}
																	width={400}
																	key={item.accessor}
																	headerStyle={{ backgroundColor: '#ffffff' }}
																/>
															))}
														</Table>
													)}
												</AutoSizer>
											)}
										</>
									)}
								</div>
							</>
						)}
					</div>
				</Rnd>
			)}
		</>
	);
}

export default Widget;
