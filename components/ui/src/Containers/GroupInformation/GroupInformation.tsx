import { useCallback, useEffect } from 'react';
import clsx from 'clsx';

import { ReactComponent as SwitcherIcon } from '../../Assets/images/LogoParams.svg';
import Modal from '../../Components/Modal';
import Select from '../../Components/Select';
import Table from '../../Components/Table';
import Tree from '../../Components/Tree';
import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import { useGroupInformation } from '../../Hooks/useGroupInformation';
import { selectEnergyElement } from '../../Store/reducers/ConfiguratorSlice/configuratorSelectors';
import { selectContextMenuType } from '../../Store/reducers/ContextMenuSlice/contextMenuSelectors';
import { Version } from '../../Store/reducers/GroupInformationSlice/types';
import { getElementTypeByMenuType, getElementTypeName } from '../History/utils';

import styles from './GroupInformation.module.scss';

function GroupInformation() {
	const energyElement = useAppSelector(selectEnergyElement);
	const contextMenuType = useAppSelector(selectContextMenuType);
	const {
		changeSystem,
		closeGroupInformation,
		systems,
		systemsIsLoading,
		versions,
		versionsIsLoading,
		setVersions,
		forms,
		formsIsLoading,
		getForms,
		mnemoschemes,
		selectedMnemoscheme,
		onTreeExpand,
		isTreeOpen,
		toggleIsTreeOpen,
	} = useGroupInformation();

	const handleSetVersions = useCallback(
		(versions: Version[]) => {
			setVersions(versions);
			const selectedVersion = versions.find((version) => version.isSelected);
			if (selectedVersion) {
				getForms(selectedVersion.value);
			}
		},
		[setVersions],
	);

	const renderHeader = () => {
		const elementType = getElementTypeByMenuType(contextMenuType);
		const subheader = `${getElementTypeName(elementType)} ${
			energyElement?.Number
		} ${energyElement?.Name}`;
		return (
			<div className={styles.header}>
				<div className={styles.header__title}>
					<span>Отображение данных группы</span>
					<span className={styles.header__subheading} title={subheader}>
						{subheader}
					</span>
				</div>
				<div className={styles.header__controllers}>
					<Select
						placeholder="Выберите систему"
						legend={'Система'}
						options={systems}
						disabled={systemsIsLoading}
						onSelect={changeSystem}
					/>
					<Select
						placeholder="Выберите версию"
						legend={'Версия'}
						options={versions}
						disabled={versionsIsLoading}
						onSelect={handleSetVersions}
						className={styles.select__version}
					/>
					<button
						onClick={toggleIsTreeOpen}
						className={clsx(styles.switcher, {
							[styles.switcher__closed]: !isTreeOpen,
							[styles.switcher__opened]: isTreeOpen,
						})}
					>
						<SwitcherIcon />
					</button>
				</div>
			</div>
		);
	};

	useEffect(() => {
		if (isTreeOpen && selectedMnemoscheme) {
			const chosenTree = document.querySelector(
				`[data-tree-id="${selectedMnemoscheme.id}"`,
			);
			if (chosenTree) {
				chosenTree.scrollIntoView({ block: 'center', behavior: 'smooth' });
			}
		}
	}, [isTreeOpen, selectedMnemoscheme]);

	return (
		<Modal title={renderHeader()} onClose={closeGroupInformation}>
			<div className={styles.content}>
				<div className={styles.block}>
					<div className={styles.block__header}>Формы</div>
					<Table
						header={forms.header}
						rows={forms.rows}
						isLoading={formsIsLoading}
						className={styles.table}
					/>
				</div>
				{isTreeOpen && (
					<div className={styles.block}>
						<div className={styles.block__header}>Дерево мнемосхем</div>
						<Tree
							items={mnemoschemes}
							name={' '}
							onExpand={onTreeExpand}
							className={styles.tree}
						/>
					</div>
				)}
			</div>
		</Modal>
	);
}

export default GroupInformation;
