import clsx from 'clsx';

import { picturesDynamicProps } from './types';

import styles from './SetPicturesDynamicObject.module.css';

function SetPicturesDynamicObjectRender({
	className,
	style,
	data,
}: picturesDynamicProps) {
	const dataMap = data.map((element: any, index: number) => {
		return (
			<div className={clsx(styles.rendering_data)} key={index}>
				<div className={clsx(styles.rendering_name)}>
					{element.serialNumber}
				</div>
				<div className={clsx(styles.rendering_name)}>{element.meaning}</div>
				<div className={clsx(styles.rendering_name)}>1{element.comment}</div>
				<button className={clsx(styles.rendering_name_button)}>Выбрать</button>
				<div className={clsx(styles.rendering_name_button_del)}>
					<svg
						className={clsx(styles.rendering_name_button_del_icon)}
						width="12"
						height="13"
						viewBox="0 0 12 13"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M5.24674 1.74967C5.09204 1.74967 4.94366 1.81113 4.83427 1.92053C4.72487 2.02993 4.66341 2.1783 4.66341 2.33301V2.91634H8.16341V2.33301C8.16341 2.1783 8.10195 2.02993 7.99256 1.92053C7.88316 1.81113 7.73479 1.74967 7.58008 1.74967H5.24674ZM9.33008 2.91634V2.33301C9.33008 1.86888 9.1457 1.42376 8.81751 1.09557C8.48933 0.767382 8.04421 0.583008 7.58008 0.583008H5.24674C4.78262 0.583008 4.3375 0.767382 4.00931 1.09557C3.68112 1.42376 3.49674 1.86888 3.49674 2.33301V2.91634H1.16341C0.841245 2.91634 0.580078 3.17751 0.580078 3.49967C0.580078 3.82184 0.841245 4.08301 1.16341 4.08301H1.74674V11.6663C1.74674 12.1305 1.93112 12.5756 2.25931 12.9038C2.5875 13.232 3.03262 13.4163 3.49674 13.4163H9.33008C9.79421 13.4163 10.2393 13.232 10.5675 12.9038C10.8957 12.5756 11.0801 12.1305 11.0801 11.6663V4.08301H11.6634C11.9856 4.08301 12.2467 3.82184 12.2467 3.49967C12.2467 3.17751 11.9856 2.91634 11.6634 2.91634H9.33008ZM2.91341 4.08301V11.6663C2.91341 11.8211 2.97487 11.9694 3.08427 12.0788C3.19366 12.1882 3.34204 12.2497 3.49674 12.2497H9.33008C9.48479 12.2497 9.63316 12.1882 9.74256 12.0788C9.85195 11.9694 9.91341 11.8211 9.91341 11.6663V4.08301H2.91341ZM5.24674 5.83301C5.56891 5.83301 5.83008 6.09418 5.83008 6.41634V9.91634C5.83008 10.2385 5.56891 10.4997 5.24674 10.4997C4.92458 10.4997 4.66341 10.2385 4.66341 9.91634V6.41634C4.66341 6.09418 4.92458 5.83301 5.24674 5.83301ZM6.99674 6.41634C6.99674 6.09418 7.25791 5.83301 7.58008 5.83301C7.90224 5.83301 8.16341 6.09418 8.16341 6.41634V9.91634C8.16341 10.2385 7.90224 10.4997 7.58008 10.4997C7.25791 10.4997 6.99674 10.2385 6.99674 9.91634V6.41634Z"
							fill="black"
						/>
					</svg>
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

export default SetPicturesDynamicObjectRender;
