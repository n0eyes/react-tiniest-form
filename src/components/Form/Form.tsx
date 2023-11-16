import {
  ChangeEvent,
  Children,
  ElementType,
  PropsWithChildren,
  isValidElement,
  useEffect,
  useId,
  useRef,
} from 'react';

import createFormContext from '@/context/FormContext/FormContext';

import { UseFormReturn, useForm } from '@/hooks/Form/useForm';
import { getPolymorphicProps } from '@/utils/@common/polymorphic';
import { resolveRenderProps } from '@/utils/@common/resolveRenderProps';

import type { PolymorphicProps } from '@/utils/@common/polymorphic';
import type {
  FieldMessageProps,
  FieldProps,
  FormProps,
  LabelProps,
  PriorityMessage,
} from './Form.types';
import type { PropsWithRenderProps } from '@/types/@common/utility';

const { FormProvider, useFormContext } = createFormContext();

const Form = (props: PropsWithRenderProps<FormProps, UseFormReturn>) => {
  const method = useForm();

  const { children, onValidSubmit, onInValidSubmit, ...restProps } = props;

  const resolvedChildren = resolveRenderProps(children, method);

  return (
    <FormProvider value={method}>
      <form onSubmit={method.handleSubmit(onValidSubmit, onInValidSubmit)} {...restProps}>
        {resolvedChildren}
      </form>
    </FormProvider>
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

const FieldMessage = <T extends ElementType = 'div'>(
  props: PolymorphicProps<T, FieldMessageProps>,
) => {
  const { Element, type, only, children, name, ...restProps } = getPolymorphicProps('div', props);

  const { errors } = useFormContext();

  if (errors[name] && (!type || errors[name].type === type)) {
    return <Element {...restProps}>{children}</Element>;
  }

  return null;
};

const PriorityMessage = (props: PropsWithChildren<PriorityMessage>) => {
  const { children, priority } = props;

  const { errors } = useFormContext();

  const errorField = priority.find(name => errors[name]);

  return errorField
    ? Children.map(children, child => {
        if (!isValidElement<FieldProps>(child)) return null;

        return child.props.name === errorField ? child : null;
      })
    : null;
};

Form.Field = Field;
Form.Label = Label;
Form.FieldMessage = FieldMessage;
Form.PriorityMessage = PriorityMessage;

export default Form;
