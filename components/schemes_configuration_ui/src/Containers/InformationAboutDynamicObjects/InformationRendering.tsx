import clsx from 'clsx';

import { DataLocationRenderingProps } from './types';

import styles from './InformationAboutBanners.module.css';

function InformationRendering({
	className,
	style,
	data,
	clickCodeT,
}: DataLocationRenderingProps) {
	const dataMap = data.map((element: any, index: number) => {
		return (
			<div className={clsx(styles.rendering_data)} key={index}>
				<div className={clsx(styles.rendering_name)}>{element.nameObject}</div>
				<div className={clsx(styles.rendering_name)}>
					{element.numberGroupData}
				</div>
				<div className={clsx(styles.rendering_name)}>{element.eWork}</div>
				<div className={clsx(styles.rendering_name)}>{element.groupData}</div>
				<div className={clsx(styles.rendering_name)}>
					<button
						onClick={() => {
							clickCodeT(element.codeObject);
						}}
						className={clsx(styles.rendering_button)}
					>
						Показать
					</button>
				</div>
			</div>
		);
	});
	return (
		<div className={clsx(styles.rendering_root, className)} style={style}>
			{dataMap}
		</div>
	);
}

export default InformationRendering;
