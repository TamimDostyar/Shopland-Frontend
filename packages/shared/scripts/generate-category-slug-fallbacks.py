#!/usr/bin/env python3
"""Generate packages/shared/src/i18n/categorySlugFallbacks.ts — run: python3 generate-category-slug-fallbacks.py > ../src/i18n/categorySlugFallbacks.ts"""


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


# Top-level departments (slug matches Django slugify of parent name in seed_categories.py)
PARENTS: dict[str, tuple[str, str]] = {
    "electronics": ("الکترونیک", "برېښناییک"),
    "clothing-fashion": ("مد و پوشاک", "جامو او فېشن"),
    "home-kitchen": ("خانه و آشپزخانه", "کور او پخلنځی"),
    "sports-outdoors": ("ورزش و فضای باز", "لوبې او بهرنۍ"),
    "toys-games": ("اسباب‌بازی و بازی", "لوبې او ساتیري"),
    "beauty-personal-care": ("زیبایی و مراقبت شخصی", "ښکلا او شخصي پاملرنه"),
    "health-wellness": ("سلامت و تندرستی", "روغتیا او هوساینه"),
    "grocery-food": ("مواد غذایی", "خواړه او خوړونکی"),
    "automotive": ("خودرو", "موټر"),
    "books-music-movies": ("کتاب، موسیقی و فیلم", "کتاب، موسیقي او فلم"),
    "office-school-supplies": ("اداری و مدرسه", "دفتر او ښوونځي"),
    "pet-supplies": ("لوازم حیوان خانگی", "د څارویو توکي"),
    "baby-kids": ("نوزاد و کودک", "ماشوم او نوي زیږیدلي"),
    "arts-crafts-sewing": ("هنر، صنایع دستی و خیاطی", "هنر، لاسي صنایع او ګنډل"),
    "musical-instruments": ("آلات موسیقی", "موسیقي وسایل"),
    "tools-home-improvement": ("ابزار و نوسازی خانه", "اوزار او کور سمون"),
    "garden-outdoor": ("باغ و فضای باز", "باغ او بهرنی"),
    "industrial-scientific": ("صنعتی و علمی", "صنعتي او ساینسي"),
}

