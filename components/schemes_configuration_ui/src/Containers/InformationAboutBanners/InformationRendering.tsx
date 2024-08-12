import clsx from 'clsx';

import { ModalIconBoolean } from './ModalIcontBooleean';
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
				<div className={clsx(styles.rendering_name)}>
					{element.keyTransparency}
				</div>
				<div className={clsx(styles.rendering_name)}>
					{element.dataSUBD ? <ModalIconBoolean /> : ''}
				</div>

				<div className={clsx(styles.rendering_name)}>{element.numberGD}</div>
				<div className={clsx(styles.rendering_name)}>{element.eWork}</div>
				<div className={clsx(styles.rendering_name)}>{element.dataGroup}</div>
				<div className={clsx(styles.rendering_name)}>
					<button
						onClick={() => {
							clickCodeT(element.codeTransparency);
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
