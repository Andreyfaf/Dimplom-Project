from rest_framework import permissions, serializers, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from drf_spectacular.utils import OpenApiResponse, extend_schema, inline_serializer

from .models import CartItem, ContactInfo, LeadershipContact, Order, OrderItem, Product, RepairRequest, RepairService
from .serializers import (
    AddCartItemSerializer,
    CartItemSerializer,
    ContactInfoSerializer,
    CreateOrderSerializer,
    CreateRepairRequestSerializer,
    LeadershipContactSerializer,
    LoginSerializer,
    OrderSerializer,
    ProductSerializer,
    RegisterSerializer,
    RepairRequestSerializer,
    RepairServiceSerializer,
    UpdateCartItemSerializer,
    UserSerializer,
)
from .services import ensure_seed_data


# --- Описание ответа аутентификации для Swagger (token + данные пользователя) ---
AUTH_RESPONSE = inline_serializer(
    name="AuthResponse",
    fields={
        "token": serializers.CharField(),
        "user": inline_serializer(
            name="AuthUser",
            fields={
                "id": serializers.IntegerField(),
                "username": serializers.CharField(),
                "email": serializers.EmailField(),
                "name": serializers.CharField(),
            },
        ),
    },
)


class BootstrapView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        tags=["catalog"],
        summary="Стартовые данные сайта",
        description="Контакты, команда, активные товары и услуги ремонта одним запросом.",
        responses=inline_serializer(
            name="BootstrapResponse",
            fields={
                "contact_info": ContactInfoSerializer(allow_null=True),
                "team": LeadershipContactSerializer(many=True),
                "products": ProductSerializer(many=True),
                "repair_services": RepairServiceSerializer(many=True),
            },
        ),
    )
    def get(self, request):
        ensure_seed_data()
        contact_info = ContactInfo.objects.first()

        return Response({
            "contact_info": ContactInfoSerializer(contact_info).data if contact_info else None,

            "team": LeadershipContactSerializer(
                LeadershipContact.objects.all(),
                many=True
            ).data,

            "products": ProductSerializer(
                Product.objects.filter(is_active=True),
                many=True,
                context={"request": request}
            ).data,

            "repair_services": RepairServiceSerializer(
                RepairService.objects.all(),
                many=True
            ).data,
        })

class RegisterView(APIView):
    @extend_schema(
        tags=["auth"],
        summary="Регистрация пользователя",
        request=inline_serializer(
            name="RegisterRequest",
            fields={
                "email": serializers.EmailField(),
                "password": serializers.CharField(write_only=True),
                "name": serializers.CharField(),
            },
        ),
        responses={200: AUTH_RESPONSE},
    )
    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")
        name = request.data.get("name")

        if User.objects.filter(username=email).exists():
            return Response(
                {"error": "Пользователь уже существует"},
                status=400
            )

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name
        )
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": user.first_name
            }
        })

class LoginView(APIView):
    @extend_schema(
        tags=["auth"],
        summary="Вход (получение токена)",
        request=inline_serializer(
            name="LoginRequest",
            fields={
                "email": serializers.EmailField(),
                "password": serializers.CharField(write_only=True),
            },
        ),
        responses={200: AUTH_RESPONSE},
    )
    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(
            username=email,
            password=password
        )

        if not user:
            return Response(
                {"error": "Неверный email или пароль"},
                status=400
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": user.first_name
            }
        })

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["auth"],
        summary="Выход (удаление токена)",
        request=None,
        responses={204: OpenApiResponse(description="Токен удалён")},
    )
    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["auth"],
        summary="Профиль текущего пользователя",
        responses={200: UserSerializer},
    )
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["cart"],
        summary="Содержимое корзины",
        responses={200: CartItemSerializer(many=True)},
    )
    def get(self, request):
        items = CartItem.objects.filter(user=request.user).select_related("product")
        return Response(CartItemSerializer(items, many=True).data)


class AddCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["cart"],
        summary="Добавить товар в корзину",
        request=AddCartItemSerializer,
        responses={201: CartItemSerializer},
    )
    def post(self, request):
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        product = Product.objects.filter(id=product_id).first()

        if not product:
            return Response(
                {"detail": "Товар не найден"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={"quantity": quantity},
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save(update_fields=["quantity"])

        return Response(
            CartItemSerializer(cart_item).data,
            status=status.HTTP_201_CREATED
        )


class CartItemDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["cart"],
        summary="Изменить количество позиции",
        request=UpdateCartItemSerializer,
        responses={200: CartItemSerializer},
    )
    def patch(self, request, pk):
        cart_item = CartItem.objects.filter(pk=pk, user=request.user).select_related("product").first()
        if not cart_item:
            return Response({"detail": "Позиция корзины не найдена."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart_item.quantity = serializer.validated_data["quantity"]
        cart_item.save(update_fields=["quantity"])
        return Response(CartItemSerializer(cart_item).data)

    @extend_schema(
        tags=["cart"],
        summary="Удалить позицию из корзины",
        responses={204: OpenApiResponse(description="Позиция удалена")},
    )
    def delete(self, request, pk):
        cart_item = CartItem.objects.filter(pk=pk, user=request.user).first()
        if not cart_item:
            return Response({"detail": "Позиция корзины не найдена."}, status=status.HTTP_404_NOT_FOUND)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartClearView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["cart"],
        summary="Очистить корзину",
        responses={204: OpenApiResponse(description="Корзина очищена")},
    )
    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["orders"],
        summary="Список заказов пользователя",
        responses={200: OrderSerializer(many=True)},
    )
    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related("items")
        return Response(OrderSerializer(orders, many=True).data)

    @extend_schema(
        tags=["orders"],
        summary="Оформить заказ из корзины",
        request=CreateOrderSerializer,
        responses={201: OrderSerializer},
    )
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart_items = list(CartItem.objects.filter(user=request.user).select_related("product"))
        if not cart_items:
            return Response({"detail": "Корзина пуста."}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = sum(item.product.price_amount * item.quantity for item in cart_items)
        order = Order.objects.create(
            user=request.user,
            full_name=serializer.validated_data["name"],
            phone=serializer.validated_data["phone"],
            address=serializer.validated_data.get("address", ""),
            total_amount=total_amount,
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product_name=item.product.name,
                price_display=item.product.price_display,
                quantity=item.quantity,
                line_total=item.product.price_amount * item.quantity,
            )

        CartItem.objects.filter(user=request.user).delete()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class RepairRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["repair"],
        summary="Список заявок на ремонт",
        responses={200: RepairRequestSerializer(many=True)},
    )
    def get(self, request):
        requests = RepairRequest.objects.filter(user=request.user).select_related("service")
        return Response(RepairRequestSerializer(requests, many=True).data)

    @extend_schema(
        tags=["repair"],
        summary="Создать заявку на ремонт",
        request=CreateRepairRequestSerializer,
        responses={201: RepairRequestSerializer},
    )
    def post(self, request):
        serializer = CreateRepairRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = RepairService.objects.filter(pk=serializer.validated_data["service_id"]).first()
        if not service:
            return Response({"detail": "Услуга не найдена."}, status=status.HTTP_404_NOT_FOUND)

        repair_request = RepairRequest.objects.create(
            user=request.user,
            service=service,
            name=serializer.validated_data["name"],
            phone=serializer.validated_data["phone"],
            city=serializer.validated_data["city"],
            problem=serializer.validated_data.get("problem", ""),
        )
        return Response(RepairRequestSerializer(repair_request).data, status=status.HTTP_201_CREATED)
