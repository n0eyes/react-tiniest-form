import { BaseFunction } from '@/types/@common/utility';

const resolveFunctionOrPrimitive = <T>(
  functionOrPrimitive: T,
  ...payload: T extends BaseFunction ? Parameters<T> : never[]
): T extends BaseFunction ? ReturnType<T> : T =>
  typeof functionOrPrimitive === 'function' ? functionOrPrimitive(...payload) : functionOrPrimitive;

export { resolveFunctionOrPrimitive };
