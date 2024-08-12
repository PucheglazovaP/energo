import clsx from 'clsx';

import { DataLocationRenderingProps } from './types';

import styles from './DataLocation.module.css';

function DataLocationRendering({
	className,
	style,
	data,
}: DataLocationRenderingProps) {
	const res = data.map((element: any, index: number) => {
		return (
			<div className={clsx(styles.rendering_data)} key={index}>
				<div className={clsx(styles.rendering_name)}>{element.Name}</div>
				<div className={clsx(styles.rendering_value)}>{element.Value}</div>
			</div>
		);
	});
	return (
		<div className={clsx(styles.rendering_root, className)} style={style}>
			<div className={clsx(styles.rendering_list)}>
				<p>Наименование</p>
				<p>Расположение</p>
			</div>
			{res}
		</div>
	);
}

export default DataLocationRendering;
