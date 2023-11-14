import { useErrorFieldsSets } from '@/hooks/Form/useErrorFieldSets';
import { useForm } from '@/hooks/Form/useForm';

import type { UseFormReturn } from '@/hooks/Form/useForm';
import type { FormFields } from '@/utils/formStore/createFormStore';
import type { UseErrorFieldSets } from '@/hooks/Form/useErrorFieldSets';

import { createContext, PropsWithChildren, useContext } from 'react';

interface FormProviderProps<DefaultValues extends FormFields> {
  value: UseFormReturn<DefaultValues> & UseErrorFieldSets;
}

const createFormContext = <DefaultValues extends FormFields>() => {
  type FormContext = FormProviderProps<DefaultValues>['value'];

  const FormContext = createContext<FormContext | null>(null);

  const useFormContext = (): FormContext => {
    const method = useForm<DefaultValues>();
    const handleErrorFieldSets = useErrorFieldsSets();

    const context = useContext(FormContext);

    if (!context) return { ...method, ...handleErrorFieldSets };

    return context;
  };

  const FormProvider = (props: PropsWithChildren<FormProviderProps<DefaultValues>>) => {
    const { children, value } = props;

    return <FormContext.Provider value={{ ...value }}>{children}</FormContext.Provider>;
  };

  return { FormProvider, useFormContext };
};

export default createFormContext;
