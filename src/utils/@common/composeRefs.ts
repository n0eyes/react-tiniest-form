import { MutableRefObject, Ref } from 'react';

type PossibleRef<T> = Ref<T> | undefined;

const setRef = <T>(ref: PossibleRef<T>, instance: T) => {
  if (typeof ref === 'function') {
    ref(instance);
  } else if (ref !== null && ref !== undefined) {
    (ref as MutableRefObject<T>).current = instance;
  }
};

const composeRefs =
  <T>(...refs: PossibleRef<T>[]) =>
  (instance: T) =>
    refs.forEach(ref => setRef(ref, instance));

export { composeRefs };
