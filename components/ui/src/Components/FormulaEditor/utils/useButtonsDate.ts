import { useCallback, useState } from 'react';
import { format } from 'date-fns';

import {
	beforeDateItems,
	datePartItems,
	startDateItems,
} from '../../../Shared/const';
import {
	ButtonsBooleansProps,
	DataTab,
	DataTabsElem,
	DateArgumentItem,
} from '../types';

export function useButtonsDate(props: ButtonsBooleansProps) {
	const { onClick } = props;
	const [activeTab, setActiveTab] = useState<DataTab>(DataTab.Argument);
	const setActiveTabHandler = useCallback(
		(tab: DataTab) => () => {
			setActiveTab(tab);
		},
		[activeTab],
	);

	const onClickHandler = useCallback(
		(elem: DataTabsElem, type?: DateArgumentItem) =>
			(string: string | number) =>
			() => {
				if (type === DateArgumentItem.Calendar) {
					const date = string ? new Date(string) : new Date();
					onClick && onClick(`'${format(date, 'yyyy-MM-dd_HH:mm:ss')}'`);
					return;
				}
				switch (elem) {
					case DataTabsElem.Group:
						onClick && onClick(`gr(${string})`);
						break;
					case DataTabsElem.Channel:
						onClick && onClick(`ch(${string})`);
						break;
					case DataTabsElem.Start:
						onClick &&
							onClick(
								`<value_start>(<${
									string ? startDateItems[string as number] : ''
								}>,1)`,
							);
						break;
					case DataTabsElem.Before:
						onClick &&
							onClick(
								`<value_before>(0,<${
									string ? beforeDateItems[string as number] : ''
								}>,1)`,
							);
						break;
					case DataTabsElem.DatePart:
						onClick &&
							onClick(
								`<date_part>(<${
									string ? datePartItems[string as number] : ''
								}>,1)`,
							);
						break;
					case DataTabsElem.Date:
						onClick && onClick(`<fun_2>`);
						break;
					case DataTabsElem.DaysOfMonth:
						onClick && onClick(`<fun_3>`);
						break;
				}
			},
		[],
	);
	return { activeTab, setActiveTabHandler, onClickHandler };
}
