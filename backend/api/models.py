from django.conf import settings
from django.db import models
from django.utils import timezone

class ContactInfo(models.Model):
    company_name = models.CharField(max_length=120, default="Gidrobas")
    phone = models.CharField(max_length=32)
    email = models.EmailField()
    entrepreneur_name = models.CharField(max_length=120)

    def __str__(self):
        return self.company_name


class LeadershipContact(models.Model):
    role = models.CharField(max_length=120)
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=32)
    email = models.EmailField()
    display_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.role}: {self.name}"


class Product(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True,
        default=None
    )
    
    fits = models.CharField(max_length=255)
    short_description = models.TextField()
    price_display = models.CharField(max_length=64)
    price_amount = models.PositiveIntegerField()
    purpose = models.TextField()
    tips = models.TextField()
    warranty = models.CharField(max_length=120)
    care = models.TextField()
    model_name = models.CharField(max_length=255)
    product_type = models.CharField(max_length=120, default="Гидроцилиндр")
    manufacturer = models.CharField(max_length=120, default="Gidrobas")
    created_at = models.DateField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


class RepairService(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    price_display = models.CharField(max_length=64)
    price_amount = models.PositiveIntegerField(default=0)
    turnaround = models.CharField(max_length=120)
    display_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return self.name


class CartItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart_items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="cart_items"
    )

    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.phone}: {self.product.name} x{self.quantity}"


class Order(models.Model):
    STATUS_NEW = "новый"

    STATUS_CHOICES = [
        (STATUS_NEW, "Новый"),
        ("в работе", "В работе"),
        ("завершен", "Завершен"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=32)
    address = models.CharField(max_length=255, blank=True)
    total_amount = models.PositiveIntegerField()

    status = models.CharField(
        max_length=32,
        choices=STATUS_CHOICES,
        default=STATUS_NEW
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Заказ #{self.pk}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product_name = models.CharField(max_length=255)
    price_display = models.CharField(max_length=64)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product_name} x{self.quantity}"


class RepairRequest(models.Model):
    STATUS_NEW = "новая"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="repair_requests"
    )

    service = models.ForeignKey(
        RepairService,
        on_delete=models.CASCADE,
        related_name="requests"
    )

    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=32)
    city = models.CharField(max_length=120)
    problem = models.TextField(blank=True)
    status = models.CharField(max_length=32, default=STATUS_NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.service.name}: {self.name}"