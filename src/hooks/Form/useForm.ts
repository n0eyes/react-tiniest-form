import { ChangeEvent, FormEvent, RefCallback, useRef, useState } from 'react';
import { createFormsStore, parseToInputValue } from '@/utils/formStore/createFormStore';

import { invariantOf } from '@/utils/@common/invariantOf';
import { ValueOf } from '@/utils/@common/utility';

import type {
  FieldName,
  FormFields,
  Store,
  Validation,
  InputValue,
  Errors,
} from '@/utils/formStore/createFormStore';

interface UseFormOptions<DefaultValues extends FormFields> {
  defaultValues?: DefaultValues;
}

type UseFormReturn<DefaultValues extends FormFields = FormFields> = ReturnType<
  typeof useForm<DefaultValues>
>;

const useFormStore = <DefaultValues extends FormFields = FormFields>(
  options?: UseFormOptions<DefaultValues>,
) => {
  type FormStore = Store<DefaultValues>;
  type FormErrors = Errors<DefaultValues>;
  type Name = FieldName<DefaultValues>;

  const formStore = useRef(createFormsStore<DefaultValues>(options?.defaultValues)).current;

  const [snapshot, setSnapshot] = useState<FormStore>(formStore.store);

  const [errors, setErrors] = useState<FormErrors>({} as FormErrors);

  const setError = (name: Name, info?: ValueOf<FormErrors>) => {
    setErrors(errors => ({
      ...errors,
      [name]: {
        ...errors[name],
        ...info,
      },
    }));
  };

  const deleteError = (name: Name) => {
    if (errors[name]) {
      setErrors(errors => {
        const clonedErrors = structuredClone(errors);

        delete clonedErrors[name];

        return clonedErrors;
      });
    }
  };

  const takeSnapShot = (name: Name, value: unknown) => {
    setSnapshot(prev => ({ ...prev, [name]: { ...prev[name], value } }));
  };

  return {
    store: formStore,
    snapshot,
    errors,
    setError,
    takeSnapShot,
    deleteError,
  };
};

const useForm = <DefaultValues extends FormFields>(options?: UseFormOptions<DefaultValues>) => {
  type Name = FieldName<DefaultValues>;
  type SubmitValue = { [Name in FieldName<DefaultValues>]: string };
  type FormErrors = Errors<DefaultValues>;

  const {
    store: {
      store,
      registerField,
      getFieldValue,
      updateFieldValue,
      watchField,
      isWatching,
      validateField,
      getFieldInfo,
    },
    errors,
    setError,
    deleteError,
    takeSnapShot,
  } = useFormStore(options);

  const watch = <FieldNames extends Name[]>(
    fieldsNames: FieldNames,
  ): { [Name in FieldNames[number]]: string } => {
    return fieldsNames.reduce((acc, name) => {
      watchField(name);

      return {
        ...acc,
        /**@todo snapshot or getFieldValue */
        [name]: getFieldValue(name),
      };
    }, {} as any);
  };

  const register = (
    name: Name,
    options?: {
      value?: InputValue;
      validations?: Validation[];
      onChange?(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
    },
  ) => {
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const {
        target: { value },
      } = e;

      updateFieldValue(name, { value });

      validateField({
        name,
        onValid: () => deleteError(name),
        onInvalid: ({ type, message }) => !errors[name] && setError(name, { type, message }),
      });

      if (isWatching(name)) takeSnapShot(name, value);

      options?.onChange?.(e);
    };

    const ref: RefCallback<HTMLInputElement | HTMLSelectElement> = instance => {
      if (!instance) return;

      /**@todo need? */
      instance.value = getFieldValue(name);

      registerField(name, {
        value: parseToInputValue(options?.value),
        validations: options?.validations,
        ref: instance,
      });
    };

    return {
      name,
      onChange,
      ref,
    };
  };

  const handleSubmit = (
    onValid?: (value: SubmitValue, e: FormEvent<HTMLFormElement>) => void,
    onInvalid?: (errors: FormErrors, e: FormEvent<HTMLFormElement>) => void,
  ) => {
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const formFields = Object.fromEntries(formData) as SubmitValue;

      /**@todo schema check */
      const isAllValid = Object.keys(invariantOf(formFields)).every(name => {
        const { ref } = getFieldInfo(name);

        /**@todo use store errors */
        const isValid = validateField({
          name,
          onValid: () => deleteError(name),
          onInvalid: ({ type, message }) => setError(name, { type, message }),
        });

        if (!isValid) ref?.focus();

        return isValid;
      });

      isAllValid ? onValid?.(formFields, e) : onInvalid?.(errors, e);
    };

    return onSubmit;
  };

  const getFieldState = (name: Name) => {
    const { isValid, ref } = getFieldInfo(name);

    return { isValid, ref };
  };

  return { store, errors, setError, register, watch, handleSubmit, getFieldValue, getFieldState };
};

export { useForm };

export type { UseFormReturn };
