import { ReactComponent as Logo } from '../../Assets/images/warningIcon.svg';
import { ToastersType } from '../../Types/ToastersTypes';

import Toaster from './Toaster.js';
import styles from './Toaster.module.scss';

function WarningToast({ text }: ToastersType) {
	return (
		<div className={styles.warningToast}>
			<Toaster title={text}>
				<Logo />
			</Toaster>
		</div>
	);
}

export default WarningToast;