# slug -> (fa, ps); matches seed_categories.py children. Second "Video Games" (Books) → video-games-2 in DB.
TRANSLATIONS: dict[str, tuple[str, str]] = {
    # Electronics
    "smartphones-tablets": ("گوشی هوشمند و تبلت", "سمارټ فون او ټپلیټونه"),
    "computers-laptops": ("رایانه و لپ‌تاپ", "کمپیوټر او لپټاپ"),
    "tv-home-theater": ("تلویزیون و سینمای خانگی", "ټي وي او کورنۍ تیاتر"),
    "audio-headphones": ("صوتی و هدفون", "آډیو او هیډفون"),
    "cameras-photography": ("دوربین و عکاسی", "کیمره او عکاسي"),
    "video-games-consoles": ("بازی‌های ویدیویی و کنسول", "ویډیو لوبې او کنسولونه"),
    "wearable-technology": ("فناوری پوشیدنی", "د ځان په اړه ټیکنالوژي"),
    "smart-home-devices": ("دستگاه‌های هوشمند خانگی", "سمارټ کور وسایل"),
    "computer-accessories": ("لوازم جانبی رایانه", "د کمپیوټر لوازم"),
    "batteries-chargers": ("باتری و شارژر", "بیټرۍ او چارجرونه"),
    "networking-wi-fi": ("شبکه و وای‌فای", "نیټورک او وای فای"),
    "drones-rc-aircraft": ("پهپاد و هواپیمای کنترلی", "ډرون او کنټرول الوتکې"),
    # Clothing & Fashion
    "mens-clothing": ("پوشاک مردانه", "د نارینه جامې"),
    "womens-clothing": ("پوشاک زنانه", "د ښځو جامې"),
    "kids-clothing": ("پوشاک کودک", "د ماشومانو جامې"),
    "baby-clothing": ("پوشاک نوزاد", "د نوي زیږیدلي جامې"),
    "shoes-footwear": ("کفش و پای‌پوش", "بوټان او پښې پوښ"),
    "bags-luggage": ("کیف و چمدان", "کڅوړې او سامان"),
    "jewelry-accessories": ("جواهر و اکسسوری", "زیورات او لوازم"),
    "watches": ("ساعت", "ساعتونه"),
    "sportswear-activewear": ("لباس ورزشی", "د لوبو جامې"),
    "underwear-sleepwear": ("لباس زیر و خواب", "دننی جامې او د خوب جامې"),
    "traditional-cultural-wear": ("پوشاک سنتی و فرهنگی", "دودیز او کلتوري جامې"),
    # Home & Kitchen
    "furniture": ("مبلمان", "فرنیچر"),
    "bedding-bath": ("رختخواب و حمام", "د خوب او حمام توکي"),
    "kitchen-dining": ("آشپزخانه و غذاخوری", "پخلنځی او میز"),
    "home-decor": ("دکوراسیون منزل", "د کور ښکلا"),
    "storage-organization": ("ذخیره‌سازی و نظم", "ساتل او تنظیم"),
    "lighting-ceiling-fans": ("روشنایی و پنکه سقفی", "رڼا او سقفي پنکې"),
    "large-appliances": ("لوازم بزرگ خانگی", "لوی کورنی وسایل"),
    "small-kitchen-appliances": ("لوازم کوچک آشپزخانه", "وړې پخلنځي وسایل"),
    "cleaning-supplies": ("مواد پاک‌کننده", "پاکولو توکي"),
    "curtains-window-treatments": ("پرده و تزئین پنجره", "پردې او کړکۍ"),
    "rugs-carpets": ("فرش و قالی", "غالۍ او فرشونه"),
    "wall-art-frames": ("تابلو و قاب", "دیوال انځورونه او چوکاټونه"),
    # Sports & Outdoors
    "exercise-fitness": ("ورزش و تناسب اندام", "ورزش او فټنس"),
    "outdoor-recreation": ("تفریحات فضای باز", "بهرني تفریحات"),
    "team-sports": ("ورزش‌های تیمی", "ټیمي لوبې"),
    "water-sports": ("ورزش‌های آبی", "د اوبو لوبې"),
    "cycling": ("دوچرخه‌سواری", "بایسکل"),
    "hunting-fishing": ("شکار و ماهیگیری", "صید او کب نیول"),
    "yoga-pilates": ("یوگا و پیلاتس", "یوګا او پیلاتس"),
    "camping-hiking": ("کمپینگ و کوهنوردی", "کیمپ او غر ته تګ"),
    "winter-sports": ("ورزش‌های زمستانی", "ژمی لوبې"),
    "racket-sports": ("ورزش‌های راکتی", "راکټ لوبې"),
    # Toys & Games
    "action-figures-collectibles": ("اکشن فیگور و کلکسیونی", "اکشن فیګر او ټولګې"),
    "building-sets-blocks": ("ساختنی و بلوک", "جوړونکي او بلوکونه"),
    "board-games-puzzles": ("بردگیم و پازل", "بورډ لوبې او پازل"),
    "dolls-accessories": ("عروسک و لوازم", "عروسکونه او لوازم"),
    "educational-toys": ("اسباب‌بازی آموزشی", "زده‌کړې لوبې"),
    "rc-vehicles-drones": ("ماشین و پهپاد کنترلی", "کنټرول موټر او ډرون"),
    "arts-crafts-for-kids": ("هنر و صنایع دستی کودک", "د ماشومانو هنر او لاسي کار"),
    "outdoor-play": ("بازی فضای باز", "بهرني لوبې"),
    "baby-toddler-toys": ("اسباب‌بازی نوزاد و کودک", "د نوي زیږیدلي لوبې"),
    "video-games": ("بازی‌های ویدیویی", "ویډیو لوبې"),
    # Beauty & Personal Care
    "skin-care": ("مراقبت پوست", "د پوست پاملرنه"),
    "hair-care": ("مراقبت مو", "د ویښتو پاملرنه"),
    "makeup-cosmetics": ("آرایش و لوازم آرایشی", "میک اپ او آرایش"),
    "fragrances-perfumes": ("عطر و ادکلن", "عطرونه"),
    "oral-care": ("بهداشت دهان", "د خولې پاملرنه"),
    "shaving-hair-removal": ("اصلاح و حذف مو", "ګیډه او ویښتې لرې کول"),
    "personal-hygiene": ("بهداشت شخصی", "شخصي پاکوالي"),
    "mens-grooming": ("آرایش و مراقبت مردانه", "د نارینه پاملرنه"),
    "nail-care": ("مراقبت ناخن", "د ناخنو پاملرنه"),
    "sunscreen-tanning": ("ضدآفتاب و برنزه‌کننده", "لمر ضد او ټان"),
    # Health & Wellness
    "vitamins-supplements": ("ویتامین و مکمل", "ویټامینونه او مکملونه"),
    "medical-devices-equipment": ("تجهیزات پزشکی", "طبي وسایل"),
    "first-aid-safety": ("کمک‌های اولیه و ایمنی", "لومړنۍ مرسته او خوندیتوب"),
    "diet-nutrition": ("رژیم و تغذیه", "رژیم او تغذیه"),
    "eye-care": ("مراقبت چشم", "د سترګو پاملرنه"),
    "sexual-wellness": ("سلامت جنسی", "جنسي روغتیا"),
    "mobility-daily-living-aids": ("وسایل تحرک و زندگی روزمره", "حرکت او ورځني مرستې"),
    "mental-health-relaxation": ("سلامت روان و آرامش", "ذهني روغتیا او آرامي"),
    # Grocery & Food
    "snacks-sweets": ("تنقلات و شیرینی", "خواړې او خواږې"),
    "beverages-drinks": ("نوشیدنی‌ها", "څښاکونه"),
    "pantry-staples": ("مواد پایه آشپزخانه", "د پخلنځي اساسي توکي"),
    "organic-natural-foods": ("غذای ارگانیک و طبیعی", "ارګانیک او طبیعي خواړه"),
    "fresh-frozen-foods": ("تازه و منجمد", "تازه او یخ شوي"),
    "baby-food-formula": ("غذای نوزاد و شیر خشک", "د ماشوم خواړه"),
    "cooking-oils-condiments": ("روغن و چاشنی", "غوړ او مسالې"),
    "bread-bakery": ("نان و شیرینی‌پزی", "ډوډی او بیکري"),
    "dairy-eggs": ("لبنیات و تخم‌مرغ", "شید او هګۍ"),
    "meat-seafood": ("گوشت و غذای دریایی", "غوښه او سمندري خواړه"),
    "dry-fruits-nuts": ("میوه خشک و آجیل", " وچه میوې او مغزونه"),
    # Automotive
    "car-parts-accessories": ("قطعات و لوازم خودرو", "د موټر برخې او لوازم"),
    "car-electronics": ("الکترونیک خودرو", "د موټر برېښناییک"),
    "car-care-detailing": ("مراقبت و تمیز خودرو", "د موټر پاملرنه"),
    "motorcycle-accessories": ("لوازم موتورسیکلت", "د موټرسایکل لوازم"),
    "tires-wheels": ("لاستیک و رینگ", "ټایر او څرخونه"),
    "truck-suv-accessories": ("لوازم کامیون و شاسی‌بلند", "د ټرک او SUV لوازم"),
    "oils-fluids": ("روغن و مایعات", "غوړ او مایعات"),
    "tools-equipment": ("ابزار و تجهیزات", "اوزار او وسایل"),
    # Books, Music & Movies (video-games second occurrence → video-games-2 in DB)
    "books": ("کتاب‌ها", "کتابونه"),
    "textbooks-education": ("کتاب درسی و آموزشی", "درسي کتابونه"),
    "music-cds-vinyl": ("سی‌دی موسیقی و وینیل", "موسیقي CD او وینیل"),
    "movies-tv-shows": ("فیلم و سریال", "فلمونه او سریالونه"),
    "video-games-2": ("بازی‌های ویدیویی", "ویډیو لوبې"),
    "musical-scores-songbooks": ("نت موسیقی و آهنگ", "موسیقي نتونه او سندرې"),
    # Office & School Supplies
    "office-supplies": ("لوازم اداری", "دفتر لوازم"),
    "printers-ink-toner": ("چاپگر و جوهر", "پرنټر او انک"),
    "writing-drawing-supplies": ("نوشتن و طراحی", "لیکلو او انځورولو توکي"),
    "office-furniture": ("مبلمان اداری", "دفتر فرنیچر"),
    "school-supplies": ("لوازم مدرسه", "ښوونځي لوازم"),
    "filing-storage": ("بایگانی و ذخیره", "فایل او ساتل"),
    "presentation-signage": ("ارائه و تابلو", "پریزنټیشن او نښې"),
    # Pet Supplies
    "dog-supplies": ("لوازم سگ", "د سپي توکي"),
    "cat-supplies": ("لوازم گربه", "د پیشو توکي"),
    "fish-aquatics": ("ماهی و آکواریوم", "کب او اوبه"),
    "bird-supplies": ("لوازم پرنده", "د مرغۍ توکي"),
    "small-animal-supplies": ("لوازم حیوان کوچک", "وړو څارویو توکي"),
    "reptile-supplies": ("لوازم خزنده", "د خزندو توکي"),
    "pet-food": ("غذای حیوان خانگی", "د څارویو خواړه"),
    "pet-health-grooming": ("سلامت و آرایش حیوان", "د څارویو روغتیا او پاملرنه"),
    # Baby & Kids
    "baby-gear-travel": ("تجهیزات نوزاد و سفر", "د ماشوم او سفر وسایل"),
    "diapers-wipes": ("پوشک و دستمال", "پوشک او ټوټکې"),
    "baby-feeding": ("تغذیه نوزاد", "د ماشوم خوراک"),
    "baby-monitors-safety": ("مانیتور و ایمنی نوزاد", "مانیټر او خوندیتوب"),
    "nursery-furniture": ("مبلمان اتاق نوزاد", "د ماشوم خونې فرنیچر"),
    "kids-furniture-storage": ("مبلمان و نظم کودک", "د ماشوم فرنیچر او ساتل"),
    "baby-bath-skin-care": ("حمام و مراقبت پوست نوزاد", "حمام او پوست پاملرنه"),
    # Arts, Crafts & Sewing
    "painting-drawing": ("نقاشی و طراحی", "انځور او انځورګري"),
    "craft-supplies": ("صنایع دستی", "لاسي صنایع"),
    "sewing-quilting-knitting": ("خیاطی، تکه‌دوزی و بافندگی", "ګنډل، کویلټ او بافت"),
    "scrapbooking-card-making": ("آلبوم و کارت‌سازی", "سکراپ بک او کارتونه"),
    "party-supplies-decorations": ("لوازم جشن و تزئین", "د میټینګ توکي"),
    "holiday-seasonal-decor": ("دکور تعطیلات و فصلی", "د رخصتۍ ښکلا"),
    "beading-jewelry-making": ("مهره‌دوزی و جواهرسازی", "دانې او زیور جوړول"),
    # Musical Instruments
    "guitars-strings": ("گیتار و سیم", "ګیټار او تارونه"),
    "keyboards-pianos": ("کیبورد و پیانو", "کیبورډ او پیانو"),
    "drums-percussion": ("درام و کوبه", "ډرم او ضربي"),
    "wind-brass-instruments": ("سازهای بادی و بوقی", "باد او برنجي الوتونکي"),
    "dj-recording-equipment": ("دی‌جی و ضبط", "DJ او ریکارډ"),
    "stage-studio-equipment": ("صحنه و استودیو", "سټیج او سټوډیو"),
    "music-accessories": ("لوازم موسیقی", "موسیقي لوازم"),
    # Tools & Home Improvement
    "power-tools": ("ابزار برقی", "بریښنايي اوزار"),
    "hand-tools": ("ابزار دستی", "لاسي اوزار"),
    "electrical-supplies": ("تأسیسات برقی", "برېښنايي توکي"),
    "plumbing": ("لوله‌کشی", "پلنبنګ"),
    "paint-painting-supplies": ("رنگ و نقاشی", "رنګ او انځورګري"),
    "hardware": ("یراق‌آلات", "هارډویر"),
    "building-materials": ("مصالح ساختمانی", "د جوړولو توکي"),
    "safety-equipment": ("تجهیزات ایمنی", "خوندیتوب وسایل"),
    "ladders-scaffolding": ("نردبان و داربست", "پلونه او داربست"),
    # Garden & Outdoor
    "garden-tools-equipment": ("ابزار باغ", "د باغ اوزار"),
    "plants-seeds-bulbs": ("گیاه، بذر و پیازک", "بوټي، تخم او پیازک"),
    "outdoor-furniture": ("مبلمان فضای باز", "بهرني فرنیچر"),
    "grills-bbq": ("باربیکیو و کبابی", "ګریل او باربیکیو"),
    "pool-spa": ("استخر و اسپا", "لوی او سپا"),
    "lawn-mowers-tractors": ("چمن‌زن و تراکتور", "چمن او ټراکټر"),
    "pest-control": ("کنترل آفات", "حشراتو کنټرول"),
    "watering-irrigation": ("آبیاری", "اوبه ورکول"),
    "outdoor-lighting": ("روشنایی فضای باز", "بهرني رڼا"),
    # Industrial & Scientific
    "lab-scientific-equipment": ("تجهیزات آزمایشگاهی", "لابراتوار وسایل"),
    "safety-security": ("ایمنی و امنیت", "خوندیتوب او امنیت"),
    "industrial-tools": ("ابزار صنعتی", "صنعتي اوزار"),
    "janitorial-sanitation": ("نظافت و بهداشت صنعتی", "پاکول او روغتیا"),
    "packaging-shipping": ("بسته‌بندی و حمل", "بسته‌بندي او لیږد"),
    "electrical-test-equipment": ("تجهیزات تست برقی", "د برېښنا ازموینه"),
}

