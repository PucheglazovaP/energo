declare module '*.svg' {
	import React = require('react');
	export const ReactComponent: React.FunctionComponent<
		React.SVGProps<SVGSVGElement>
	>;
	const src: string;
	export default src;
}

declare module '*.module.css' {
	const content: Record<string, string>;
	export default content;
}
declare module '*.scss' {
	const content: Record<string, string>;
	export default content;
}
