import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { EvrazLogo, TitleBar } from '@evraz/ui-kit';

import CustomContextMenu from '../Components/CustomContextMenu/CustomContextMenu';
import Header from '../Containers/Header';
import UserInfo from '../Containers/UserInfo';
import { useAppSelector } from '../Hooks/Store/useAppSelector';
import { selectCurrentServer } from '../Store/reducers/ConfiguratorSlice/configuratorSelectors';

import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.css';

function renderEvrazLogo() {
	return <EvrazLogo key="evraz-logo" className={styles.logo} />;
}

function renderAsideComponent() {
	return (
		<div key="aside" className={styles.aside}>
			<UserInfo />
		</div>
	);
}

function App() {
	const position = useAppSelector((state) => state.contextMenuReducer.position);
	const isContextMenuActive = useMemo(
		() => position.some((coordinate) => !(coordinate && coordinate === -1000)),
		[position],
	);
	const currentServer = useAppSelector(selectCurrentServer);

	return (
		<div className={styles.root}>
			<ToastContainer autoClose={5000} position="top-right" pauseOnHover />
			{isContextMenuActive && currentServer && <CustomContextMenu />}
			<TitleBar
				className={styles.title_bar}
				renderLogoComponent={renderEvrazLogo}
				renderAsideComponent={renderAsideComponent}
			>
				<Header />
			</TitleBar>
			<Outlet />
		</div>
	);
}

export default App;
