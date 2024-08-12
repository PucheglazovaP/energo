import { ChartDataResponse } from '../Models/ActiveChart/types';
import {
	DynamicObjectValueResponse,
	FormObjectDataResponse,
	FormObjectLayerIdResponse,
	FormObjectsGroupInfoResponse,
	FormObjectsResponse,
	FormParametersResponse,
} from '../Models/ActiveForm/types';
import { BackendResponse, chartParameters, Trend } from '../Shared/types';
import {
	DynamicObjectConfiguration,
	StatusIndicatorConfiguration,
	TransparentConfiguration,
} from '../Shared/Types/formObject';
import { convertColor } from '../Utils/convertColor';

export function formParametersAdapter(result: string) {
	const data: FormParametersResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	const titleInfo = data.find((item) => item.НазваниеПараметра === 'title');
	const trendMode = data.find(
		(item) => item.НазваниеПараметра === 'trend_mode',
	);
	const delayInfo = data.find(
		(item) => item.НазваниеПараметра === 'visdelayform',
	);
	return {
		isTitleVisible: Boolean(Number(titleInfo?.ЗначениеПараметра || '1')),
		visdelayForm: delayInfo?.ЗначениеПараметра
			? Number(delayInfo.ЗначениеПараметра)
			: 0,
		trendMode: trendMode?.ЗначениеПараметра || '-1',
	};
}
export function getObjectsParameters(data: FormObjectsResponse[]) {
	const formObjects = new Map();
	data.forEach((item) => {
		const formObject = formObjects.get(item.КодОбъектаФормы);
		if (formObject) {
			formObjects.set(item.КодОбъектаФормы, {
				...formObject,
				[item.НазваниеПараметра]: item.ЗначениеПараметра,
			});
		} else {
			//если объекта формы в списке нет, то записываем всю информацию из объекта(параметры объекта дублируются в массиве, кроме НазваниеПараметра и ЗначениеПараметра)
			formObjects.set(item.КодОбъектаФормы, {
				transparentGroup: item.ГруппаТранспаранта,
				controlledParameterCode: item.КодКонтролируемогоПараметра,
				criterionCode: item.КодКритерия,
				objectType: item.ТипОбъектаФормы,
				orderNumber: item.НомерОбъектаПоПорядку,
				id: item.КодОбъектаФормы,
				[item.НазваниеПараметра]: item.ЗначениеПараметра,
			});
		}
	});
	return Array.from(formObjects.values());
}
export function formObjectValueAdapter(result: string) {
	const { Response }: BackendResponse = JSON.parse(result);
	const data = Response.Tables[0].Rows as FormObjectDataResponse[];
	if (data.length > 0)
		return {
			objectValue: data[0].dan == undefined ? data[0].val : data[0].dan,
			nulls: data[0].nulls,
			canerr: data[0].canerr,
			/* 			objectType: data[0].obj_name, */
		};
	return {
		objectValue: null,
		nulls: 0,
		canerr: '',
	};
}
export function formObjectsValueByLayersAdapter(result: string) {
	const { Response }: BackendResponse = JSON.parse(result);
	const data = Response.Tables[0].Rows as FormObjectDataResponse[];
	if (data.length > 0)
		return data.map((item) => ({
			objectValue: item.dan == undefined ? item.val : item.dan,
			nulls: item.nulls,
			canerr: item.canerr,
			/* 			objectType: data[0].obj_name, */
			groupNumber: item.grNumber,
			// Данные для Индикатора
			d1Value: item.ind_d1,
			d2Value: item.ind_d2,
			d3Value: item.ind_d3,
			dg1Value: item.ind_dg1,
			dg2Value: item.ind_dg2,
			statusCode: item.ind_stat,
			objectId: item.obj_id,
		}));
	return [
		{
			objectValue: null,
			nulls: 0,
			canerr: '',
			d1Value: null,
			d2Value: null,
			d3Value: null,
			dg1Value: null,
			dg2Value: null,
			statusCode: null,
			objectId: 0,
		},
	];
}
export function formDynamicObjectValuesAdapter(result: string) {
	const data: DynamicObjectValueResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	return data.map((item) => ({
		fileNumber: item.НомерЗначенияПоПорядку,
		fileName: item.Значение,
		comment: item.Комментарий,
		url: '',
		objectId: item.КодОбъекта,
	}));
}
export function formObjectsFormatter(result: string) {
	const { Response }: BackendResponse = JSON.parse(result);
	const data = Response.Tables[0].Rows as FormObjectsResponse[];
	const groupInfo =
		(Response.Tables[1].Rows as FormObjectsGroupInfoResponse[]) || [];
	const serializedData = getObjectsParameters(data);
	const formTransparentObjects: TransparentConfiguration[] = [];
	const formDynamicObjects: DynamicObjectConfiguration[] = [];
	const statusIndicators: StatusIndicatorConfiguration[] = [];
	serializedData.forEach((item) => {
		let channelsInfo = {};
		const infoAboutObject = groupInfo.find(
			(info) => info.КодОбъектаФормы === item.id,
		);
		if (infoAboutObject)
			channelsInfo = {
				unitName: infoAboutObject.ЕдиницаИзмерения,
				channelsList: infoAboutObject.КаналыГруппы,
			};
		if (item.objectType === 'Транспарант')
			formTransparentObjects.push({
				transparentGroup: item.transparentGroup,
				metricId: Number(item.metric_id),
				metricName: item.metric_name,
				showAlerts: Boolean(Number(item.show_alerts)),
				controlledParameterCode: item.controlledParameterCode,
				criterionCode: item.criterionCode,
				objectType: item.objectType,
				orderNumber: item.orderNumber,
				id: item.id,
				text: item.key,
				goton: item.goton,
				color: item.color ? convertColor(item.color) : '',
				bkg: item.bkg ? convertColor(item.bkg) : '',
				border: Number(item.border),
				fontSize: Number(item.fontsize),
				x: Number(item.x),
				y: Number(item.y),
				length: Number(item.length),
				height: Number(item.height),
				csql: Boolean(Number(item.csql)),
				csqlUser: Number(item.csqluser),
				groupId:
					Number(item.csqlgroup) !== 9999 ? Number(item.csqlgroup) : null,
				useCapt: Boolean(Number(item.usecapt)),
				csqlType: Number(item.csqltype),
				dataMax: Number(item.datamax),
				dataMin: Number(item.datamin),
				short: Boolean(Number(item.short)),
				visdelay: Number(item.visdelay),
				mult: Number(item.mult),
				firstinc: Boolean(Number(item.firstinc)),
				notcapt: Boolean(Number(item.notcapt)),
				round: Number(item.round),
				checkboxMultiline: Boolean(Number(item.checkbox_multiline)),
				gotonCode:
					Number(item.gotoncode) === -1 || Number(item.gotoncode) === 0
						? null
						: Number(item.gotoncode),
				groupName: item.csqlgroupname,
				csqlUserName: item.csqlusername,
				csqlTypeName: item.csqltypename,
				dataType: item.datatype,
				loadlistch: Boolean(Number(item.loadlistch)),
				loadpargr: Boolean(Number(item.loadpargr)),
				zeroHighLights: Boolean(Number(item.ZeroHighLights)),
				showDataType: Number(item.showdatatype),
				value: null,
				cornerAngle: Number(item.cornerAngle),
				textColor: item.textcolor ? convertColor(String(item.textcolor)) : '',
				alignH: item.alignH,
				alignV: item.alignV,
				isSelected: false,
				parameterCode: 0,
				nulls: 0,
				canerr: '',
				showUnit: Boolean(Number(item.show_unit)),
				...channelsInfo,
				layerId: 1,
				isLinkEnabled: Boolean(Number(item.linkOnOff)),
				link: item.link != null ? String(item.link) : '',
			});
		if (item.objectType === 'Индикатор')
			statusIndicators.push({
				objectType: item.objectType,
				x: Number(item.x),
				y: Number(item.y),
				degree: Number(item.ind_vid),
				orderNumber: item.orderNumber,
				id: item.id,
				length: Number(item.length),
				height: Number(item.height),
				layerId: 1,
				nameObject: item.nameobject,
				normalIndicatorColor: item.ind_color1
					? convertColor(item.ind_color1)
					: '',
				emergencyIndicatorColor: item.ind_color2
					? convertColor(item.ind_color2)
					: '',
				warningIndicatorColor: item.ind_color3
					? convertColor(item.ind_color3)
					: '',
				turnedOffIndicatorColor: item.ind_color4
					? convertColor(item.ind_color4)
					: '',
				errorIndicatorColor: item.ind_color5
					? convertColor(item.ind_color5)
					: '',
				normalIndicatorComment: item.ind_comment1,
				emergencyIndicatorComment: item.ind_comment2,
				warningIndicatorComment: item.ind_comment3,
				turnedOffIndicatorComment: item.ind_comment4,
				errorIndicatorComment: item.ind_comment5,
				d1GroupNumber:
					item.ind_d1 == null || Number(item.ind_d1) === 0
						? null
						: Number(item.ind_d1),
				d2GroupNumber:
					item.ind_d2 == null || Number(item.ind_d2) === 0
						? null
						: Number(item.ind_d2),
				d3GroupNumber:
					item.ind_d3 == null || Number(item.ind_d3) === 0
						? null
						: Number(item.ind_d3),
				dg1GroupNumber:
					item.ind_dg1 == null || Number(item.ind_dg1) === 0
						? null
						: Number(item.ind_dg1),
				dg2GroupNumber:
					item.ind_dg2 == null || Number(item.ind_dg2) === 0
						? null
						: Number(item.ind_dg2),
				d1Value: null,
				d2Value: null,
				d3Value: null,
				dg1Value: null,
				dg2Value: null,
				statusCode: null,
				header1: item.ind_header1,
				header2: item.ind_header2,
				scaleBar: Number(item.ind_scalebar),
				isScaleBarEnabled: Boolean(Number(item.ind_show_scalebar)),
				isD1ValueVisible: Boolean(Number(item.ind_show_d1)),
				isD2ValueVisible: Boolean(Number(item.ind_show_d2)),
				isD3ValueVisible: Boolean(Number(item.ind_show_d3)),
				isHeader1Visible: Boolean(Number(item.ind_show_header1)),
				isHeader2Visible: Boolean(Number(item.ind_show_header2)),
				statusGroupNumber:
					item.ind_stat == null || Number(item.ind_stat) === 0
						? null
						: Number(item.ind_stat),
			});
		if (item.objectType === 'Динамический объект')
			formDynamicObjects.push({
				transparentGroup: item.transparentGroup,
				controlledParameterCode: item.controlledParameterCode,
				criterionCode: item.criterionCode,
				objectType: item.objectType,
				orderNumber: item.orderNumber,
				id: item.id,
				gotonCode:
					Number(item.gotoncode) === -1 ? null : Number(item.gotoncode),
				height: Number(item.height),
				visdelay: Number(item.visdelay),
				linkFormName: item.goton,
				dataType: item.datatype,
				width: Number(item.width),
				x: Number(item.left),
				y: Number(item.top),
				groupId: Number(item.groupnumber),
				groupName: item.groupname,
				selectedFileNumber: Number(item.selectednumberfile),
				nameObject: item.nameobject,
				transparent: Number(item.transparent),
				cursor: Number(item.cursor),
				images: [],
				selectedImageNumberFromGroup: null,
				goton: item.goton,
				parameterCode: 0,
				...channelsInfo,
				metricId: 0,
				layerId: 1,
				isLinkEnabled: Boolean(Number(item.linkOnOff)),
				link: item.link != null ? String(item.link) : '',
			});
	});

	return { formTransparentObjects, formDynamicObjects, statusIndicators };
}

