/* global CSSModuleClasses */
import clsx from 'clsx';
import { arrayToTree } from 'performant-array-to-tree';

import { Arrow, CheckMark } from '../../Components/Icons';
import { ArrowDirection } from '../../Components/Icons/types';
import { Mnemoscheme } from '../../Store/reducers/GroupInformationSlice/types';

export function groupInformationTreeAdapter(
	mnemoschemes: Mnemoscheme[],
	redirectToMonitoring: (id: string) => void,
	styles: CSSModuleClasses,
) {
	const customTree = mnemoschemes.map((mnemoscheme) => ({
		...mnemoscheme,
		renderFn: () => (
			<div
				className={clsx(styles.tree__body, {
					[styles.tree__selected]: mnemoscheme.isSelected,
				})}
			>
				<span title={mnemoscheme.name} className={styles.tree__name}>
					{mnemoscheme.name}
				</span>
				<div className={styles.tree__controllers}>
					<button
						className={clsx(styles.checkMark, {
							[styles.checkMark__selected]: mnemoscheme.isSelected,
						})}
					>
						<CheckMark />
					</button>
					<button
						className={styles.tree__link}
						onClick={() => redirectToMonitoring(mnemoscheme.id)}
					>
						<Arrow direction={ArrowDirection.RIGHT} />
					</button>
				</div>
			</div>
		),
	}));
	const tree = arrayToTree(customTree, { dataField: null });
	return tree as Mnemoscheme[];
}
