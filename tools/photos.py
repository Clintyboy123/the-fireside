"""Exports the restaurant's photos as WebP for the site and writes frontend/src/content/photos.json.

Usage:  python3 tools/photos.py <folder with the original photos>
Edit CAST below to change which photo goes where. Each output exists at two widths: -800 and -1600
(or the original width when the photo is smaller than 1600px; nothing is upscaled).
"""
import json, os, sys
from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'frontend', 'src', 'assets', 'photos')
MANIFEST = os.path.join(HERE, '..', 'frontend', 'src', 'content', 'photos.json')

# key: (source file id, alt text, kind, in gallery?)
CAST = {
    'hero': ('16.00.08_b8e0d718', 'The Fireside garden at night: guests at long tables under stretch tents and string lights', 'venue', False),
    'story': ('13.40.29_ed68dcf9', 'Logs burning in the fire pit', 'venue', False),
    'menu-hero': ('13.40.24_15f47a1b', 'A hand-rolled pizza on a wooden board', 'food', False),
    'menu-tapas': ('15.59.59_51cfe3ff', 'Garlic butter and parmesan escargots', 'food', False),
    'menu-grills': ('13.40.24_caf19437', 'A T-bone steak with rustic chips and sauce', 'food', False),
    'menu-pizza': ('13.40.23_3b14c1b4', 'A guest reaching for a pizza topped with fresh basil', 'food', False),
    'menu-kitchen': ('13.40.22_6c013a23', 'A plate of creamy pasta carried to the table', 'food', False),
    'menu-desserts': ('13.40.27_83701085', 'Chocolate brownie with ice cream and berries', 'food', False),
    'menu-drinks': ('13.40.32_c81ba2af', 'Two colourful cocktails on the deck', 'drink', False),
    'sig-alfredo': ('13.40.23_b0faa4fc', 'Creamy fettuccine pasta with fresh herbs', 'food', False),
    'sig-pizza': ('13.40.15_0bf5ce88', 'A pizza with tzatziki and rocket served on a wooden board', 'food', False),
    'sig-breakfast': ('13.40.33_96b332e3', 'A full breakfast with fried eggs, bacon and relish', 'food', False),
    'sig-platter': ('16.00.30_5351c8f7', 'A sharing board of ribs, grillers and chips', 'food', False),
    'venue': ('16.00.09_c6b55729', 'A long table dressed with candles and greenery for an event', 'venue', False),
    'story-hero': ('13.40.25_38dee997', 'Friends raising a toast at a table in the garden', 'people', False),
    'story-kids': ('15.53.35_13a939d9', 'Three children sitting by the fire at night', 'people', False),
    'story-table': ('16.00.23_0369762c', 'A long table set with eucalyptus, candles and white linen', 'venue', False),
    'g-wine': ('13.40.15_beb0b157', 'Red wine poured into a glass on a timber table', 'drink', True),
    'g-burger': ('13.40.16_e7e7102a', 'A burger stacked with onion rings and chips', 'food', True),
    'g-bar': ('13.40.19_111846aa', 'Friends toasting at the bar', 'people', True),
    'g-lounge': ('13.40.26_f75cd159', 'The lounge under the tent with sofas and plants', 'venue', True),
    'g-cocktail': ('13.40.20_7941efb3', 'A guest holding a frozen cocktail with orange and mint', 'drink', True),
    'g-pizza': ('13.40.36_57ad7486', 'A pizza topped with fresh basil leaves', 'food', True),
    'g-couple': ('13.40.28_f6f2dbd8', 'A couple sharing a laugh over drinks', 'people', True),
    'g-firepit': ('13.40.40_e42f728d', 'The fire pit lit in the garden at night', 'venue', True),
    'g-burger2': ('13.40.34_671545b8', 'A burger with sweet potato fries', 'food', True),
    'g-interior': ('13.40.17_37e5d0b3', 'The bar inside The Fireside', 'venue', True),
    'g-friends': ('13.40.37_db6d09fb', 'Two friends laughing over cocktails', 'people', True),
    'g-pizzawine': ('13.40.29_21a5f044', 'Pizza and a glass of red wine', 'food', True),
    'g-service': ('13.40.31_68307fd7', 'A smiling waitress carrying drinks', 'people', True),
    'g-sangria': ('13.40.38_af6d62af', 'A jug cocktail with orange slices', 'drink', True),
    'g-garden': ('13.40.28_b9c0dd9a', 'Guests in the garden under the umbrellas', 'venue', True),
    'g-steakegg': ('13.40.19_5ba44760', 'Steak and egg with chips', 'food', True),
    'g-sundowner': ('13.40.35_720f4c93', 'A guest enjoying a cocktail at her table', 'people', True),
    'g-play': ('13.40.22_6b41c128', 'A girl jumping on the trampoline in the play area', 'people', True),
}


def main(src):
    os.makedirs(OUT, exist_ok=True)
    for old in os.listdir(OUT):
        if old.endswith('.webp'):
            os.remove(os.path.join(OUT, old))
    manifest = {}
    for key, (file_id, alt, kind, gallery) in CAST.items():
        path = os.path.join(src, f'WhatsApp_Image_2025-02-17_at_{file_id}.jpg')
        im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
        w, h = im.size
        for target, suffix in ((800, '800'), (1600, '1600')):
            size = min(target, w)
            out = im if size == w else im.resize((size, round(h * size / w)), Image.LANCZOS)
            out.save(os.path.join(OUT, f'{key}-{suffix}.webp'), 'WEBP', quality=80, method=6)
        manifest[key] = {'file': key, 'width': w, 'height': h, 'alt': alt, 'kind': kind, 'gallery': gallery}
    with open(MANIFEST, 'w') as f:
        json.dump(manifest, f, indent=2)
    print(len(manifest), 'photos exported')


if __name__ == '__main__':
    main(sys.argv[1])
