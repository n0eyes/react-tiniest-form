import { useForm } from '@/hooks/Form/useForm';

import type { UseFormReturn } from '@/hooks/Form/useForm';
import type { FormFields } from '@/utils/formStore/createFormStore';

import { createContext, PropsWithChildren, useContext } from 'react';

interface FormProviderProps<DefaultValues extends FormFields> {
  value: UseFormReturn<DefaultValues>;
}

const createFormContext = <DefaultValues extends FormFields>() => {
  type FormContext = FormProviderProps<DefaultValues>['value'];

  const FormContext = createContext<FormContext | null>(null);

  const useFormContext = (): FormContext => {
    const method = useForm<DefaultValues>();

    const context = useContext(FormContext);

    if (!context) return method;

    return context;
  };

  const FormProvider = (props: PropsWithChildren<FormProviderProps<DefaultValues>>) => {
    const { children, value } = props;

    return <FormContext.Provider value={{ ...value }}>{children}</FormContext.Provider>;
  };

  return { FormProvider, useFormContext };
};

export default createFormContext;
