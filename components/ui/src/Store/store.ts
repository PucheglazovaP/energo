import { createDriver } from '@redux-requests/axios';
import { handleRequests } from '@redux-requests/core';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import createSagaMiddleware from 'redux-saga';

import { initKeycloak } from '../Packages/KeycloakInstance';
import keycloak from '../Packages/KeycloakInstance/keycloakInstance';
import { checkSkipAuth, createAPIHost } from '../Shared/Utils/utils';
import createWSConnection from '../WebSocket';

import analyticGroupsReducer from './reducers/AnalyticGroupsSlice/AnalyticGroupsSlice';
import appReducer from './reducers/AppSlice/AppSlice';
import { getUserInfo } from './reducers/AuthSlice/authActions';
import authReducer from './reducers/AuthSlice/AuthSlice';
import configuratorReducer from './reducers/ConfiguratorSlice/configuratorSlice';
import contextMenuReducer from './reducers/ContextMenuSlice/contextMenuSlice';
import dataLocation from './reducers/DataLocationSlice/DatalocationSlice';
import duplicatesReducer from './reducers/DuplicatesSlice/DuplicatesSlice';
import filtersReducer from './reducers/FiltersSlice/filtersSlice';
import formulaEditorReducer from './reducers/FormulaEditorSlice/FormulaEditorSlice';
import groupInformationReducer from './reducers/GroupInformationSlice/GroupInformationSlice';
import historyReducer from './reducers/HistorySlice/HistorySlice';
import parameterReducer from './reducers/ParametersSlice/parametersSlice';
import preferenceReducer from './reducers/PreferenceSlice/preferenceSlice';
import sortReducer from './reducers/SortSlice/SortSlice';
import submitOperationReducer from './reducers/SubmitOperationSlice/SubmitOperationSlice';
import userGroupsReducer from './reducers/UserGroupsSlice/UserGroupsSlice';
import vacantEntitiesReducer from './reducers/VacantEntitySlice/VacantEntitiesSlice';

const AUTHORIZATION_HEADER = 'Authorization';
const sagaMiddleware = createSagaMiddleware();

const axiosInstance = axios.create({
	baseURL: createAPIHost(),
	withCredentials: true,
});

// @ts-ignore
axiosInstance.interceptors.request.use((config) => {
	return {
		...config,
		headers: {
			...config.headers,
			[AUTHORIZATION_HEADER]: `Bearer ${keycloak.token}`,
		},
	};
});

const { requestsReducer, requestsMiddleware } = handleRequests({
	driver: createDriver(axiosInstance),
});

const rootReducer = combineReducers({
	configuratorReducer,
	appReducer,
	authReducer,
	parameterReducer,
	contextMenuReducer,
	preferenceReducer,
	filtersReducer,
	historyReducer,
	analyticGroupsReducer,
	groupInformationReducer,
	vacantEntitiesReducer,
	dataLocation,
	duplicatesReducer,
	sortReducer,
	formulaEditorReducer,
	submitOperationReducer,
	userGroupsReducer,
	request: requestsReducer,
});

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			// TODO: remove this rule
			serializableCheck: false,
		})
			.concat(sagaMiddleware)
			.concat(...requestsMiddleware),
});

(async function initAuth() {
	if (!checkSkipAuth()) {
		await initKeycloak();
		await getUserInfo(store.dispatch);
	}
})();

export const { rxStomp, rxStompRPC } = createWSConnection();
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const storeDispatch = store.dispatch; //todo remove
