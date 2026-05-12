import re

from rest_framework import serializers

NAME_PATTERN = re.compile(r"^[A-Za-zА-Яа-яЁёІіЇїЄєҚқҢңҒғҮүҰұҺһӘәӨө\s'-]{2,80}$", re.UNICODE)
PHONE_PATTERN = re.compile(r"^\+?[0-9\s()\-]{10,20}$")


def normalize_spaces(value):
    return " ".join(value.strip().split())


def validate_person_name(value, label="Имя"):
    normalized = normalize_spaces(value)

    if not normalized:
        raise serializers.ValidationError(f"{label} обязательно для заполнения.")

    if not NAME_PATTERN.fullmatch(normalized):
        raise serializers.ValidationError(
            f"{label} должно содержать только буквы, пробел, апостроф или дефис."
        )

    return normalized


def validate_password_strength(value):
    if len(value) < 8:
        raise serializers.ValidationError("Пароль должен содержать минимум 8 символов.")
    if not re.search(r"[A-ZА-ЯЁ]", value, re.UNICODE):
        raise serializers.ValidationError("Пароль должен содержать хотя бы одну заглавную букву.")
    if not re.search(r"[a-zа-яё]", value, re.UNICODE):
        raise serializers.ValidationError("Пароль должен содержать хотя бы одну строчную букву.")
    if not re.search(r"\d", value):
        raise serializers.ValidationError("Пароль должен содержать хотя бы одну цифру.")
    return value


def validate_phone_number(value):
    normalized = value.strip()
    digits = re.sub(r"\D", "", normalized)

    if not PHONE_PATTERN.fullmatch(normalized):
        raise serializers.ValidationError("Введите телефон в формате +7 (700) 123-45-67.")

    if len(digits) < 10 or len(digits) > 15:
        raise serializers.ValidationError("Телефон должен содержать от 10 до 15 цифр.")

    return normalized


def validate_optional_text(value, field_name, max_length):
    normalized = value.strip()
    if len(normalized) > max_length:
        raise serializers.ValidationError(f"{field_name} не должен превышать {max_length} символов.")
    return normalized
