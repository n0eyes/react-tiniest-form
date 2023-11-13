import { createFormsStore } from './createFormStore';

type DefaultValues = {
  email: string;
  password: string;
};

describe('FormStore', () => {
  let formStore: ReturnType<typeof createFormsStore<DefaultValues>>;

  beforeEach(() => {
    formStore = createFormsStore<DefaultValues>({
      defaultValues: { email: 'seyeon4199@gmail.com', password: 'pwd1234' },
    });
  });

  test('필드를 초기화한다.', () => {
    const { store } = formStore;

    expect(store.email.value).toBe('seyeon4199@gmail.com');
    expect(store.password.value).toBe('pwd1234');
  });

  test('필드를 등록한다. value가 defaultValue보다 우선한다.', () => {
    const { store, registerField } = formStore;

    registerField('email', { value: 'noeyes4199@gmail.com' });

    expect(store.email.value).toBe('noeyes4199@gmail.com');
  });

  test('필드를 업데이트한다.', () => {
    const { store, registerField, updateFieldValue } = formStore;

    expect(store.email.value).toBe('seyeon4199@gmail.com');

    registerField('email', { value: 'noeyes4199@gmail.com' });
    expect(store.email.value).toBe('noeyes4199@gmail.com');

    updateFieldValue('email', { value: 'updated4199@gmail.com' });
    expect(store.email.value).toBe('updated4199@gmail.com');
  });
});