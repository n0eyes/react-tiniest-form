import { ChangeEvent, ElementType, useEffect, useId, useRef } from 'react';

import createFormContext from '@/context/FormContext/FormContext';

import { UseFormReturn, useForm } from '@/hooks/Form/useForm';
import { useErrorFieldsSets } from '@/hooks/Form/useErrorFieldSets';
import { getPolymorphicProps } from '@/utils/@common/polymorphic';
import { resolveRenderProps } from '@/utils/@common/resolveRenderProps';

import type { PolymorphicProps } from '@/utils/@common/polymorphic';
import type {
  FieldMessageProps,
  FieldProps,
  FieldSetMessageProps,
  FieldSetProps,
  FormProps,
  LabelProps,
} from './Form.types';
import type { PropsWithRenderProps } from '@/types/@common/utility';

const { FormProvider, useFormContext } = createFormContext();

const Form = (props: PropsWithRenderProps<FormProps, UseFormReturn>) => {
  const method = useForm();
  const handleErrorFieldSets = useErrorFieldsSets();

  const { children, onValidSubmit, onInValidSubmit, ...restProps } = props;

  const resolvedChildren = resolveRenderProps(children, method);

  return (
    <FormProvider value={{ ...method, ...handleErrorFieldSets }}>
      <form onSubmit={method.handleSubmit(onValidSubmit, onInValidSubmit)} {...restProps}>
        {resolvedChildren}
      </form>
    </FormProvider>
  );
};

const FieldSet = <T extends ElementType = 'fieldset'>(
  props: PolymorphicProps<T, FieldSetProps>,
) => {
  const {
    Element,
    children,
    name: fieldsetName,
    ...restProps
  } = getPolymorphicProps('fieldset', props);

  const ref = useRef<HTMLElement>(null);

  const { errors, errorFieldSets, addErrorFieldSet, deleteErrorFieldSet } = useFormContext();

  useEffect(() => {
    if (!ref.current) return;

    const fields = Array.from(
      ref.current.querySelectorAll<HTMLInputElement | HTMLSelectElement>(`[${FIELD_ATTR}]`),
    );

    const isAllValid = fields.every(({ name }) => {
      if (errors[name] && !errorFieldSets.has(name)) {
        addErrorFieldSet(fieldsetName);

        return false;
      }

      return true;
    });

    isAllValid && deleteErrorFieldSet(fieldsetName);
  }, [Object.keys(errors).join()]);

  return (
    <Element ref={ref} {...restProps}>
      {children}
    </Element>
  );
};

const FIELD_ATTR = 'field_attr';

const Field = <T extends 'input' | 'select' = 'input'>(props: PolymorphicProps<T, FieldProps>) => {
  const {
    Element,
    name,
    value,
    autoTab,
    onChange: onChangeProps,
    id: idProps = '',
    validations = [],
    ...restProps
  } = getPolymorphicProps('input', props);

  const id = useId() + idProps;

  const { register, getFieldValue, getFieldState } = useFormContext();

  const onChange = (e: ChangeEvent<HTMLInputElement> & ChangeEvent<HTMLSelectElement>) => {
    Array.from(
      document.querySelectorAll<HTMLInputElement | HTMLSelectElement>(`[${FIELD_ATTR}]`),
    ).forEach(instance => {
      if (instance.name !== autoTab?.to || !getFieldState(name).isValid) return;

      if (
        e.target instanceof HTMLInputElement &&
        getFieldValue(name).length === e.target.maxLength
      ) {
        instance.focus();
      }

      if (e.target instanceof HTMLSelectElement) {
        instance.focus();
      }
    });

    onChangeProps?.(e);
  };

  return (
    <Element
      {...register(name, {
        value,
        validations,
        onChange,
      })}
      {...restProps}
      {...{ [FIELD_ATTR]: '' }}
      id={id}
    />
  );
};

const Label = (props: LabelProps) => {
  const { children, htmlFor, ...restProps } = props;

  const ref = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    /**@todo 개별 form 내부의 field만 조회하도록 수정 */
    const fields = Array.from(document.querySelectorAll<HTMLInputElement>(`[${FIELD_ATTR}]`));

    fields.forEach(({ id, name }) => {
      if (name === htmlFor && ref.current) {
        ref.current.htmlFor = id;
      }
    });
  }, []);

  return (
    <label ref={ref} {...restProps}>
      {children}
    </label>
  );
};

const FieldSetMessage = <T extends ElementType = 'div'>(
  props: PolymorphicProps<T, FieldSetMessageProps>,
) => {
  const { Element, children, name, ...restProps } = getPolymorphicProps('div', props);

  const { errorFieldSets } = useFormContext();

  if (errorFieldSets.has(name)) {
    return <Element {...restProps}>{children}</Element>;
  }

  return null;
};

const FieldMessage = <T extends ElementType = 'div'>(
  props: PolymorphicProps<T, FieldMessageProps>,
) => {
  const { Element, type, children, name, ...restProps } = getPolymorphicProps('div', props);

  const { errors } = useFormContext();

  if (errors[name] && (!type || errors[name].type === type)) {
    return <Element {...restProps}>{children}</Element>;
  }

  return null;
};

Form.FieldSet = FieldSet;
Form.Field = Field;
Form.Label = Label;
Form.FieldSetMessage = FieldSetMessage;
Form.FieldMessage = FieldMessage;

export default Form;
