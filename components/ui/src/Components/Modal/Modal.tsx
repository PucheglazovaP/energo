import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { ReactComponent as CloseLogo } from '../../Assets/images/IconClose.svg';
import { useOnClickOutside } from '../../Hooks/useOnClickOutside';

import { Backdrop, ModalProps } from './types';
import styles from './Modal.module.scss';

function Modal(props: ModalProps) {
	const {
		title,
		backdrop = Backdrop.NONE,
		onClose,
		className,
		children,
		withClose = true,
	} = props;

	const ref = useRef(null);

	const handleBackdropClick = useCallback(() => {
		if (backdrop !== Backdrop.STATIC) {
			onClose();
		}
	}, [backdrop, onClose]);

	useOnClickOutside(ref, handleBackdropClick);

	const modalClassName = React.useMemo(() => {
		return clsx(styles.modal, className, {
			[styles.modal__backdrop_active]:
				backdrop === Backdrop.STATIC || backdrop === Backdrop.DEFAULT,
			[styles.modal__backdroup_inactive]: backdrop === Backdrop.NONE,
		});
	}, [backdrop]);

	return (
		<div className={modalClassName}>
			<div className={styles.modal__container} ref={ref}>
				<div className={styles.modal__header}>
					<span className={styles.modal__title}>{title}</span>
					{withClose && (
						<button className={styles.icon__close} onClick={onClose}>
							<CloseLogo onClick={onClose} />
						</button>
					)}
				</div>
				<div className={styles.modal__body}>{children}</div>
			</div>
		</div>
	);
}

export default (props: ModalProps) =>
	ReactDOM.createPortal(<Modal {...props} />, document.body);
