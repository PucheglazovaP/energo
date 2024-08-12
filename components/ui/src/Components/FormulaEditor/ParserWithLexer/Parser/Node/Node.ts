import { Token } from '../Lexer/types';

import { NodeParam, NodeType } from './types';
import { isNodePropertyChange } from './utils';

export default class Node {
	#children: Node[] = [];
	#leafs: Token[] = [];
	#flow: NodeParam<'horizontal' | 'vertical'> = {
		value: 'horizontal',
		defaultValue: 'horizontal',
	};
	#fontSize: NodeParam<number> = { value: 1, defaultValue: 1 };
	#width: NodeParam<number> = { value: 0, defaultValue: 0 };
	#height: NodeParam<number> = { value: 0, defaultValue: 0 };
	#baseline: NodeParam<number> = { value: 0, defaultValue: 0 };
	#padding: NodeParam<[number, number, number, number]> = {
		value: [0, 0, 0, 0],
		defaultValue: [0, 0, 0, 0],
	};
	#type: NodeParam<NodeType> = {
		value: null,
		defaultValue: null,
	};
	value: string = '';

	get children(): Node[] {
		return this.#children;
	}

	set children(value: Node[]) {
		this.#children = value;
	}

	get leafs(): Token[] {
		return this.#leafs;
	}

	set leafs(value: Token[]) {
		this.#leafs = value;
	}

	get flow(): 'horizontal' | 'vertical' {
		return this.#flow.value;
	}

	set flow(value: 'horizontal' | 'vertical') {
		this.#flow = { ...this.#flow, value };
	}

	get fontSize(): number {
		return this.#fontSize.value;
	}

	set fontSize(value: number) {
		this.#fontSize = { ...this.#fontSize, value };
	}

	get width(): number {
		return this.#width.value;
	}

	set width(value: number) {
		this.#width = { ...this.#width, value };
	}

	get height(): number {
		return this.#height.value;
	}

	set height(value: number) {
		this.#height = { ...this.#height, value };
	}

	get baseline(): number {
		return this.#baseline.value;
	}

	set baseline(value: number) {
		this.#baseline = { ...this.#baseline, value };
	}

	get padding(): [number, number, number, number] {
		return this.#padding.value;
	}

	set padding(value: [number, number, number, number]) {
		this.#padding = { ...this.#padding, value };
	}

	get type(): NodeType {
		return this.#type.value;
	}

	set type(value: NodeType) {
		this.#type = { ...this.#type, value };
	}

	prependChild(child: Node): void {
		if (this.#leafs.length > 0) {
			throw new Error(
				'This node has leafs, add another node for parent and attach this child',
			);
		}
		this.#children.push(child);
	}

	appendChild(child: Node): void {
		if (this.#leafs.length > 0) {
			throw new Error(
				'This node has leafs, add another node for parent and attach this child',
			);
		}

		this.#children = [child, ...this.#children];
	}

	prependLeaf(leaf: Token): void {
		if (this.#children.length > 0) {
			throw new Error(
				'This node has children, add another node for parent and attach this leaf',
			);
		}
		this.#leafs.push(leaf);
	}

	toText(): string {
		if (this.#leafs.length > 0) {
			return this.#leafs.join(' ');
		}
		let expressionString: string = '';
		for (const childNode of this.#children) {
			expressionString += ` ${childNode.toText()}`;
		}
		return expressionString;
	}

	balanse(): void {
		if (this.#children.length === 1 && this.type !== 'case') {
			const [children] = this.#children;

			children.balanse();

			if (!isNodePropertyChange(this.#fontSize)) {
				this.fontSize = children.fontSize;
			}

			if (!isNodePropertyChange(this.#padding)) {
				this.padding = children.padding;
			}
			this.type = children.type;

			this.flow = children.flow;
			this.children = children.children;
			this.leafs = children.leafs;
		}

		for (const child of this.#children) {
			child.balanse();
		}
	}
}
