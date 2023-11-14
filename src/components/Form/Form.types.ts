import { UseFormReturn } from '@/hooks/Form/useForm';
import { PropsWithComponentPropsWithoutRef } from '@/utils/@common/polymorphic';
import { InputValue, Validation } from '@/utils/formStore/createFormStore';
import { ComponentPropsWithoutRef } from 'react';

type FormProps = Omit<
  PropsWithComponentPropsWithoutRef<
    'form',
    {
      /**@todo use type */
      onValidSubmit?: Parameters<UseFormReturn['handleSubmit']>[0];
      onInValidSubmit?: Parameters<UseFormReturn['handleSubmit']>[1];
      schema?: unknown;
    }
  >,
  'onSubmit'
>;

interface FieldSetProps {
  name: string;
}

interface FieldProps {
  name: string;
  value?: InputValue;
  validations?: Omit<Validation, 'message'>[];
  autoTab?: { to: string };
}

interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  htmlFor: string;
}

interface MessageProps {
  name: string;
}

interface FieldMessageProps extends MessageProps {
  type?: string;
}

interface FieldSetMessageProps extends MessageProps {}

export type {
  FormProps,
  FieldSetProps,
  FieldProps,
  FieldMessageProps,
  FieldSetMessageProps,
  LabelProps,
};
