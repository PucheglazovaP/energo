import { ReactComponent as Logo } from '../../Assets/images/success.svg';
import { ToastersType } from '../../Types/ToastersTypes.js';

import Toaster from './Toaster.js';
import styles from './Toaster.module.scss';

function SuccessToaster({ text }: ToastersType) {
	return (
		<div className={styles.successToast}>
			<Toaster title={text}>
				<Logo />
			</Toaster>
		</div>
	);
}

export default SuccessToaster;
