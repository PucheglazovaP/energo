import { useEffect } from 'react';
import { useStore } from 'effector-react';

import { fetchChannelsDiagnosticFx } from '../../../Models/ChannelDiagnostic/effects';
import Table from '../../../UI/Table';

import SupHeader from './partials/SupHeader';
import useChannelDiagnostic from './useChannelDiagnostic';

import styles from './ChannelDiagnostic.module.css';

function ChannelDiagnostic() {
	const { headers, channels } = useChannelDiagnostic();
	const isLoading = useStore(fetchChannelsDiagnosticFx.pending);

	useEffect(() => {
		fetchChannelsDiagnosticFx({ interval: 0 });
	}, []);

	return (
		<div className={styles.diagnostic}>
			<Table
				headers={headers}
				data={channels}
				isLoading={isLoading}
				renderSupHeaderFn={() => <SupHeader />}
			/>
		</div>
	);
}

export default ChannelDiagnostic;
