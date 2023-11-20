---
sidebar_position: 1
---

- Form 컴포넌트는 개발자 경험에 중점을 둔 UI 컴포넌트입니다.
- 기본적으로 스타일이 전혀 없는 상태로 제공되므로 사용자가 직접 스타일링하여 사용할 수 있습니다.
- 모든 동작은 내부적으로 처리되므로 로컬 상태를 만들지 않고 선언적으로 기능을 사용할 수 있습니다.

<details>
  <summary>AutoTabs Demo</summary>

  <iframe src="https://6557321d85c9b158f4ebd5d2-eossuixhgw.chromatic.com/?path=/story/components-form--auto-tabs"  
style={{width:'100%', height:'350px'}} title="code-example" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; vr; xr-spatial-tracking"></iframe>
  
  ```jsx
const AutoTabs = () => (
  <Form onValidSubmit={data => alert(JSON.stringify(data))}>
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
            name="year"
            maxLength={4}
            placeholder="1997"
            autoTab={{ to: 'month' }}
            className={classNames('Field', errors['year'] ? 'InvalidField' : 'ValidField')}
            validations={[validation.required(), validation.year()]}
          />
          <Form.Field
            name="month"
            maxLength={2}
            placeholder="03"
            autoTab={{ to: 'day' }}
            className={classNames('Field', errors['month'] ? 'InvalidField' : 'ValidField')}
            validations={[validation.required(), validation.month()]}
          />
          <Form.Field
            name="day"
            maxLength={2}
            placeholder="24"
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
        <button className='SubmitButton'>제출하기</button>
      </>
    )}
  </Form>
);
```
</details>

## Anatomy

```jsx
import { Form } from 'react-tiniest-form';

export default () => (
  <Form>
    <Form.Label />
    <Form.Field />
    <Form.Message />
    <Form.PriorityMessage>
      <Form.Message />
      <Form.Message />
      <Form.Message />
    </Form.PriorityMessage>
  </Form>
);
```

## API

### Form

| prop                | type                                                                            | default |
| ------------------- | ------------------------------------------------------------------------------- | :-----: |
| **children**        | ReactNode \| (method: UseFormReturn) => ReactNode                               |    -    |
| **onValidSubmit**   | ((value: SubmitValue, e: React.FormEvent\<HTMLFormElement\>) => void)           |    -    |
| **onInValidSubmit** | ((errors: Errors\<FormFields\>, e: React.FormEvent\<HTMLFormElement\>) => void) |    -    |

- **children** : `render props` 형태로 사용하여 `useForm`의 모든 기능을 사용할 수 있습니다.

### Label

| prop        | type   | default |
| ----------- | ------ | :-----: |
| **htmlFor** | string |    -    |

### Field

| prop            | type                                                      | default |
| --------------- | --------------------------------------------------------- | :-----: |
| **as**          | input \| select                                           |  input  |
| **validations** | \{ type?:string, validator?: (value:string)=>boolean \}[] |    -    |
| **autoTab**     | \{ to: string \}                                          |    -    |

- **as** : element의 type을 설정합니다.

- **validations** : `onChange` 이벤트가 발생할 때 `value`의 유효성을 검사합니다.

  - 설정한 `type`에 따라 `errors`, `Field.Message`를 활용할 수 있습니다.

- **autoTab** : 설정한 name의 field로 포커스를 옮깁니다.
  - `maxLength` 설정이 필요합니다.
  - `value`가 모든 validation을 통과하고 `maxLength`에 도달하였을 때 동작합니다.

### FieldMessage

| prop     | type        | default |
| -------- | ----------- | :-----: |
| **as**   | ElementType |   div   |
| **name** | string      |    -    |
| **type** | string      |    -    |

- **as** : element의 type을 설정합니다.

- **name** : 메시지를 표시할 field의 name을 설정합니다.

- **type** : 메시지를 표시할 validation의 type을 설정합니다.
  - `type`을 설정하지 않으면 모든 validation을 검사합니다.

### PriorityMessage

| prop         | type     | default |
| ------------ | -------- | :-----: |
| **priority** | string[] |    -    |

- **priority** : 메시지를 표시할 field들의 name을 설정합니다.
  - 복수의 메시지들 중 한 개의 메시지만 표시됩니다.
  - 우선 순위는 배열에 작성된 name의 순서와 같습니다.
