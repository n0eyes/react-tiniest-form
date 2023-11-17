const validation = {
  required() {
    return {
      type: 'required',
      validator(value: string) {
        return value.length > 0;
      },
    };
  },

  email() {
    return {
      type: 'email',
      validator(value: string) {
        return value.length === 0 || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
      },
    };
  },
  year() {
    return {
      type: 'year',
      validator(value: string) {
        return value.length === 0 || /^(18[6-9]\d|19\d{2}|20[01]\d|202[0-3])$/i.test(value);
      },
    };
  },
  month() {
    return {
      type: 'month',
      validator(value: string) {
        return value.length === 0 || /^(0[1-9]|1[0-2])$/i.test(value);
      },
    };
  },
  day() {
    return {
      type: 'day',
      validator(value: string) {
        return value.length === 0 || /^(0[1-9]|[12]\d|3[01])$/i.test(value);
      },
    };
  },
  minLength(length: number) {
    return {
      type: 'minLength',
      validator(value: string) {
        return value.length > length;
      },
    };
  },
  maxLength(length: number) {
    return {
      type: 'maxLength',
      validator(value: string) {
        return value.length < length;
      },
    };
  },
  passwordRule() {
    return {
      type: 'passwordRule',
      validator: (value: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
    };
  },
  passwordMatch(password: string) {
    return {
      type: 'passwordMatch',
      validator: (value: string) => password === value,
    };
  },
};

export { validation };
