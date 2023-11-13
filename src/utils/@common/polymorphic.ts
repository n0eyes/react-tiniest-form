import { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react';

type PropsWithTag<T extends ElementType, P> = P & {
  as?: T;
};

type ComponentPropsWithoutRefAndDuplicate<T extends ElementType, P = {}> = Omit<
  ComponentPropsWithoutRef<T>,
  keyof P
>;

type PropsWithComponentPropsWithoutRef<T extends ElementType, P = {}> = PropsWithChildren<
  PropsWithTag<T, P>
> &
  ComponentPropsWithoutRefAndDuplicate<T, P>;

type PolymorphicProps<T extends ElementType, P = {}> = PropsWithTag<
  T,
  PropsWithComponentPropsWithoutRef<T, P>
>;

const getPolymorphicProps = <T extends ElementType, P = {}>(
  defaultElement: ElementType,
  props: PolymorphicProps<T, P>,
) => {
  const { as = defaultElement, ...restProps } = props;

  const Element = as;

  return { Element, ...restProps };
};

export { getPolymorphicProps };

export type { PolymorphicProps, PropsWithComponentPropsWithoutRef };
