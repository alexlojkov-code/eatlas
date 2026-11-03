"""Собирает js/catalog-data.js из data/food_catalog/catalog.json.

Запуск: python3 scripts/build_catalog.py
В файл попадают только нужные сайту поля, в компактном виде:
  CATALOG.groups — [id, название, регион, тип, название en, регион en]
  CATALOG.cats   — названия категорий
  CATALOG.tags   — список тегов (в позиции — битовая маска)
  CATALOG.items  — [индекс группы, индекс категории, название, флаги, маска тегов, id]
     флаги: 1 — алкоголь (18+)
  CATALOG.nut    — состав из nutrition.json (scripts/enrich_catalog.mjs), параллельно items; 0 — нет данных:
     [ккал, белки, жиры, углеводы, клетчатка, сахар, нас. жиры, натрий, холестерин,
      порция, флаги, маска аллергенов, уверенность %, английское название]
     флаги: 1 — мл, 2 — вегетарианское, 4 — веганское, 8 — свинина, 16 — алкоголь в составе
  CATALOG.allergens — список аллергенов для маски
  CATALOG.cats_en, CATALOG.tags_en — английские названия категорий и тегов (параллельно cats, tags)
  CATALOG.uz     — узбекские названия блюд из data/food_catalog/names_uz.json, параллельно items; '' — нет перевода
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / 'food_catalog' / 'catalog.json'
OUT = ROOT / 'js' / 'catalog-data.js'
NUT = ROOT / 'data' / 'food_catalog' / 'nutrition.json'
UZ = ROOT / 'data' / 'food_catalog' / 'names_uz.json'
KEYS = ['kcal', 'protein_g', 'fat_g', 'carbs_g', 'fiber_g', 'sugar_g', 'sat_fat_g', 'sodium_mg', 'cholesterol_mg']
ALLERGENS = ['gluten', 'milk', 'eggs', 'fish', 'crustaceans', 'molluscs', 'peanuts', 'tree_nuts', 'soy', 'sesame', 'celery', 'mustard', 'sulphites']

data = json.loads(SRC.read_text(encoding='utf-8'))
items = data['items']

groups, group_idx = [], {}
cats, cat_idx = [], {}
tags = []
for it in items:
    if it['cuisine_id'] not in group_idx:
        group_idx[it['cuisine_id']] = len(groups)
        groups.append([it['cuisine_id'], it['cuisine'], it['region'], it['type']])
    if it['category'] not in cat_idx:
        cat_idx[it['category']] = len(cats)
        cats.append(it['category'])
    for t in it['tags']:
        if t not in tags:
            tags.append(t)

rows = []
for it in items:
    mask = 0
    for t in it['tags']:
        mask |= 1 << tags.index(t)
    flags = 1 if (it['is_alcoholic'] or it['age_restricted']) else 0
    short_id = it['id'].split('__', 1)[1] if '__' in it['id'] else it['id']
    rows.append([group_idx[it['cuisine_id']], cat_idx[it['category']], it['name'], flags, mask, short_id])

# английские названия групп, регионов, категорий и тегов для интерфейса на английском
GROUPS_EN = {
    'uzbek': 'Uzbek', 'kazakh': 'Kazakh', 'kyrgyz_tajik': 'Kyrgyz and Tajik', 'uyghur_dungan': 'Uyghur and Dungan',
    'russian': 'Russian', 'ukrainian_belarusian': 'Ukrainian and Belarusian', 'georgian': 'Georgian', 'armenian': 'Armenian',
    'azerbaijani': 'Azerbaijani', 'caucasus_north': 'North Caucasus (Dagestan, Ossetia, Chechnya, Kabarda)',
    'tatar_bashkir': 'Tatar and Bashkir', 'korean': 'Korean', 'japanese': 'Japanese', 'chinese': 'Chinese', 'thai': 'Thai',
    'vietnamese': 'Vietnamese', 'se_asia_other': 'Indonesian, Malaysian, Singaporean, Filipino', 'indian': 'Indian and Pakistani',
    'middle_east': 'Middle Eastern (Lebanese, Syrian, Israeli, Arab)', 'turkish': 'Turkish', 'iranian_afghan': 'Iranian and Afghan',
    'italian': 'Italian', 'french': 'French', 'spanish_portuguese': 'Spanish and Portuguese', 'greek': 'Greek',
    'german_central': 'German, Austrian, Swiss, Czech, Polish, Hungarian', 'british_irish_nordic': 'British, Irish, Nordic',
    'american': 'American', 'latin_american': 'Mexican and Latin American', 'african': 'African',
    'poke_healthy': 'Bowls and healthy eating', 'breakfast_world': 'Breakfasts (international)',
    'snacks': 'Snacks and street food', 'sauces': 'Sauces and extras', 'drinks': 'Drinks',
}
REGIONS_EN = {
    'Средняя Азия': 'Central Asia', 'Средняя Азия / Китай': 'Central Asia / China', 'Восточная Европа': 'Eastern Europe',
    'Кавказ': 'Caucasus', 'Поволжье': 'Volga region', 'Восточная Азия': 'East Asia', 'Юго-Восточная Азия': 'Southeast Asia',
    'Южная Азия': 'South Asia', 'Ближний Восток': 'Middle East', 'Западная Европа': 'Western Europe', 'Южная Европа': 'Southern Europe',
    'Центральная Европа': 'Central Europe', 'Северная Европа': 'Northern Europe', 'Северная Америка': 'North America',
    'Латинская Америка': 'Latin America', 'Африка': 'Africa', 'Интернациональная': 'International',
}
CATS_EN = {
    'Основные блюда': 'Main dishes', 'Гриль и шашлык': 'Grill and kebabs', 'Супы': 'Soups', 'Выпечка и хлеб': 'Pastries and bread',
    'Салаты и закуски': 'Salads and starters', 'Десерты и сладости': 'Desserts and sweets', 'Выпечка и закуски': 'Pastries and starters',
    'Закуски': 'Starters', 'Завтраки': 'Breakfasts', 'Салаты': 'Salads', 'Холодные закуски': 'Cold starters', 'Гарниры': 'Sides',
    'Выпечка': 'Pastries', 'Десерты': 'Desserts', 'Блюда': 'Dishes', 'Хачапури и выпечка': 'Khachapuri and pastries',
    'Соусы и десерты': 'Sauces and desserts', 'Закуски (панчхан и «по-корейски»)': 'Starters (banchan and Korean-style salads)',
    'Уличная еда и десерты': 'Street food and desserts', 'Суши и роллы': 'Sushi and rolls', 'Горячие блюда': 'Hot dishes',
    'Супы и закуски': 'Soups and starters', 'Карри и основные блюда': 'Curries and mains', 'Хлеб и закуски': 'Bread and starters',
    'Десерты и напитки': 'Desserts and drinks', 'Мезе и закуски': 'Meze and starters', 'Пицца': 'Pizza', 'Паста': 'Pasta',
    'Основные блюда и ризотто': 'Mains and risotto', 'Закуски и салаты': 'Starters and salads', 'Выпечка и десерты': 'Pastries and desserts',
    'Блюда и тапас': 'Dishes and tapas', 'Бургеры': 'Burgers', 'Основные блюда и гриль': 'Mains and grill', 'Гарниры и закуски': 'Sides and starters',
    'Завтраки и десерты': 'Breakfasts and desserts', 'Мексиканская и Tex-Mex': 'Mexican and Tex-Mex', 'Южная Америка и Карибы': 'South America and the Caribbean',
    'Боулы и салаты': 'Bowls and salads', 'ПП и диетические блюда': 'Healthy and diet dishes', 'Шаурма, кебабы, роллы в лаваше': 'Shawarma, kebabs and wraps',
    'Хот-доги и сосиски': 'Hot dogs and sausages', 'Сэндвичи и бутерброды': 'Sandwiches', 'Пирожки и выпечка на ходу': 'Pies and pastries to go',
    'Курица и картофель': 'Chicken and potatoes', 'Снеки к пиву и закуски': 'Beer snacks', 'Чипсы и упакованные снеки': 'Chips and packaged snacks',
    'Сладкие перекусы': 'Sweet snacks', 'Мороженое и холодные десерты': 'Ice cream and frozen desserts', 'Молочные и лёгкие перекусы': 'Dairy and light snacks',
    'Комбо и детское': 'Combos and kids', 'Соусы': 'Sauces', 'Кофе': 'Coffee', 'Чай': 'Tea', 'Безалкогольные холодные напитки': 'Soft drinks',
    'Соки, смузи, шейки': 'Juices, smoothies, shakes', 'Пиво и слабоалкогольные': 'Beer and low-alcohol', 'Вино': 'Wine', 'Игристые': 'Sparkling wine',
    'Крепкие напитки': 'Spirits', 'Ликёры и аперитивы': 'Liqueurs and aperitifs', 'Коктейли': 'Cocktails', 'Безалкогольные коктейли (моктейли)': 'Mocktails',
}
TAGS_EN = {'рыба': 'fish', 'конина': 'horse meat', 'курица': 'chicken', 'тофу/вег': 'tofu/veg', 'баранина': 'lamb', 'говядина': 'beef',
           'свинина': 'pork', 'сладкое': 'sweet', 'сыр': 'cheese', 'острое': 'spicy', 'морепродукты': 'seafood', 'грибы': 'mushrooms'}
for g in groups:
    g += [GROUPS_EN[g[0]], REGIONS_EN[g[2]]]

nut_src = json.loads(NUT.read_text(encoding='utf-8'))['items'] if NUT.exists() else {}
uz_src = json.loads(UZ.read_text(encoding='utf-8'))['items'] if UZ.exists() else {}


def num(v):
    v = round(float(v), 1)
    return int(v) if v == int(v) else v


nut = []
for it in items:
    n = nut_src.get(it['id'])
    if not n:
        nut.append(0)
        continue
    fl = (1 if n['unit'] == 'ml' else 0) | (2 if n['vegetarian'] else 0) | (4 if n['vegan'] else 0) \
        | (8 if n['contains_pork'] else 0) | (16 if n['contains_alcohol'] else 0)
    am = 0
    for a in n['allergens']:
        if a in ALLERGENS:
            am |= 1 << ALLERGENS.index(a)
    nut.append([num(n[k]) for k in KEYS] + [round(n['portion']), fl, am, round(n['confidence'] * 100), n['name_en']])

payload = {
    'version': data['meta'].get('version', '1.0'),
    'groups': groups,
    'cats': cats,
    'tags': tags,
    'items': rows,
    'allergens': ALLERGENS,
    'cats_en': [CATS_EN[c] for c in cats],
    'tags_en': [TAGS_EN[t] for t in tags],
    'nut': nut,
    'uz': [uz_src.get(it['id'], '') for it in items],
}
body = json.dumps(payload, ensure_ascii=False, separators=(',', ':'))
OUT.write_text(
    '/* Сгенерировано scripts/build_catalog.py из data/food_catalog/catalog.json — не править вручную. */\n'
    f'const CATALOG = {body};\n',
    encoding='utf-8',
)
print(f'{OUT.relative_to(ROOT)}: {len(rows)} позиций, с составом {sum(1 for n in nut if n)}, {len(groups)} групп, {len(cats)} категорий, {OUT.stat().st_size // 1024} КБ')
