import { memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Switcher } from '@evraz/ui-kit';
import { SwitcherItemType } from '@evraz/ui-kit/dist/src/components/Switcher/types';
import clsx from 'clsx';

import { setNavigation } from '../../Models/Navigation/events';
import { TreeTypes } from '../../Shared/types';
import { updateSearchParams } from '../../Utils/searchParams';

import SidebarTree from './SidebarTree';
import { SidebarProps } from './types';

import styles from './Sidebar.module.css';

const treeSwitcher: SwitcherItemType[] = [
	{
		id: TreeTypes.Mnemoschemes,
		title: 'Мнемосхемы',
	},
	{
		id: TreeTypes.Devices,
		title: 'Приборы и каналы',
	},
	{
		id: TreeTypes.Channels,
		title: 'Без привязки к прибору',
	},
];

function Sidebar(props: SidebarProps) {
	const { type, className, versionId } = props;
	const [, setSearchParams] = useSearchParams();

	const onSelect = (id: string) => {
		setNavigation({
			treeType: id as TreeTypes,
			formId: undefined,
		});
		const updatedSearchParams: URLSearchParams = updateSearchParams(
			new URLSearchParams(),
			{
				versionId,
				treeType: id,
			},
		);
		setSearchParams(updatedSearchParams);
	};

	return (
		<aside className={clsx(styles.root, className)}>
			<>
				<div className={styles.radioGroup}>
					<Switcher
						items={treeSwitcher}
						selectedId={type}
						onSelect={onSelect}
						className={styles.switcher}
					/>
				</div>
				<SidebarTree type={type} />
			</>
		</aside>
	);
}

export default memo(Sidebar);
