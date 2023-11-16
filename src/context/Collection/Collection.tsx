import {
  PropsWithChildren,
  RefCallback,
  RefObject,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { composeRefs } from '@/utils/@common/composeRefs';

const ITEM_ATTR = 'item_attr';

const createCollection = () => {
  type CollectionContext = {
    collectionRef: RefObject<HTMLElement>;
    itemMap: Map<RefObject<HTMLElement>, { ref: RefObject<HTMLElement> }>;
  };

  const defaultValue = {
    collectionRef: { current: null },
    itemMap: new Map(),
    getItems: (): Element[] => [],
  };

  const CollectionContext = createContext<CollectionContext | null>(null);

  const CollectionProvider = ({ children }: PropsWithChildren) => {
    const collectionRef = useRef<HTMLElement>(null);
    const itemMap = useRef<CollectionContext['itemMap']>(new Map()).current;

    if (!isValidElement<{ ref: RefCallback<HTMLElement> }>(children)) return null;

    return (
      <CollectionContext.Provider value={{ collectionRef, itemMap }}>
        {cloneElement(children, { ref: composeRefs(collectionRef, children.props.ref) })}
      </CollectionContext.Provider>
    );
  };

  const CollectionItem = ({ children }: PropsWithChildren) => {
    const ref = useRef<HTMLElement>(null);
    const { itemMap } = useCollection();

    useEffect(() => {
      itemMap.set(ref, { ref });

      return () => {
        itemMap.delete(ref);
      };
    });

    if (!isValidElement<{ ref: RefCallback<HTMLElement>; [ITEM_ATTR]: string }>(children))
      return null;

    return cloneElement(children, {
      ref: composeRefs(ref, (children as any).ref),
      [ITEM_ATTR]: '',
    });
  };

  const useCollection = () => {
    const context = useContext(CollectionContext);

    if (!context) return defaultValue;

    const getItems = useCallback(() => {
      const collectionNode = context.collectionRef.current;

      if (!collectionNode) return [];

      return Array.from(collectionNode.querySelectorAll(`[${ITEM_ATTR}]`));
    }, [context.collectionRef, context.itemMap]);

    return { ...context, getItems };
  };

  return { CollectionProvider, CollectionItem, useCollection };
};

export default createCollection;
