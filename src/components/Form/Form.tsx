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
import createCollection from '@/context/Collection/Collection';

const { FormProvider, useFormContext } = createFormContext();

const { CollectionProvider, CollectionItem, useCollection } = createCollection();

const Form = (props: PropsWithRenderProps<FormProps, UseFormReturn>) => {
  const method = useForm();

  const { children, onValidSubmit, onInValidSubmit, ...restProps } = props;

  const resolvedChildren = resolveRenderProps(children, method);

  return (
    <FormProvider value={method}>
      <CollectionProvider>
        <form onSubmit={method.handleSubmit(onValidSubmit, onInValidSubmit)} {...restProps}>
          {resolvedChildren}
        </form>
      </CollectionProvider>
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

  const { getItems } = useCollection();

  const onChange = (e: ChangeEvent<HTMLInputElement> & ChangeEvent<HTMLSelectElement>) => {
    getItems().forEach(instance => {
      if (!(instance instanceof HTMLInputElement) && !(instance instanceof HTMLSelectElement))
        return;

      if (instance.name !== autoTab?.to || !getFieldState(name)?.isValid) return;

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
    <CollectionItem>
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
    </CollectionItem>
  );
};

const Label = (props: LabelProps) => {
  const { children, htmlFor, ...restProps } = props;

  const ref = useRef<HTMLLabelElement>(null);

  const { getItems } = useCollection();

  useEffect(() => {
    getItems().forEach(instance => {
      if (!(instance instanceof HTMLInputElement) && !(instance instanceof HTMLSelectElement))
        return;

      if (!ref.current) return;

      if (instance.name === htmlFor) {
        ref.current.htmlFor = instance.id;
      }
    });
  });

  return (
    <label ref={ref} {...restProps}>
      {children}
    </label>
  );
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

const PriorityMessage = (props: PropsWithChildren<PriorityMessage>) => {
  const { children, priority } = props;

  const { errors } = useFormContext();

  const errorField = priority.find(name => errors[name]);

  return errorField ? (
    <>
      {Children.map(children, child => {
        if (!isValidElement<FieldProps>(child)) return null;

        return child.props.name === errorField ? child : null;
      })}
    </>
  ) : null;
};

Form.Field = Field;
Form.Label = Label;
Form.FieldMessage = FieldMessage;
Form.PriorityMessage = PriorityMessage;

export default Form;
