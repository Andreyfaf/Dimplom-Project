from django.contrib import admin

from .models import (
    CartItem,
    ContactInfo,
    LeadershipContact,
    Order,
    OrderItem,
    Product,
    RepairRequest,
    RepairService,
)

admin.site.register(ContactInfo)
admin.site.register(LeadershipContact)
admin.site.register(Product)
admin.site.register(RepairService)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(RepairRequest)
