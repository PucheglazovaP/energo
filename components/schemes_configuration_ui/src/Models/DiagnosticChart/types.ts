export type DiagnosticChartModel = {
	shapes: Map<number, DiagnosticShape[]>;
	dates: [Date, Date];
};

export type AddShapeFnParams = {
	id: number;
	shape: DiagnosticShape[];
};

export type DiagnosticShape = {
	date: number;
	good: number;
	crc: number;
	timeout: number;
	timeoutICPCON: number;
	lost: number;
};
