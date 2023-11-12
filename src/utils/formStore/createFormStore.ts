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

type RegisterOptions = Partial<FieldInfo>;

const createFormsStore = <DefaultValues extends FormFields>(
  options?: CreateFormsStoreOptions<DefaultValues>,
) => {
  type FormStore = Store<DefaultValues>;
  type FormErrors = Errors<DefaultValues>;

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

  const registerField = <Name extends FieldName<DefaultValues>>(
    name: Name,
    options?: RegisterOptions,
  ) => {
    store[name] = {
      ...store[name],
      ...options,
      value: store[name]?.registered ? store[name]?.value : parseToInputValue(options?.value),
      registered: true,
    };
  };

  initStore(options?.defaultValues);

  return {
    store,
    errors,
    registerField,
  };
};

const parseToInputValue = (value: InputValue) => {
  if (!value) return '';

  if (Array.isArray(value)) return value.join();

  return String(value);
};

export { createFormsStore };
