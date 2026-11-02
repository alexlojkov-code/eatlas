/* Eatlas — узбекские названия разделов каталога (латиница).
   Порядок CATS и TAGS совпадает с cats/tags в catalog-data.js; названия самих блюд пока берутся из русского. */
const UZ_CATALOG = {
  // id группы → [название, регион]
  groups: {
    uzbek: ['O‘zbek oshxonasi', 'O‘rta Osiyo'], kazakh: ['Qozoq oshxonasi', 'O‘rta Osiyo'], kyrgyz_tajik: ['Qirg‘iz va tojik oshxonasi', 'O‘rta Osiyo'],
    uyghur_dungan: ['Uyg‘ur va dungan oshxonasi', 'O‘rta Osiyo / Xitoy'], russian: ['Rus oshxonasi', 'Sharqiy Yevropa'],
    ukrainian_belarusian: ['Ukrain va belarus oshxonasi', 'Sharqiy Yevropa'], georgian: ['Gruzin oshxonasi', 'Kavkaz'], armenian: ['Arman oshxonasi', 'Kavkaz'],
    azerbaijani: ['Ozarbayjon oshxonasi', 'Kavkaz'], caucasus_north: ['Shimoliy Kavkaz (Dog‘iston, Osetiya, Chechenya, Kabarda)', 'Kavkaz'],
    tatar_bashkir: ['Tatar va boshqird oshxonasi', 'Volgabo‘yi'], korean: ['Koreys oshxonasi', 'Sharqiy Osiyo'], japanese: ['Yapon oshxonasi', 'Sharqiy Osiyo'],
    chinese: ['Xitoy oshxonasi', 'Sharqiy Osiyo'], thai: ['Tay oshxonasi', 'Janubi-Sharqiy Osiyo'], vietnamese: ['Vyetnam oshxonasi', 'Janubi-Sharqiy Osiyo'],
    se_asia_other: ['Indoneziya, Malayziya, Singapur, Filippin oshxonalari', 'Janubi-Sharqiy Osiyo'], indian: ['Hind va pokiston oshxonasi', 'Janubiy Osiyo'],
    middle_east: ['Yaqin Sharq (livan, suriya, isroil, arab)', 'Yaqin Sharq'], turkish: ['Turk oshxonasi', 'Yaqin Sharq'], iranian_afghan: ['Eron va afg‘on oshxonasi', 'Yaqin Sharq'],
    italian: ['Italyan oshxonasi', 'G‘arbiy Yevropa'], french: ['Fransuz oshxonasi', 'G‘arbiy Yevropa'], spanish_portuguese: ['Ispan va portugal oshxonasi', 'G‘arbiy Yevropa'],
    greek: ['Yunon oshxonasi', 'Janubiy Yevropa'], german_central: ['Nemis, avstriya, shveytsariya, chex, polyak, venger oshxonalari', 'Markaziy Yevropa'],
    british_irish_nordic: ['Britaniya, irland, skandinaviya oshxonalari', 'Shimoliy Yevropa'], american: ['Amerika oshxonasi', 'Shimoliy Amerika'],
    latin_american: ['Meksika va Lotin Amerikasi oshxonasi', 'Lotin Amerikasi'], african: ['Afrika oshxonasi', 'Afrika'],
    poke_healthy: ['Boullar va sog‘lom ovqatlanish', 'Xalqaro'], breakfast_world: ['Nonushtalar (xalqaro)', 'Xalqaro'],
    snacks: ['Gazaklar, sneklar va ko‘cha taomlari', 'Xalqaro'], sauces: ['Souslar va qo‘shimchalar', 'Xalqaro'], drinks: ['Ichimliklar', 'Xalqaro'],
  },
  cats: ['Asosiy taomlar', 'Grill va shashlik', 'Sho‘rvalar', 'Pishiriqlar va non', 'Salatlar va gazaklar', 'Desertlar va shirinliklar', 'Pishiriqlar va gazaklar', 'Gazaklar',
    'Nonushtalar', 'Salatlar', 'Sovuq gazaklar', 'Garnirlar', 'Pishiriqlar', 'Desertlar', 'Taomlar', 'Xachapuri va pishiriqlar', 'Souslar va desertlar',
    'Gazaklar (panchan va koreyscha salatlar)', 'Ko‘cha taomlari va desertlar', 'Sushi va rollar', 'Issiq taomlar', 'Sho‘rvalar va gazaklar', 'Karri va asosiy taomlar',
    'Non va gazaklar', 'Desertlar va ichimliklar', 'Meze va gazaklar', 'Pitsa', 'Pasta', 'Asosiy taomlar va rizotto', 'Gazaklar va salatlar', 'Pishiriqlar va desertlar',
    'Taomlar va tapas', 'Burgerlar', 'Asosiy taomlar va grill', 'Garnirlar va gazaklar', 'Nonushtalar va desertlar', 'Meksika va Tex-Mex', 'Janubiy Amerika va Karib havzasi',
    'Boullar va salatlar', 'Parhez va sog‘lom taomlar', 'Shaurma, kabob, lavashdagi rollar', 'Xot-doglar va sosiskalar', 'Sendvichlar va buterbrodlar',
    'Yo‘l-yo‘lakay pirojki va pishiriqlar', 'Tovuq va kartoshka', 'Pivo uchun gazaklar', 'Chipslar va qadoqlangan sneklar', 'Shirin gazaklar', 'Muzqaymoq va sovuq desertlar',
    'Sutli va yengil gazaklar', 'Kombo va bolalar menyusi', 'Souslar', 'Qahva', 'Choy', 'Alkogolsiz sovuq ichimliklar', 'Sharbatlar, smuzi, kokteyllar', 'Pivo va kam alkogolli',
    'Vino', 'Shampan vinolari', 'Kuchli ichimliklar', 'Likyorlar va aperitivlar', 'Kokteyllar', 'Alkogolsiz kokteyllar (moktellar)'],
  tags: ['baliq', 'ot go‘shti', 'tovuq', 'tofu/veg', 'qo‘y go‘shti', 'mol go‘shti', 'cho‘chqa go‘shti', 'shirin', 'pishloq', 'achchiq', 'dengiz mahsulotlari', 'qo‘ziqorin'],
  // коды стран для кухонь из основной базы (js/dishes.js)
  countries: {
    RU: 'Rossiya', UA: 'Ukraina', BY: 'Belarus', UZ: 'O‘zbekiston', KZ: 'Qozog‘iston', GE: 'Gruziya', AM: 'Armaniston', AZ: 'Ozarbayjon',
    IT: 'Italiya', FR: 'Fransiya', ES: 'Ispaniya', GR: 'Gretsiya', TR: 'Turkiya', LB: 'Livan', IL: 'Isroil', IN: 'Hindiston',
    CN: 'Xitoy', JP: 'Yaponiya', KR: 'Koreya', TH: 'Tailand', VN: 'Vyetnam', ID: 'Indoneziya', MX: 'Meksika', US: 'AQSh',
    GB: 'Buyuk Britaniya', DE: 'Germaniya', AT: 'Avstriya', HU: 'Vengriya', PL: 'Polsha', SE: 'Shvetsiya', BR: 'Braziliya', AR: 'Argentina',
    PE: 'Peru', VE: 'Venesuela', MA: 'Marokash', NG: 'Nigeriya', ET: 'Efiopiya', CA: 'Kanada',
  },
};
