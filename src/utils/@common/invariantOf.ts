declare const tag: unique symbol;

export type InvariantOf<T> = T & InvariantBrand<T>;

export interface InvariantBrand<T> {
  readonly [tag]: (args: T) => T;
}

export const invariantOf = <T>(args: T) => args as InvariantOf<T>;
