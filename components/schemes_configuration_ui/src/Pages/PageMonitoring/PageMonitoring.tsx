import { lazy, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Panel } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import ButtonToggleSideBar from '../../Containers/ButtonToggleSideBar';
import FormTabs from '../../Containers/FormTabs';
import Scheme from '../../Containers/Scheme';
import Sidebar from '../../Containers/Sidebar';
import { updateTabRoute } from '../../Models/FormTabs/events';
import { $navigation } from '../../Models/Navigation';
import { setNavigation } from '../../Models/Navigation/events';
import { $sidebar } from '../../Models/Sidebar';
import { $versionsList } from '../../Models/VersionSelector';
import { fetchVersionsFx } from '../../Models/VersionSelector/effects';
import { SearchParameters, TreeTypes } from '../../Shared/types';
import VerticalResizer from '../../UI/VerticalResizer';
const Widget = lazy(() => {
	return import('../../Containers/Widget');
});

import ButtonToggleFullscreen from '../../Containers/ButtonToggleFullscreen';
import { $activeForm } from '../../Models/ActiveForm';

import styles from './PageHome.module.css';

function PageMonitoring() {
	const { activeFormType, activeFormName, treeType, versionId } =
		useStore($navigation);
	const { isFullScreenModeEnabled } = useStore($activeForm);
	const sidebar = useStore($sidebar);
	const { versions } = useStore($versionsList);

	const [searchParams, setSearchParams] = useSearchParams();

	const title = useMemo(() => {
		return `${activeFormType} / ${activeFormName || ''}`;
	}, [activeFormType, activeFormName]);

	useEffect(() => {
		const versionId = searchParams.get(SearchParameters.VersionId);
		const activeVersionId: number = versionId
			? Number(versionId)
			: versions[0]?.code || 90;
		const treeType: TreeTypes =
			(searchParams.get(SearchParameters.TreeType) as TreeTypes) ??
			TreeTypes.Mnemoschemes;
		const paramFormId = searchParams.get(SearchParameters.FormId);
		const formId: number | undefined = paramFormId
			? Number(paramFormId)
			: undefined;
		const paramDeviceId = searchParams.get(SearchParameters.DeviceId);
		const deviceId: number | undefined = paramDeviceId
			? Number(paramDeviceId)
			: undefined;
		const paramChannelId = searchParams.get(SearchParameters.ChannelId);
		const channelId: number | undefined = paramChannelId
			? Number(paramChannelId)
			: undefined;
		const paramServerId = searchParams.get(SearchParameters.ServerId);
		const serverId: number | undefined = paramServerId
			? Number(paramServerId)
			: undefined;
		setNavigation({
			versionId: activeVersionId,
			channelId,
			serverId,
			deviceId,
			formId,
			treeType,
		});
		const newUrl: string = `/monitoring/?${searchParams.toString()}`;
		updateTabRoute(newUrl);
	}, [searchParams, versions]);

	useEffect(() => {
		fetchVersionsFx().then(({ versions, formId }) => {
			const newSearchParams = new URLSearchParams(searchParams);
			const versionId = searchParams.get(SearchParameters.VersionId);
			const activeVersionId = versionId ? Number(versionId) : null;
			if (!activeVersionId && versions[0].code) {
				newSearchParams.set(
					SearchParameters.VersionId,
					String(versions[0].code),
				);
			}
			if (formId) {
				newSearchParams.set(SearchParameters.FormId, String(formId));
			}
			setSearchParams(newSearchParams);
		});
	}, []);

	const renderTitleLeftFn = () => {
		return (
			<div className={styles.top_section}>
				<ButtonToggleSideBar className={styles.btn} />
				<h2 className={clsx('scheme_title', styles.title)}>{title}</h2>
			</div>
		);
	};

	return (
		<>
			<div
				className={clsx(
					'page',
					styles.root,
					isFullScreenModeEnabled && styles.fullscreen,
				)}
			>
				{!isFullScreenModeEnabled && <FormTabs />}
				<Panel
					className={styles.panel}
					title={' '}
					renderTitleLeft={renderTitleLeftFn}
					renderTitleAside={() => <ButtonToggleFullscreen />}
				>
					<div className={styles.wrapper}>
						<VerticalResizer
							firstElementMinWidth={320}
							secondElementMinWidth={1000}
							leftElementWidth={sidebar.isOpen ? 20 : 0}
						>
							<Sidebar
								type={treeType}
								className={sidebar.isOpen ? styles.sidebar : undefined}
								versionId={versionId}
							/>
							<Scheme />
						</VerticalResizer>
					</div>
				</Panel>
			</div>
			<Widget />
		</>
	);
}

export default PageMonitoring;
