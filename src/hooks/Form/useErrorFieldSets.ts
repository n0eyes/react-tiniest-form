import { useState } from 'react';

type UseErrorFieldSets = ReturnType<typeof useErrorFieldsSets>;

const useErrorFieldsSets = () => {
  const [errorFieldSets, setErrorFieldSets] = useState<Set<string>>(new Set());

  const addErrorFieldSet = (name: string) =>
    setErrorFieldSets(errorFieldSets => new Set(errorFieldSets).add(name));

  const deleteErrorFieldSet = (name: string) =>
    setErrorFieldSets(errorFieldSets => {
      errorFieldSets.delete(name);

      return new Set(errorFieldSets);
    });

  return { errorFieldSets, addErrorFieldSet, deleteErrorFieldSet };
};

export { useErrorFieldsSets };

export type { UseErrorFieldSets };
