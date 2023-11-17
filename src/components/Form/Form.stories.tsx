import { within, userEvent } from '@storybook/testing-library';

import type { Meta, Story } from '@storybook/react';

import Form from './Form';
import classNames from 'classnames';

import '@/styles/Form/Form.css';
import { validation } from '@/utils/@common/validation';

export default {
  title: 'Components/Form',
  component: Form,
} satisfies Meta<typeof Form>;

const JoinStory = () => {
  return (
    <Form onValidSubmit={data => alert('가입 성공!\n' + JSON.stringify(data))}>
      {({ getFieldValue, errors }) => (
        <>
          <div className={classNames('Control')}>
            <Form.Label
              htmlFor="email-user"
              className={classNames('FieldLabel', { Invalid: errors['email-user'] })}
            >
              이메일
            </Form.Label>
            <Form.Field
              name="email-user"
              placeholder="이메일"
              validations={[validation.email(), validation.required()]}
              className={classNames('Field', errors['email-user'] ? 'InvalidField' : 'ValidField')}
            />
            <Form.FieldMessage name="email-user" type="email" className="FieldMessage">
              올바른 이메일 형식이 아닙니다.
            </Form.FieldMessage>
            <Form.FieldMessage name="email-user" type="required" className="FieldMessage">
              이메일은 필수입니다.
            </Form.FieldMessage>
          </div>
          <div className={classNames('Control')}>
            <Form.Label
              htmlFor="password"
              className={classNames('FieldLabel', { Invalid: errors['password'] })}
            >
              비밀번호
            </Form.Label>
            <div className={classNames('PasswordRules')}>
              영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해 주세요.
            </div>
            <Form.Field
              name="password"
              type="password"
              placeholder="비밀번호"
              className={classNames('Field', errors['password'] ? 'InvalidField' : 'ValidField')}
              validations={[validation.required(), validation.passwordRule()]}
            />
            <Form.FieldMessage name="password" type="required" className="FieldMessage">
              비밀번호는 필수입니다.
            </Form.FieldMessage>
            <Form.FieldMessage name="password" type="passwordRule" className="FieldMessage">
              비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.
            </Form.FieldMessage>
          </div>
          <div className={classNames('Control')}>
            <Form.Label
              htmlFor="password-check"
              className={classNames('FieldLabel', { Invalid: errors['password-check'] })}
            >
              비밀번호 확인
            </Form.Label>
            <Form.Field
              name="password-check"
              type="password"
              placeholder="비밀번호 확인"
              className={classNames(
                'Field',
                errors['password-check'] ? 'InvalidField' : 'ValidField',
              )}
              validations={[
                validation.required(),
                validation.passwordRule(),
                validation.passwordMatch(() => getFieldValue('password')),
              ]}
            />
            <Form.FieldMessage name="password-check" type="required" className="FieldMessage">
              비밀번호 확인은 필수입니다.
            </Form.FieldMessage>
            <Form.FieldMessage name="password-check" type="passwordMatch" className="FieldMessage">
              비밀번호가 일치하지 않습니다.
            </Form.FieldMessage>
            <Form.FieldMessage name="password-check" type="passwordRule" className="FieldMessage">
              비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.
            </Form.FieldMessage>
          </div>
          <div className={classNames('Control')}>
            <Form.Label
              htmlFor="year"
              className={classNames('FieldLabel', {
                Invalid: errors['year'] || errors['month'] || errors['day'],
              })}
            >
              생년월일
            </Form.Label>
            <Form.Field
              maxLength={4}
              name="year"
              placeholder="1997"
              autoTab={{ to: 'month' }}
              className={classNames('Field', errors['year'] ? 'InvalidField' : 'ValidField')}
              validations={[validation.required(), validation.year()]}
            />
            <Form.Field
              maxLength={2}
              name="month"
              placeholder="03"
              autoTab={{ to: 'day' }}
              className={classNames('Field', errors['month'] ? 'InvalidField' : 'ValidField')}
              validations={[validation.required(), validation.month()]}
            />
            <Form.Field
              maxLength={2}
              placeholder="24"
              name="day"
              className={classNames('Field', errors['day'] ? 'InvalidField' : 'ValidField')}
              validations={[validation.required(), validation.day()]}
            />
            <Form.PriorityMessage priority={['year', 'month', 'day']}>
              <Form.FieldMessage name="year" type="year" className="FieldMessage">
                1869 - 2023 범위의 년도를 입력해 주세요
              </Form.FieldMessage>
              <Form.FieldMessage name="year" type="required" className="FieldMessage">
                년도는 필수입니다.
              </Form.FieldMessage>
              <Form.FieldMessage name="month" type="month" className="FieldMessage">
                01 - 12 범위의 달을 입력해 주세요
              </Form.FieldMessage>
              <Form.FieldMessage name="month" type="required" className="FieldMessage">
                달은 필수입니다.
              </Form.FieldMessage>
              <Form.FieldMessage name="day" type="day" className="FieldMessage">
                01 - 31 범위의 날짜를 입력해 주세요
              </Form.FieldMessage>
              <Form.FieldMessage name="day" type="required" className="FieldMessage">
                일은 필수입니다.
              </Form.FieldMessage>
            </Form.PriorityMessage>
          </div>
          <button className={classNames('SubmitButton')}>가입하기</button>
        </>
      )}
    </Form>
  );
};

