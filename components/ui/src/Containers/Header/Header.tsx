import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Path } from '../../Shared/types';
import Dropdown from '../../UI/Dropdown';

import { HeaderItems, HeaderProps } from './types';
import useHeader from './useHeader';

import styles from './Header.module.css';

function Header(props: HeaderProps) {
	const { className } = props;
	const {
		handleHomePageClick,
		handleRedirect,
		activeHeaderItem,
		reportsOptions,
		reportSelectedOption,
		balancesOptions,
		balanceSelectedOption,
		operInformOptions,
		operInformSelectedOption,
		handleSelectRedirect,
		isReportsActive,
		isBalancesActive,
		isOperInformActive,
	} = useHeader();

	return (
		<div className={clsx(styles.root, className || '')}>
			<Button className={styles.button} onClick={handleHomePageClick}>
				<p
					className={clsx(
						styles.title,
						activeHeaderItem === HeaderItems.Configurator && styles.active,
					)}
				>
					{HeaderItems.Configurator}
				</p>
			</Button>

			<Button
				className={styles.button}
				onClick={handleRedirect(Path.Monitoring)}
			>
				<p className={styles.title}>{HeaderItems.Monitoring}</p>
			</Button>
			<Button
				className={styles.button}
				onClick={handleRedirect(Path.EmergencyEvents)}
			>
				<p className={styles.title}>{HeaderItems.EmergencyEvents}</p>
			</Button>
			<Dropdown
				options={operInformOptions}
				selectedOption={operInformSelectedOption}
				setSelectedOption={handleSelectRedirect}
				isActive={isOperInformActive()}
				className={styles.dropdown}
			/>
			<Button className={styles.button} onClick={handleRedirect(Path.NSI)}>
				<p className={styles.title}>{HeaderItems.Nsi}</p>
			</Button>
			<Dropdown
				options={reportsOptions}
				selectedOption={reportSelectedOption}
				setSelectedOption={handleSelectRedirect}
				isActive={isReportsActive()}
				className={styles.dropdown}
			/>
			<Dropdown
				options={balancesOptions}
				selectedOption={balanceSelectedOption}
				setSelectedOption={handleSelectRedirect}
				isActive={isBalancesActive()}
				className={styles.dropdown}
			/>
		</div>
	);
}

export default Header;
