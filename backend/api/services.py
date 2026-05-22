from datetime import date, timedelta

from .models import ContactInfo, LeadershipContact, Product, RepairService


def ensure_seed_data():
    ContactInfo.objects.get_or_create(
        company_name="Gidrobas",
        defaults={
            "phone": "+7 (900) 123-45-67",
            "email": "info@gidrobas.ru",
            "entrepreneur_name": "ИП: Бутенко. М",
        },
    )

    leadership = [
        {
            "role": "Директор",
            "name": "Фафонов. К",
            "phone": "+7 (900) 111-11-11",
            "email": "director@gidrobas.ru",
            "display_order": 1,
        },
        {
            "role": "Главный инженер",
            "name": "Руденский. А",
            "phone": "+7 (900) 222-22-22",
            "email": "engineer@gidrobas.ru",
            "display_order": 2,
        },
    ]

    for item in leadership:
        LeadershipContact.objects.update_or_create(
            email=item["email"],
            defaults=item
        )

    # =========================
    # PRODUCTS
    # =========================

    products = [
        {
            "name": "Гидроцилиндр экскаватора",
            "image": "products/cilender-escalator.jpg",
        },
        {
            "name": "Гидроцилиндр пресса",
            "image": "products/gidrocilindr_press.jpg",
        },
        {
            "name": "Комплектующие для спецтехники",
            "image": "products/complect-manjet.jpg",
        },
        {
            "name": "Манжеты и уплотнения",
            "image": "products/default.jpg",
        },
    ]

    for item in products:
        Product.objects.get_or_create(
            name=item["name"],
            defaults=item
        )

    # =========================
    # SERVICES
    # =========================

    services = [
        {
            "name": "Диагностика",
            "description": "Полная проверка гидроцилиндра, выявление неисправностей.",
            "price_display": "1 500 ₽",
            "price_amount": 1500,
            "turnaround": "1-2 дня",
            "display_order": 1,
        },
        {
            "name": "Замена уплотнений",
            "description": "Замена манжет, колец и всех уплотнителей.",
            "price_display": "3 000 ₽",
            "price_amount": 3000,
            "turnaround": "2-3 дня",
            "display_order": 2,
        },
        {
            "name": "Ремонт штока",
            "description": "Восстановление хромированного покрытия, шлифовка.",
            "price_display": "от 5 000 ₽",
            "price_amount": 5000,
            "turnaround": "3-5 дней",
            "display_order": 3,
        },
        {
            "name": "Капитальный ремонт",
            "description": "Полное восстановление с заменой всех изношенных деталей.",
            "price_display": "от 15 000 ₽",
            "price_amount": 15000,
            "turnaround": "10-14 дней",
            "display_order": 4,
        },
    ]

    for item in services:
        RepairService.objects.update_or_create(
            name=item["name"],
            defaults=item
        )