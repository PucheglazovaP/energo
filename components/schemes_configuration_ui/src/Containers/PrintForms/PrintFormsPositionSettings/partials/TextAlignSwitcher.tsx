import { Switcher } from '@evraz/ui-kit';
import { SwitcherItemType } from '@evraz/ui-kit/dist/src/components/Switcher/types';

import {
	AlignmentCenter,
	AlignmentLeft,
	AlignmentRight,
} from '../../../../Icons';
import { PrintFormTextAlign } from '../../../../Shared/types';

type TextAlignSwitcherProps = {
	selectedId: PrintFormTextAlign;
	handleSelect: (id: string) => void;
};

function TextAlignSwitcher(props: TextAlignSwitcherProps) {
	const { selectedId, handleSelect } = props;

	const items: SwitcherItemType[] = [
		{
			id: '1',
			title: <AlignmentLeft />,
		},
		{
			id: '3',
			title: <AlignmentCenter />,
		},
		{
			id: '2',
			title: <AlignmentRight />,
		},
	];

	return (
		<Switcher
			items={items}
			selectedId={String(selectedId)}
			onSelect={handleSelect}
		/>
	);
}

export default TextAlignSwitcher;
