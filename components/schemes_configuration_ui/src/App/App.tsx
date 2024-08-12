import { Fragment, memo, Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { EvrazLogo, TitleBar } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import ButtonEmergencyConfirmation from '../Containers/ButtonEmergencyConfirmation';
import Header from '../Containers/Header';
import ModalSystem from '../Containers/ModalSystem';
import UserInfo from '../Containers/UserInfo';
import { $activeForm } from '../Models/ActiveForm';
import { setFullScreenMode } from '../Models/ActiveForm/events';
import { getAuthentication } from '../Models/Auth/events';
import Spinner from '../UI/Spinner';
import { history } from '../Utils/history';

import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.css';

function renderEvrazLogo() {
	return (
		<Fragment key="sidebar-control-with-logo">
			<EvrazLogo />
		</Fragment>
	);
}

function renderAsideComponent() {
	return (
		<div key="aside" className={styles.aside}>
			<Header key={'header'} />
			<div className={styles.right_side_content}>
				<ButtonEmergencyConfirmation />
				<UserInfo />
			</div>
		</div>
	);
}

function App() {
	history.location = useLocation();
	history.navigate = useNavigate();
	const { isFullScreenModeEnabled } = useStore($activeForm);

	const handleFullscreen = () => {
		if (
			window.matchMedia('(display-mode: fullscreen)').matches ||
			window.document.fullscreenElement
		) {
			setFullScreenMode(true);
		} else {
			setFullScreenMode(false);
		}
	};

	useEffect(() => {
		window.addEventListener('resize', handleFullscreen);

		return () => {
			window.removeEventListener('resize', handleFullscreen);
		};
	}, []);

	/* 	useEffect(() => {
		// проверка включен ли полноэкранный режим
		if (outerHeight - innerHeight <= 1) setFullScreenMode(true);
	}, []); */

	useEffect(() => {
		getAuthentication();
	}, []);

	return (
		<div className={styles.root}>
			<ToastContainer autoClose={2000} position="top-right" pauseOnHover />
			{!isFullScreenModeEnabled && (
				<TitleBar
					renderLogoComponent={renderEvrazLogo}
					className={styles.title_bar}
					renderAsideComponent={renderAsideComponent}
				/>
			)}
			<Suspense fallback={<Spinner className={styles.spinner} />}>
				<Outlet />
			</Suspense>
			<ModalSystem />
		</div>
	);
}

export default memo(App);
