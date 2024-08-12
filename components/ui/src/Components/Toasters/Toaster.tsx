import { ReactComponent as CloseLogo } from '../../Assets/images/IconClose.svg';
import { ToasterType } from '../../Types/ToastersTypes';

import styles from './Toaster.module.scss';

function Toaster({ children, title }: ToasterType): JSX.Element {
	return (
		<div className={styles.toaster}>
			<div className={styles.toaster__body}>
				{children}
				<div style={{ whiteSpace: 'pre-wrap' }}>{title}</div>
			</div>

			<button type="button" className={styles.toaster__closer}>
				<CloseLogo />
			</button>
		</div>
	);
}

export default Toaster;
