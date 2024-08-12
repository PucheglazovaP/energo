import { ServersFavoritesSwitcher } from '../../../Models/DiagnosticCurrent/types';

import DiagnosticControlSwitcherDropdownRender from './DiagnosticControlSwitcherDropdownRender';

const TRANSLATIONS = {
	[ServersFavoritesSwitcher.Servers]: 'Сервер:',
	[ServersFavoritesSwitcher.Favorites]: 'Избранное',
};

export const switcherItems = Object.values(ServersFavoritesSwitcher).map(
	(value) => ({
		id: value,
		title: TRANSLATIONS[value],
		renderFn:
			value === ServersFavoritesSwitcher.Servers
				? DiagnosticControlSwitcherDropdownRender()
				: undefined,
	}),
);

export default {};
