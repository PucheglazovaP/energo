import { lazy } from 'react';
import { createHashRouter as createRouter, Navigate } from 'react-router-dom';

import { Path } from './Shared/types';
import App from './App';

const PageReportByLogBook = lazy(() => {
	return import('./Pages/PageReportByLogBook');
});
const PageReportByCorrectionLog = lazy(() => {
	return import('./Pages/PageReportByCorrectionLog');
});
const PageReportByConstantLog = lazy(() => {
	return import('./Pages/PageReportByConstantLog');
});
const PageNSI = lazy(() => {
	return import('./Pages/PageNSI');
});
const PageEmergencyEvents = lazy(() => {
	return import('./Pages/PageEmergencyEvents');
});
const PageMonitoring = lazy(() => {
	return import('./Pages/PageMonitoring');
});
const PageReportByDevices = lazy(() => {
	return import('./Pages/PageReportByDevices');
});
const PageDevicesStatus = lazy(() => {
	return import('./Pages/PageDevicesStatus');
});
const PageRetrofittingAccountingNodes = lazy(() => {
	return import('./Pages/PageRetrofittingAccountingNodes');
});
const PageStatisticalProcessing = lazy(() => {
	return import('./Pages/PageStatisticalProcessing');
});
const PageElectricPower = lazy(() => {
	return import('./Pages/PageElectricPower');
});
const PageNaturalGas = lazy(() => {
	return import('./Pages/PageNaturalGas');
});
const PageReportByPrintForms = lazy(() => {
	return import('./Pages/PageReportByPrintForms');
});

const PageReportByPoints = lazy(() => {
	return import('./Pages/PageReportByPoints');
});
const PageReportByPeriod = lazy(() => {
	return import('./Pages/PageReportByPeriod');
});
const PageReportByParameters = lazy(() => {
	return import('./Pages/PageReportByParameters');
});
const PageReportByInstrumentation = lazy(() => {
	return import('./Pages/PageReportByInstrumentation');
});
const PageReportByInputForms = lazy(() => {
	return import('./Pages/PageReportByInputForms');
});
const PageReferenceByReports = lazy(() => {
	return import('./Pages/PageReferenceByReports');
});
const PageReferenceByForms = lazy(() => {
	return import('./Pages/PageReferenceByForms');
});
const PageError = lazy(() => {
	return import('./Pages/PageError');
});
const LayoutReportsTechnical = lazy(() => {
	return import('./Containers/LayoutReportsTechnical');
});
const LayoutReports = lazy(() => {
	return import('./Containers/LayoutReports');
});

export default createRouter([
	{
		path: '/',
		errorElement: <PageError />,
		element: <App />,
		children: [
			{
				/* Чтобы с рута загрузился app,
				а далее произошел редирект на мониторинг */
				path: '',
				element: <Navigate to={Path.Monitoring} replace />,
			},
			{
				path: Path.Monitoring,
				element: <PageMonitoring />,
			},
			{
				path: Path.EmergencyEvents,
				element: <PageEmergencyEvents />,
			},
			{
				path: Path.NSI,
				element: <PageNSI />,
			},
			{
				path: Path.ReportByDevices,
				element: <PageReportByDevices />,
			},
			{
				path: Path.DevicesStatus,
				element: <PageDevicesStatus />,
			},
			{
				path: Path.RetrofittingAccountingNodes,
				element: <PageRetrofittingAccountingNodes />,
			},
			{
				element: <LayoutReports />,
				children: [
					{
						path: Path.ReportByPoints,
						element: <PageReportByPoints />,
					},
					{
						path: Path.ReportByParameters,
						element: <PageReportByParameters />,
					},
					{
						path: Path.ReferenceByReports,
						element: <PageReferenceByReports />,
					},
					{
						path: Path.ReferenceByForms,
						element: <PageReferenceByForms />,
					},
				],
			},
			{
				element: <LayoutReportsTechnical />,
				children: [
					{
						path: Path.ReportByInstrumentation,
						element: <PageReportByInstrumentation />,
					},
					{
						path: Path.ReportByInputForms,
						element: <PageReportByInputForms />,
					},
					{
						path: Path.ReportByLogBook,
						element: <PageReportByLogBook />,
					},
					{
						path: Path.ReportByCorrectionLog,
						element: <PageReportByCorrectionLog />,
					},
					{
						path: Path.ReportByConstantLog,
						element: <PageReportByConstantLog />,
					},
					{
						path: Path.ReportByPeriod,
						element: <PageReportByPeriod />,
					},
					{
						path: Path.ReportByPrintForms,
						element: <PageReportByPrintForms />,
					},
					{
						path: Path.StatisticalProcessing,
						element: <PageStatisticalProcessing />,
					},
					{
						path: Path.ElectricPower,
						element: <PageElectricPower />,
					},
					{
						path: Path.NaturalGas,
						element: <PageNaturalGas />,
					},
				],
			},
		],
	},
]);
