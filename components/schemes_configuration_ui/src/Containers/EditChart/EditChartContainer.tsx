import { useEffect, useState } from 'react';

import VerticalResizer from '../../UI/VerticalResizer';
import ConfigurationBlock from '../ConfigurationBlock';

import EditChart from './EditChart';

function EditChartContainer() {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const handleResize = () => {
		setWindowWidth(window.innerWidth);
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);
	let leftElementWidth = 30;

	if (windowWidth > 1600) {
		leftElementWidth = 30;
	}

	if (windowWidth <= 1600) {
		leftElementWidth = 35;
	}

	return (
		<VerticalResizer
			firstElementMinWidth={420}
			secondElementMinWidth={1000}
			leftElementWidth={leftElementWidth}
		>
			<ConfigurationBlock />
			<EditChart />
		</VerticalResizer>
	);
}

export default EditChartContainer;
