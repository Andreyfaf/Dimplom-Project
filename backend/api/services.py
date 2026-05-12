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
        LeadershipContact.objects.update_or_create(email=item["email"], defaults=item)

    products = [
        {
            "name": "Гидроцилиндр экскаватора",
            "image_key": "cilender-escalator",
            "fits": "Подходит для: ЭО-2621, ЭО-3322, JCB, Hyundai",
            "short_description": "Ход штока: 1200 мм | Усилие: 25 т",
            "price_display": "25 000 ₽",
            "price_amount": 25000,
            "purpose": "Используется для подъема и перемещения тяжелых грузов на экскаваторах.",
            "tips": "Рекомендуется проводить техническое обслуживание каждые 500 часов работы.",
            "warranty": "Гарантия 12 месяцев",
            "care": "Хранить при температуре от -20°C до +40°C.",
            "model_name": "Гидроцилиндр экскаватора",
            "created_at": date.today() - timedelta(days=9),
        },
        {
            "name": "Гидроцилиндр пресса",
            "image_key": "gidrocilindr-press",
            "fits": "Для гидравлических прессов П-125, П-250",
            "short_description": "Ход штока: 800 мм | Усилие: 40 т",
            "price_display": "18 000 ₽",
            "price_amount": 18000,
            "purpose": "Применяется в гидравлических прессах для обработки металла.",
            "tips": "Регулярно проверяйте состояние уплотнительных колец.",
            "warranty": "Гарантия 18 месяцев",
            "care": "Избегайте попадания грязи на шток.",
            "model_name": "Гидроцилиндр пресса",
            "created_at": date.today() - timedelta(days=16),
        },
        {
            "name": "Комплектующие для спецтехники",
            "image_key": "complect-manjet",
            "fits": "Кольца, поршни, втулки - любые размеры",
            "short_description": "Для экскаваторов, погрузчиков, бульдозеров",
            "price_display": "от 5 000 ₽",
            "price_amount": 5000,
            "purpose": "Комплектующие для ремонта гидроцилиндров различных моделей.",
            "tips": "Перед покупкой сверьтесь с каталогом совместимости.",
            "warranty": "Гарантия 6 месяцев",
            "care": "Хранить в сухом месте.",
            "model_name": "Комплектующие для спецтехники",
            "product_type": "Комплектующие",
            "created_at": date.today() - timedelta(days=4),
        },
        {
            "name": "Манжеты и уплотнения",
            "image_key": "cuffs",
            "fits": "DN 40-200 мм, все типоразмеры",
            "short_description": "Для гидроцилиндров разных моделей",
            "price_display": "от 500 ₽",
            "price_amount": 500,
            "purpose": "Для герметизации гидроцилиндров разных моделей.",
            "tips": "Рекомендуется менять при каждом ремонте.",
            "warranty": "Гарантия 3 месяца",
            "care": "Беречь от прямых солнечных лучей.",
            "model_name": "Манжеты и уплотнения",
            "product_type": "Уплотнения",
            "created_at": date.today() - timedelta(days=2),
        },
    ]
    for item in products:
        Product.objects.update_or_create(name=item["name"], defaults=item)

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
        RepairService.objects.update_or_create(name=item["name"], defaults=item)
