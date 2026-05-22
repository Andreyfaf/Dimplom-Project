from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from django.contrib.auth.models import User

from .models import CartItem, ContactInfo, LeadershipContact, Order, OrderItem, Product, RepairRequest, RepairService
from .validators import (
    validate_optional_text,
    validate_password_strength,
    validate_person_name,
    validate_phone_number,
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="username")

    class Meta:
        model = User
        fields = ["id", "first_name", "phone"]


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField()
    phone = serializers.CharField()
    password = serializers.CharField(min_length=8)

    def validate_phone(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь уже существует")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["phone"],
            first_name=validated_data["name"],
            password=validated_data["password"]
        )
        return user


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(
            username=attrs["phone"],
            password=attrs["password"]
        )

        if not user:
            raise serializers.ValidationError("Неверный телефон или пароль")

        attrs["user"] = user
        return attrs


class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ["company_name", "phone", "email", "entrepreneur_name"]


class LeadershipContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadershipContact
        fields = ["id", "role", "name", "phone", "email"]


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "image",
            "fits",
            "short_description",
            "price_display",
            "price_amount",
            "purpose",
            "tips",
            "warranty",
            "care",
            "model_name",
            "product_type",
            "manufacturer",
            "created_at",
        ]


class RepairServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepairService
        fields = ["id", "name", "description", "price_display", "price_amount", "turnaround"]


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "line_total"]

    def get_line_total(self, obj):
        return obj.quantity * obj.product.price_amount


class AddCartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product_name", "price_display", "quantity", "line_total"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "full_name", "phone", "address", "total_amount", "status", "created_at", "items"]


class CreateOrderSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=32)
    address = serializers.CharField(max_length=255, allow_blank=True, required=False)

    def validate_name(self, value):
        return validate_person_name(value, "Имя")

    def validate_phone(self, value):
        return validate_phone_number(value)

    def validate_address(self, value):
        return validate_optional_text(value, "Адрес", 255)


class RepairRequestSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source="service.name", read_only=True)

    class Meta:
        model = RepairRequest
        fields = ["id", "service", "service_name", "name", "phone", "city", "problem", "status", "created_at"]


class CreateRepairRequestSerializer(serializers.Serializer):
    service_id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=32)
    city = serializers.CharField(max_length=120)
    problem = serializers.CharField(allow_blank=True, required=False)

    def validate_name(self, value):
        return validate_person_name(value, "Имя")

    def validate_phone(self, value):
        return validate_phone_number(value)

    def validate_city(self, value):
        return validate_person_name(value, "Город")

    def validate_problem(self, value):
        return validate_optional_text(value, "Описание проблемы", 500)