import { UseFormReturn } from '@/hooks/Form/useForm';
import { PropsWithComponentPropsWithoutRef } from '@/utils/@common/polymorphic';
import { InputValue, Validation } from '@/utils/formStore/createFormStore';
import { ComponentPropsWithoutRef } from 'react';

type FormProps = Omit<
  PropsWithComponentPropsWithoutRef<
    'form',
    {
      onValidSubmit?: Parameters<UseFormReturn['handleSubmit']>[0];
      onInValidSubmit?: Parameters<UseFormReturn['handleSubmit']>[1];
      schema?: unknown;
    }
  >,
  'onSubmit'
>;

interface FieldProps {
  name: string;
  /**@todo defaultValue or value */
  value?: InputValue;
  validations?: Omit<Validation, 'message'>[];
  autoTab?: { to: string };
}

interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  htmlFor: string;
}

interface FieldMessageProps {
  name: string;
  type?: string;
}
interface PriorityMessage {
  priority: string[];
}

export type { FormProps, FieldProps, FieldMessageProps, LabelProps, PriorityMessage };
