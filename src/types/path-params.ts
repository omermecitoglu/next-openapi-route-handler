export type FixPathParams<T> = {
  [K in keyof T]: string;
};
