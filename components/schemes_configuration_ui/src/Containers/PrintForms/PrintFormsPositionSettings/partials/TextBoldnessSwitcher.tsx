import { Switcher } from '@evraz/ui-kit';
import { SwitcherItemType } from '@evraz/ui-kit/dist/src/components/Switcher/types';

import { TextBold, TextThick } from '../../../../Icons';

type TextBoldnessSwitcherProps = {
	selectedId: number;
	handleSelect: (id: string) => void;
};

function TextBoldnessSwitcher(props: TextBoldnessSwitcherProps) {
	const { selectedId, handleSelect } = props;

	const items: SwitcherItemType[] = [
		{
			id: '0',
			title: <TextThick />,
		},
		{
			id: '1',
			title: <TextBold />,
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

export default TextBoldnessSwitcher;
