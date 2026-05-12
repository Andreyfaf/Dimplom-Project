from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

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


class BootstrapView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        ensure_seed_data()
        contact_info = ContactInfo.objects.first()
        return Response(
            {
                "contact_info": ContactInfoSerializer(contact_info).data if contact_info else None,
                "team": LeadershipContactSerializer(LeadershipContact.objects.all(), many=True).data,
                "products": ProductSerializer(Product.objects.filter(is_active=True), many=True).data,
                "repair_services": RepairServiceSerializer(RepairService.objects.all(), many=True).data,
            }
        )


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = CartItem.objects.filter(user=request.user).select_related("product")
        return Response(CartItemSerializer(items, many=True).data)


class AddCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ensure_seed_data()
        product = Product.objects.filter(pk=serializer.validated_data["product_id"], is_active=True).first()
        if not product:
            return Response({"detail": "Товар не найден."}, status=status.HTTP_404_NOT_FOUND)

        quantity = serializer.validated_data["quantity"]
        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={"quantity": quantity},
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save(update_fields=["quantity"])

        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        cart_item = CartItem.objects.filter(pk=pk, user=request.user).select_related("product").first()
        if not cart_item:
            return Response({"detail": "Позиция корзины не найдена."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart_item.quantity = serializer.validated_data["quantity"]
        cart_item.save(update_fields=["quantity"])
        return Response(CartItemSerializer(cart_item).data)

    def delete(self, request, pk):
        cart_item = CartItem.objects.filter(pk=pk, user=request.user).first()
        if not cart_item:
            return Response({"detail": "Позиция корзины не найдена."}, status=status.HTTP_404_NOT_FOUND)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartClearView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related("items")
        return Response(OrderSerializer(orders, many=True).data)

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

    def get(self, request):
        requests = RepairRequest.objects.filter(user=request.user).select_related("service")
        return Response(RepairRequestSerializer(requests, many=True).data)

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
