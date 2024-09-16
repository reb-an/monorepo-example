export type Params = Record<
  string,
  string | number | string[] | [string, string][] | object
>;

export interface BaseObject {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
