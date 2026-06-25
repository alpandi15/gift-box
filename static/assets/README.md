# Birthday Gift Hunt Assets

Asset pack untuk game web ulang tahun / romantic treasure hunt tanpa backend.

## Isi Folder

```txt
birthday-gift-hunt-assets/
├── icons/              SVG icon ringan untuk UI
├── illustrations/      PNG/WebP ilustrasi transparan dan scene utama
├── backgrounds/        Background WebP siap pakai
├── prints/             Template kartu QR untuk dicetak
├── design-tokens.json  Warna, font, radius, spacing, shadow
├── design-tokens.css   CSS variables dasar
└── README.md
```

## Cara Pakai di Web

Taruh folder ini ke:

```txt
public/assets/birthday-gift-hunt/
```

Contoh path asset:

```js
const ASSETS = {
  giftBox: '/assets/birthday-gift-hunt/icons/gift-box.svg',
  heart: '/assets/birthday-gift-hunt/icons/heart.svg',
  openingRoom: '/assets/birthday-gift-hunt/illustrations/opening-room.webp',
  finalGift: '/assets/birthday-gift-hunt/illustrations/final-big-gift.webp',
  warmBg: '/assets/birthday-gift-hunt/backgrounds/warm-cream-bg.webp'
};
```

## Font Rekomendasi

- Heading/body: `Nunito` atau `Quicksand`
- Clue/message: `Patrick Hand`

```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Patrick+Hand&display=swap" rel="stylesheet">
```

## QR Card Template

Folder `prints/` berisi template PNG untuk ditempel QR asli.

Contoh URL:

```txt
https://domain-kamu.com/gift-hunt?step=1
https://domain-kamu.com/gift-hunt?step=2
https://domain-kamu.com/gift-hunt?step=3
https://domain-kamu.com/gift-hunt?step=final
```

## LocalStorage State

```js
const state = {
  started: true,
  unlockedStep: 1,
  foundSteps: [],
  finalUnlocked: false,
  completed: false
};
localStorage.setItem('birthdayGiftHunt', JSON.stringify(state));
```

Jangan tampilkan total gift di UI supaya surprise tetap terasa.

## Import ke Figma / Canva / Illustrator

- Figma: drag & drop SVG/PNG/WebP ke canvas.
- Canva: upload PNG/SVG dari folder ini.
- Illustrator: buka SVG icons lalu `Save As .ai` jika perlu file Illustrator.
