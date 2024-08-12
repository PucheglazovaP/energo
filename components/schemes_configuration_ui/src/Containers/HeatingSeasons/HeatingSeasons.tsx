import React from 'react';

import Spinner from '../../UI/Spinner';

import { HeatingSeasonsBody } from './HeatingSeasonsBody';
import { HeatingSeasonsHeader } from './HeatingSeasonsHeader';
import { useHeatingSeasons } from './useHeatingSeasons';

import styles from './HeatingSeasons.module.css';

function HeatingSeasons() {
	const {
		heatingSeasonsTableHeader,
		heatingSeasonsTableBody,
		onHeatingSeasonAdd,
		onGetHeatingSeasons,
		isLoading,
	} = useHeatingSeasons();

	return (
		<>
			<div className={styles.heating_seasons_container}>
				<HeatingSeasonsHeader onGetHeatingSeasons={onGetHeatingSeasons} />
				{!isLoading ? (
					<HeatingSeasonsBody
						tableBody={heatingSeasonsTableBody}
						tableHeader={heatingSeasonsTableHeader}
						onHeatingSeasonAdd={onHeatingSeasonAdd}
					/>
				) : (
					<Spinner className={styles.spinner} />
				)}
			</div>
		</>
	);
}
export default HeatingSeasons;
