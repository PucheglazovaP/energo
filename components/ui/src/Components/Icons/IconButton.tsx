import { IconButtonProps } from './types';
import styles from './Icons.module.scss';

function IconButton(props: IconButtonProps) {
	const { children, onClick } = props;
	return (
		<button className={styles.icon_button} onClick={onClick}>
			{children}
		</button>
	);
}

export default IconButton;
