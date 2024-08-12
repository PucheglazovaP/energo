import { Token } from "../Lexer/types";

export type NodeIteratorResult = {
  done: boolean;
  value?: Token[];
};

export type NodeParam<T> = {
  value: T;
  defaultValue: T;
};

export type NodeType = "case" | "fraction" | "sqrt" | null;
