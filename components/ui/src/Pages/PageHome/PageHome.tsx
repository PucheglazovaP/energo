import clsx from 'clsx';

import HomePageContainer from '../../Containers/HomePageContainer/HomePageContainer';
import { useOnHomePageMount } from '../../Hooks/HomePage/useOnHomePageMount';
import { checkSkipAuth } from '../../Shared/Utils/utils';

import styles from './PageHome.module.css';

function PageHome() {
	const user: string | undefined = useOnHomePageMount();

	return (
		<div className={clsx('page', styles.root)}>
			{(user || checkSkipAuth()) && <HomePageContainer />}
		</div>
	);
}

export default PageHome;
