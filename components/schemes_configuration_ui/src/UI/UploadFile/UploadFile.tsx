import { UploadFileProps } from './types';

import styles from './UploadFile.module.css';

function UploadFile({
	id,
	className,
	icon,
	title,
	acceptedTypes,
	multiple,
	onChange,
}: UploadFileProps) {
	return (
		<label htmlFor={id} className={`${styles.upload} ${className || ''}`}>
			<input
				id={id}
				className={styles.input}
				type="file"
				accept={acceptedTypes.join(',')}
				name="image_upload"
				multiple={multiple}
				onChange={onChange}
			/>
			{icon || null}
			{title}
		</label>
	);
}

export default UploadFile;
