import { ComponentPropsWithoutRef } from 'react';
import { invariantOf } from '../@common/invariantOf';

type InputValue = ComponentPropsWithoutRef<'input'>['value'];

type FormFields = Record<string, InputValue>;

type FieldName<T extends FormFields> = keyof T;

type FieldInfo = {
  registered: boolean;
  value: string;
  watching: boolean;
  validations: Validation[];
};

type Validation = {
  type?: string;
  message?: string;
  validator: (value: string) => boolean;
};

type Store<Fields extends FormFields = FormFields> = {
  [Name in keyof Fields]: FieldInfo;
};

type Errors<Fields extends FormFields = FormFields> = {
  [name in keyof Fields]: ErrorsInfo;
};

type ErrorsInfo = Pick<Validation, 'type' | 'message'>;

type CreateFormsStoreOptions<DefaultValues extends FormFields> = {
  defaultValues: DefaultValues;
};

type MutateOptions = Partial<FieldInfo>;

const createFormsStore = <DefaultValues extends FormFields>(
  options?: CreateFormsStoreOptions<DefaultValues>,
) => {
  type FormStore = Store<DefaultValues>;
  type FormErrors = Errors<DefaultValues>;
  type Name = FieldName<DefaultValues>;

  const store: FormStore = {} as FormStore;
  const errors: FormErrors = {} as FormErrors;

  const initStore = (defaultValues?: DefaultValues) => {
    Object.entries(invariantOf(defaultValues)).forEach(
      /**@todo Valueof  */
      ([name, value]) => {
        Object.assign(store, {
          [name]: {
            value: parseToInputValue(value),
            watching: false,
            registered: false,
            validations: [],
          },
        });
      },
    );
  };

  const registerField = (name: Name, options?: MutateOptions) => {
    store[name] = {
      ...store[name],
      ...options,
      value: store[name]?.registered ? store[name]?.value : parseToInputValue(options?.value),
      registered: true,
    };
  };

  const updateFieldValue = (name: Name, options?: MutateOptions) => {
    store[name] = {
      ...store[name],
      ...options,
    };
  };

  const getFieldValue = (name: Name) => {
    return store[name].value;
  };

  const watchField = (name: Name) => {
    store[name].watching = true;
  };

  const setError = (name: Name, validation: ErrorsInfo) => {
    errors[name] = { ...validation };
  };

  const deleteError = (name: Name) => {
    delete errors[name];
  };

  const validateField = (payload: {
    name: Name;
    /**@todo Required or not */
    onValid?: VoidFunction;
    onInvalid?: (info: Required<Validation>) => void;
  }) => {
    const { name, onInvalid, onValid } = payload;

    const { value } = store[name];
    const { validations } = store[name];

    const isValid = validations?.every(info => {
      const { type = '', message = '', validator } = info;

      if (!validator(value)) {
        setError(name, { type, message });
        onInvalid?.({ type, message, validator });

        return false;
      }

      return true;
    });

    if (isValid) {
      deleteError(name);
      onValid?.();
    }

    return isValid;
  };

  initStore(options?.defaultValues);

  return {
    store,
    errors,
    registerField,
    updateFieldValue,
    validateField,
    getFieldValue,
    watchField,
  };
};

const parseToInputValue = (value: InputValue) => {
  if (!value) return '';

  if (Array.isArray(value)) return value.join();

  return String(value);
};

export { createFormsStore };

export type { FieldName, Validation, ErrorsInfo };
