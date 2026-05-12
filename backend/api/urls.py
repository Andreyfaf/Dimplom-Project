from django.urls import path

from .views import (
    AddCartItemView,
    BootstrapView,
    CartClearView,
    CartItemDetailView,
    CartView,
    LoginView,
    LogoutView,
    OrderView,
    ProfileView,
    RegisterView,
    RepairRequestView,
)

urlpatterns = [
    path("bootstrap/", BootstrapView.as_view(), name="bootstrap"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/profile/", ProfileView.as_view(), name="profile"),
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/", AddCartItemView.as_view(), name="cart-add-item"),
    path("cart/items/<int:pk>/", CartItemDetailView.as_view(), name="cart-item-detail"),
    path("cart/clear/", CartClearView.as_view(), name="cart-clear"),
    path("orders/", OrderView.as_view(), name="orders"),
    path("repair-requests/", RepairRequestView.as_view(), name="repair-requests"),
]
