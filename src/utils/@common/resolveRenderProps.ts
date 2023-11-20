import type { ReactNode } from 'react';
import type { RenderProps } from '@/types/@common/utility';

import { resolveFunctionOrPrimitive } from './resolveFunctionOrPrimitive';

const resolveRenderProps = <P extends object>(
  renderProps: ReactNode | RenderProps<P>,
  payload: P,
) => resolveFunctionOrPrimitive(renderProps, payload);

export { resolveRenderProps };