const AuthTabsStory = () => (
  <Form onValidSubmit={data => alert('제출 성공!\n' + JSON.stringify(data))}>
    {({ errors }) => (
      <>
        <div className={classNames('Control')}>
          <Form.Label
            htmlFor="year"
            className={classNames('FieldLabel', {
              Invalid: errors['year'] || errors['month'] || errors['day'],
            })}
          >
            생년월일
          </Form.Label>
          <Form.Field
            maxLength={4}
            name="year"
            placeholder="1997"
            autoTab={{ to: 'month' }}
            className={classNames('Field', errors['year'] ? 'InvalidField' : 'ValidField')}
            validations={[validation.required(), validation.year()]}
          />
          <Form.Field
            maxLength={2}
            name="month"
            placeholder="03"
            autoTab={{ to: 'day' }}
            className={classNames('Field', errors['month'] ? 'InvalidField' : 'ValidField')}
            validations={[validation.required(), validation.month()]}
          />
          <Form.Field
            maxLength={2}
            placeholder="24"
            name="day"
            className={classNames('Field', errors['day'] ? 'InvalidField' : 'ValidField')}
            validations={[validation.required(), validation.day()]}
          />
          <Form.PriorityMessage priority={['year', 'month', 'day']}>
            <Form.FieldMessage name="year" type="year" className="FieldMessage">
              1869 - 2023 범위의 년도를 입력해 주세요
            </Form.FieldMessage>
            <Form.FieldMessage name="year" type="required" className="FieldMessage">
              년도는 필수입니다.
            </Form.FieldMessage>
            <Form.FieldMessage name="month" type="month" className="FieldMessage">
              01 - 12 범위의 달을 입력해 주세요
            </Form.FieldMessage>
            <Form.FieldMessage name="month" type="required" className="FieldMessage">
              달은 필수입니다.
            </Form.FieldMessage>
            <Form.FieldMessage name="day" type="day" className="FieldMessage">
              01 - 31 범위의 날짜를 입력해 주세요
            </Form.FieldMessage>
            <Form.FieldMessage name="day" type="required" className="FieldMessage">
              일은 필수입니다.
            </Form.FieldMessage>
          </Form.PriorityMessage>
        </div>
        <button className={classNames('SubmitButton')}>제출하기</button>
      </>
    )}
  </Form>
);

export const Join: Story = args => <JoinStory {...args} />;

Join.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.type(canvas.getByPlaceholderText('이메일'), 'invalid.com', { delay: 100 });

  await userEvent.type(canvas.getByPlaceholderText('비밀번호'), 'Password123', { delay: 100 });

  await userEvent.type(canvas.getByPlaceholderText('비밀번호 확인'), 'Password123', {
    delay: 100,
  });

  await userEvent.type(canvas.getByPlaceholderText('1997'), '1997', { delay: 100 });
  await userEvent.type(canvas.getByPlaceholderText('03'), '03', { delay: 100 });
  await userEvent.type(canvas.getByPlaceholderText('24'), '24', { delay: 100 });

  userEvent.click(canvas.getByText('가입하기'));
};

export const AuthTabs: Story = args => <AuthTabsStory {...args} />;

AuthTabs.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.type(canvas.getByPlaceholderText('1997'), '1997', { delay: 100 });
  await userEvent.type(canvas.getByPlaceholderText('03'), '03', { delay: 100 });
  await userEvent.type(canvas.getByPlaceholderText('24'), '24', { delay: 100 });

  await userEvent.click(canvas.getByRole('button', { name: '제출하기' }));
};
