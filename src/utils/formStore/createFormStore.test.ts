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
});
