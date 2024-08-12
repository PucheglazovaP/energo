import React, { useCallback, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button, Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import LeftArrowIcon from '../../Icons/ArrowLeft';
import CornerArrowLeftUpIcon from '../../Icons/CornerArrowLeftUp';
import RefreshIcon from '../../Icons/Refresh';
import { $activeForm } from '../../Models/ActiveForm';
import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { $navigation } from '../../Models/Navigation';
import { $navigationHistory } from '../../Models/NavigationHistory';
import {
	changeFormRoute,
	deleteFormLastRoute,
} from '../../Models/NavigationHistory/events';
import { $treeForms } from '../../Models/TreeForms';
import { getFormInfoById } from '../../Models/TreeForms/events';
import { TooltipDirection } from '../../Shared/types';
import { updateSearchParams } from '../../Utils/searchParams';

import NavigationForFormsProps from './types';

import styles from './NavigationForForms.module.css';

function NavigationForForms({ className }: NavigationForFormsProps) {
	const { activeVersion } = useStore($activeIds);
	const { formId, treeType } = useStore($navigation);
	const tree = useStore($treeForms);
	const user = useStore($user);
	const { isLoading } = useStore($activeForm);
	const { form: formNavigation } = useStore($navigationHistory);
	const [, setSearchParams] = useSearchParams();
	const location = useLocation();

	const handleRefreshFormClick = useCallback(() => {
		if (formId && user)
			getFormInfoById({
				formId: formId,
				versionCode: activeVersion?.code || 90,
				userId: user.preferredUsername,
			});
	}, [formId, activeVersion, user]);

	const formParentId = useMemo(() => {
		const treeItem = tree.find((item) => item.id === formId);
		return treeItem?.parentId;
	}, [tree, formId]);

	const handleBackToParentFormClick = useCallback(() => {
		changeFormRoute(location.pathname + location.search);
		if (formParentId && user) {
			getFormInfoById({
				formId: formParentId,
				versionCode: activeVersion?.code || 90,
				userId: user.preferredUsername,
			});
			const updatedSearchParams = updateSearchParams(new URLSearchParams(), {
				versionId: activeVersion?.code || 90,
				treeType,
				formId: formParentId,
			});
			setSearchParams(updatedSearchParams);
		}
	}, [formParentId, treeType, location, activeVersion, user]);

	const handleBackToPrevFormClick = useCallback(() => {
		const prevUrl: URL = new URL(
			formNavigation[formNavigation.length - 1],
			window.location.origin,
		);
		const prevSearchParams: URLSearchParams = prevUrl.searchParams;
		const id: string | null = prevSearchParams.get('formId');
		if (id && user) {
			getFormInfoById({
				formId: Number(id),
				versionCode: activeVersion?.code || 90,
				userId: user.preferredUsername,
			});
			const updatedSearchParams = updateSearchParams(new URLSearchParams(), {
				versionId: activeVersion?.code || 90,
				treeType,
				formId: Number(id),
			});
			setSearchParams(updatedSearchParams);
			deleteFormLastRoute();
		}
	}, [formNavigation, treeType, activeVersion, user]);

	return (
		<div className={clsx(styles.root, className)}>
			<Tooltip
				tooltip="Обновить форму"
				direction={TooltipDirection.Down}
				className={styles.tooltip}
			>
				<Button
					className={styles.item}
					onClick={handleRefreshFormClick}
					key="navigation-refresh"
					disabled={isLoading}
				>
					<RefreshIcon className={styles.icon} />
				</Button>
			</Tooltip>
			<Tooltip
				tooltip="Шаг назад"
				direction={TooltipDirection.Down}
				className={styles.tooltip}
			>
				<Button
					className={styles.item}
					onClick={handleBackToPrevFormClick}
					disabled={formNavigation.length < 1}
					key="navigation-back"
				>
					<LeftArrowIcon className={styles.icon} />
				</Button>
			</Tooltip>
			<Tooltip
				tooltip="Вверх по структуре"
				direction={TooltipDirection.Down}
				className={styles.tooltip}
			>
				<Button
					className={styles.item}
					onClick={handleBackToParentFormClick}
					disabled={!formParentId}
					key="navigation-parent"
				>
					<CornerArrowLeftUpIcon className={styles.icon} />
				</Button>
			</Tooltip>
		</div>
	);
}

export default NavigationForForms;
