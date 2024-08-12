import { ReactComponent as Logo } from '../../Assets/images/error.svg';
import { ToastersType } from '../../Types/ToastersTypes';

import Toaster from './Toaster';
import styles from './Toaster.module.scss';

function DestructiveToast({ text }: ToastersType): JSX.Element {
	return (
		<div className={styles.destructiveToast}>
			<Toaster title={text}>
				<Logo />
			</Toaster>
		</div>
	);
}

export default DestructiveToast;
