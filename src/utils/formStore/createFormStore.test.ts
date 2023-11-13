import { ErrorsInfo, FieldName, Validation, createFormsStore } from './createFormStore';

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

  test('필드의 value를 가져온다.', () => {
    const { getFieldValue } = formStore;

    const value = getFieldValue('email');

    expect(value).toBe('seyeon4199@gmail.com');
  });

  test('필드를 watch한다.', () => {
    const { store, watchField } = formStore;

    watchField('email');

    expect(store.email.watching).toBe(true);
  });

  test('필드를 watch 여부를 가져온다.', () => {
    const { isWatching, watchField } = formStore;

    expect(isWatching('email')).toBe(false);
    watchField('email');
    expect(isWatching('email')).toBe(true);
  });
});

describe('유효성 검사 테스트', () => {
  const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onValid = jest.fn();
  const onInvalid = jest.fn();

  let formStore: ReturnType<typeof createFormsStore<DefaultValues>>;

  let testValidField: (name: FieldName<DefaultValues>) => void;
  let testInvalidField: (name: FieldName<DefaultValues>, { type, message }: ErrorsInfo) => void;

  beforeEach(() => {
    formStore = createFormsStore<DefaultValues>({
      defaultValues: { email: 'seyeon4199@gmail.com', password: 'pwd1234' },
    });

    formStore.registerField('email', {
      value: 'noeyes4199@gmail.com',
      validations: [
        {
          type: 'email',
          message: '이메일 형식이 아닙니다!',
          validator: (data: string) => EMAIL_REGEXP.test(data),
        },
      ],
    });

    testValidField = (name: FieldName<DefaultValues>) => {
      jest.clearAllMocks();

      const { errors, validateField } = formStore;

      const isValid = validateField({
        name,
        onValid,
        onInvalid,
      });

      expect(isValid).toBe(true);
      expect(onValid).toBeCalled();
      expect(onInvalid).not.toBeCalled();

      expect(errors[name]).toBe(undefined);
    };

    testInvalidField = (
      name: FieldName<DefaultValues>,
      { type, message }: Pick<Validation, 'type' | 'message'>,
    ) => {
      jest.clearAllMocks();

      const { errors, validateField } = formStore;

      const isValid = validateField({
        name,
        onValid,
        onInvalid,
      });

      expect(isValid).toBe(false);
      expect(onValid).not.toBeCalled();
      expect(onInvalid).toBeCalled();

      expect(errors[name].type).toBe(type);
      expect(errors[name].message).toBe(message);
    };
  });

  context('유저가 유효한 필드를 입력한 경우', () => {
    it('에러에 필드가 존재하지 않고 onValid 콜백 함수가 실행되어야 한다.', () => {
      const { updateFieldValue } = formStore;

      updateFieldValue('email', { value: 'noeyes4199@gmail.com' });

      testValidField('email');
    });
  });

  context('유저가 유효하지 않은 필드를 입력한 경우', () => {
    it('에러에 필드가 존재하고 onInvalid 콜백 함수가 실행되어야 한다.', () => {
      const { updateFieldValue } = formStore;

      updateFieldValue('email', { value: 'InvalidEmail' });

      testInvalidField('email', {
        type: 'email',
        message: '이메일 형식이 아닙니다!',
      });
    });
  });

  context('유저의 입력에 따라 유효성이 변경되는 경우', () => {
    it('변경되는 즉시 유효성이 검증되어야 한다.', () => {
      const { updateFieldValue } = formStore;

      // valid => invalid
      updateFieldValue('email', { value: 'InvalidEmail' });

      testInvalidField('email', {
        type: 'email',
        message: '이메일 형식이 아닙니다!',
      });

      // invalid => valid
      updateFieldValue('email', { value: 'seyeon4199@gmail.com' });

      testValidField('email');
    });
  });
});
