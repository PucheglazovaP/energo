import clsx from 'clsx';

import { DuplicatesRenderingProps } from './types';

import styles from './Duplicates.module.css';

function DuplicatesRendering({
	className,
	style,
	data,
}: DuplicatesRenderingProps) {
	const res = data.map((element: any, index: number) => {
		return (
			<div className={clsx(styles.rendering_data)} key={index}>
				<div className={clsx(styles.rendering_name)}>{element.Number}</div>
				<div className={clsx(styles.rendering_value)}>{element.NAME}</div>
			</div>
		);
	});
	return (
		<div className={clsx(styles.rendering_root, className)} style={style}>
			<div className={clsx(styles.rendering_list)}>
				<div className={clsx(styles.icon_search)}>
					<p>Номер</p>
				</div>
				<div className={clsx(styles.icon_search)}>
					<p>Наименование</p>
				</div>
			</div>
			{res}
		</div>
	);
}

export default DuplicatesRendering;
