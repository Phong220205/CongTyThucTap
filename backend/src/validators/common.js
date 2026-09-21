const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+().\s-]{8,20}$/;

export const validators = {
  required(value, label) {
    return value === undefined || value === null || String(value).trim() === '' ? `${label} là bắt buộc.` : null;
  },
  email(value, label = 'Email') {
    return value && !emailPattern.test(String(value)) ? `${label} không đúng định dạng.` : null;
  },
  phone(value, label = 'Số điện thoại') {
    return value && !phonePattern.test(String(value)) ? `${label} không đúng định dạng cơ bản.` : null;
  },
  range(value, min, max, label) {
    const number = Number(value);
    return Number.isNaN(number) || number < min || number > max ? `${label} phải từ ${min} đến ${max}.` : null;
  },
};

export function compactErrors(errors) {
  return errors.filter(Boolean);
}
