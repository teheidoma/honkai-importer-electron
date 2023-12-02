export interface TimeCell {
  type: TimeCellType;
  value: any;
}

export enum TimeCellType {
  EMPTY,
  DAY,
  LABEL
}
