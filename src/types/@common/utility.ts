import { ReactNode } from 'react';

type ValueOf<T extends object> = T[keyof T];

type BaseFunction = (...args: never[]) => unknown;

type RenderProps<P extends object = object> = (payload: P) => ReactNode;

type PropsWithRenderProps<P extends object, R extends object = object> = Omit<P, 'children'> & {
  children?: ReactNode | RenderProps<R>;
};

export type { ValueOf, BaseFunction, PropsWithRenderProps, RenderProps };
