const NAME_PATTERN = /^[A-Za-zА-Яа-яЁёІіЇїЄєҚқҢңҒғҮүҰұҺһӘәӨө\s'-]{2,80}$/u;
const PHONE_PATTERN = /^\+?[0-9\s()-]{10,20}$/;

export function normalizeSpaces(value) {
  return value.trim().replace(/\s+/g, " ");
}

export function validateName(value, label = "Имя") {
  const normalized = normalizeSpaces(value);

  if (!normalized) {
    return `${label} обязательно для заполнения.`;
  }

  if (!NAME_PATTERN.test(normalized)) {
    return `${label} должно содержать только буквы, пробел, апостроф или дефис.`;
  }

  return "";
}

export function validateEmail(value) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return "Email обязателен для заполнения.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return "Введите корректный email.";
  }

  return "";
}

export function validatePassword(value) {
  if (!value) {
    return "Пароль обязателен для заполнения.";
  }

  if (value.length < 8) {
    return "Пароль должен содержать минимум 8 символов.";
  }

  if (!/[A-ZА-ЯЁ]/u.test(value)) {
    return "Пароль должен содержать хотя бы одну заглавную букву.";
  }

  if (!/[a-zа-яё]/u.test(value)) {
    return "Пароль должен содержать хотя бы одну строчную букву.";
  }

  if (!/\d/.test(value)) {
    return "Пароль должен содержать хотя бы одну цифру.";
  }

  return "";
}

export function validatePasswordConfirmation(password, confirmPassword) {
  if (!confirmPassword) {
    return "Подтвердите пароль.";
  }

  if (password !== confirmPassword) {
    return "Пароли не совпадают.";
  }

  return "";
}

export function validatePhone(value) {
  const normalized = value.trim();
  const digits = normalized.replace(/\D/g, "");

  if (!normalized) {
    return "Телефон обязателен для заполнения.";
  }

  if (!PHONE_PATTERN.test(normalized)) {
    return "Введите телефон в формате +7 (700) 123-45-67.";
  }

  if (digits.length < 10 || digits.length > 15) {
    return "Телефон должен содержать от 10 до 15 цифр.";
  }

  return "";
}

export function validateAddress(value) {
  if (value.length > 255) {
    return "Адрес не должен превышать 255 символов.";
  }

  return "";
}

export function validateProblemDescription(value) {
  if (value.length > 500) {
    return "Описание проблемы не должно превышать 500 символов.";
  }

  return "";
}