export function seriesAdapter(result: string): Trend[] {
	const data: FormObjectsResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	if (data.length > 0 && data[0].КодОбъектаФормы != null) {
		const serializedData = getObjectsParameters(data);
		return serializedData.map((item) => ({
			name: item.seriesname,
			data: [],
			width: item.serieswidth,
			visible: Boolean(Number(item.seriesvisible)),
			color: item.seriescolor ? convertColor(item.seriescolor) : '',
			asqlGroup: item.asqlgroup,
			id: item.id,
			unitName: '',
			round: item.round || 10,
			typeGraph: item.typegraph != null ? Number(item.typegraph) : 0,
			multipleCount:
				item.multiplecount != null ? Number(item.multiplecount) : 0,
			isVisibleOnChart: true,
		}));
	}
	return [];
}

export function chartParametersAdapter(result: string) {
	const data: FormParametersResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	const parameters = data.reduce<any>(
		(prev, current) => {
			prev[
				chartParameters[
					current.НазваниеПараметра as keyof typeof chartParameters
				]
			] = current.ЗначениеПараметра;
			return prev;
		},
		{
			isTitleVisible: false,
			asqlUser: 0,
			asqlGroup: 9999,
			asqlType: 9999,
			useCapt: false,
			hlineVisible: false,
			hlineValue: 0,
			hlineColor: '#000000',
			hlineWidth: 0,
			hlineVisible1: false,
			hlineValue1: 0,
			hlineColor1: '#000000',
			hlineWidth1: 0,
			hlineVisible2: false,
			hlineValue2: 0,
			hlineColor2: '#000000',
			hlineWidth2: 0,
			asqlGroupName: null,
			asqlUserName: null,
			asqlTypeName: null,
			trendMode: '-1',
			backgroundFileName: '',
			round: 10,
			typeGraph: 0,
			showOverperiodData: false,
			multiplecount: false,
		},
	);
	return {
		isTitleVisible: Boolean(Number(parameters.isTitleVisible)),
		asqlUser: Number(parameters.asqlUser),
		asqlGroup: Number(parameters.asqlGroup),
		asqlType: Number(parameters.asqlType),
		useCapt: Boolean(Number(parameters.useCapt)),
		hlineVisible: Boolean(Number(parameters.hlineVisible)),
		hlineValue: Number(parameters.hlineValue),
		hlineColor: parameters.hlineColor,
		hlineWidth: Number(parameters.hlineWidth),
		hlineVisible1: Boolean(Number(parameters.hlineVisible1)),
		hlineValue1: Number(parameters.hlineValue1),
		hlineColor1: parameters.hlineColor1,
		hlineWidth1: Number(parameters.hlineWidth1),
		hlineVisible2: Boolean(Number(parameters.hlineVisible2)),
		hlineValue2: Number(parameters.hlineValue2),
		hlineColor2: parameters.hlineColor2,
		hlineWidth2: Number(parameters.hlineWidth2),
		asqlGroupName: parameters.asqlGroupName,
		asqlUserName: parameters.asqlUserName,
		asqlTypeName: parameters.asqlUserName,
		trendMode: parameters.trendMode,
		round: Number(parameters.round),
		showOverperiodData: Boolean(Number(parameters.showOverperiodData)),
		typeGraph: Number(parameters.typeGraph),
		multipleCount: Boolean(Number(parameters.multipleCount)),
	};
}

export function chartDataAdapter(result: string) {
	const data: ChartDataResponse[] = JSON.parse(result).Response.Tables[0].Rows;
	return data.map((item) => {
		return {
			date: item.dat,
			value: item.dan,
		};
	});
}
export function formObjectLayerIdAdapter(result: string) {
	const { Response }: BackendResponse = JSON.parse(result);
	const data = Response.Tables[0].Rows as FormObjectLayerIdResponse[];
	return data.map((item) => ({
		objectId: item.КодОбъекта || item.КодТранспаранта,
		layerId: item.КодСлояФормы,
	}));
}
export default {};
