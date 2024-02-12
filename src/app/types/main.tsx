export type Point = {
  baris: number;
  kolom: number;
};
export type Tokens = {
  identifier: string;
  position: Point;
};
export type sequence = {
  tokens: Tokens[];
  length: number;
  prize: number;
};
export type matrix = {
  element: Tokens[][];
  row: number;
  col: number;
};
