import clsx from 'clsx';

import { PreviewProps } from './types';

import styles from './Preview.module.css';

function Preview(props: PreviewProps) {
	const { src, alt, className } = props;

	const renderPreview = () => {
		if (!src) {
			return <span className={styles.no_image}>Изображение не выбрано</span>;
		}
		return (
			<div className={styles.image_wrapper}>
				<img src={src} alt={alt} className={styles.image} />
			</div>
		);
	};

	return (
		<div className={clsx(styles.preview, className)}>
			<h3 className={styles.preview_title}>Превью</h3>
			{renderPreview()}
		</div>
	);
}

export default Preview;