HEADER = '''import type { Locale } from "../types";

/**
 * When the API leaves name_fa / name_ps empty, map known category slugs to labels.
 * Slugs match Django slugify (seed_categories). Duplicate names get numeric suffixes
 * (e.g. second "Video Games" → video-games-2).
 */
'''

if __name__ == "__main__":
    overlap = set(PARENTS) & set(TRANSLATIONS)
    if overlap:
        raise SystemExit(f"PARENTS and TRANSLATIONS overlap: {overlap}")
    merged = {**PARENTS, **TRANSLATIONS}
    print(HEADER)
    print("const FA_BY_SLUG: Record<string, string> = {")
    for slug in sorted(merged.keys()):
        print(f'  "{slug}": "{esc(merged[slug][0])}",')
    print("};")
    print()
    print("const PS_BY_SLUG: Record<string, string> = {")
    for slug in sorted(merged.keys()):
        print(f'  "{slug}": "{esc(merged[slug][1])}",')
    print("};")
    print()
    print(
        """/**
 * Localized label for a category slug when API omits name_fa / name_ps.
 */
export function categorySlugFallback(slug: string | undefined, locale: Locale): string | null {
  if (!slug || locale === "en") return null;
  const map = locale === "fa" ? FA_BY_SLUG : locale === "ps" ? PS_BY_SLUG : null;
  if (!map) return null;
  return map[slug] ?? null;
}
"""
    )
