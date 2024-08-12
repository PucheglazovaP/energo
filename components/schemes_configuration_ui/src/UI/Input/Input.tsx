import {
	ComponentPropsWithRef,
	ForwardedRef,
	forwardRef,
	ReactNode,
} from 'react';
import clsx from 'clsx';

import Spinner from '../Spinner';

import styles from './Input.module.css';

interface IProps extends ComponentPropsWithRef<'input'> {
	error?: string;
	glyph?: ReactNode;
	isRequired?: boolean;
	isSearch?: boolean;
	label?: string;
	isLoading?: boolean;
	outline?: boolean;
	onGlyphClick?: () => void;
}

const Input = forwardRef(function Input(
	props: IProps,
	ref: ForwardedRef<HTMLInputElement>,
) {
	const {
		className,
		error,
		glyph,
		isRequired,
		label,
		isLoading,
		onGlyphClick,
		isSearch,
		placeholder,
		outline,
		...rest
	} = props;

	return (
		<div
			className={clsx(
				styles['root'],
				error && styles.error,
				props.disabled && styles.disabled,
				className,
			)}
		>
			<div
				className={clsx(styles['input'], rest.value && styles.input__filled)}
			>
				{glyph && !onGlyphClick && <div className={styles.icon}>{glyph}</div>}
				{glyph && onGlyphClick && (
					<button
						type="button"
						className={clsx(styles.icon, styles.button)}
						onClick={onGlyphClick}
					>
						{glyph}
					</button>
				)}
				{isSearch ? (
					<>
						<input
							{...rest}
							ref={ref}
							placeholder={placeholder || ' '}
							className={styles.search}
						/>
						{isLoading && (
							<div className={styles.loading}>
								<Spinner />
							</div>
						)}
					</>
				) : (
					<input {...rest} placeholder={placeholder || ' '} ref={ref} />
				)}

				{label && (
					<label
						className={clsx(styles.label, outline && styles.outline)}
						htmlFor={props.name}
					>
						<span>{label}</span>
						{isRequired && <span className={styles['required_marker']}>*</span>}
					</label>
				)}
			</div>

			<p className={styles.error}>{error}</p>
		</div>
	);
});

Input.displayName = 'Input';

export default Input;
