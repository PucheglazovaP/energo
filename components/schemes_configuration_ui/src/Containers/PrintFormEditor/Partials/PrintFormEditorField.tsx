import styles from '../PrintFormEditor.module.css';

type PrintFormEditorFieldProps = {
	heading: string;
	title: string;
};

function PrintFormEditorField(props: PrintFormEditorFieldProps) {
	const { heading, title } = props;
	return (
		<span className={styles.field}>
			<div className={styles.field__heading}>{heading}</div>
			<div className={styles.field__title}>{title}</div>
		</span>
	);
}

export default PrintFormEditorField;
