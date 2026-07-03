# Birthday Gift Hunt

Frontend-only mobile treasure hunt berbasis SvelteKit. Progress disimpan di localStorage dan QR dipindai melalui kamera di dalam web.

## Development

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

Route utama:

* `/` — opening.
* `/clue` — clue aktif.
* `/scan` — scanner QR internal.
* `/message` — pesan terakhir yang terbuka.
* `/final` — pesan final.
* `/qr-print` — halaman internal untuk mencetak QR token.

## QR Tokens

QR giftbox berisi plain text token, bukan URL:

```text
BDAY-GIFT-A
BDAY-GIFT-B
BDAY-GIFT-C
```

Gunakan `/qr-print` untuk membuat dan mencetak QR.

## Camera Requirements

Browser hanya mengizinkan kamera pada secure context:

* `localhost` untuk development.
* HTTPS untuk production.

Saat menguji dari HP di jaringan lokal menggunakan alamat IP HTTP, kamera mungkin ditolak oleh browser. Gunakan HTTPS tunnel atau deployment preview.

## Background Music

Background music memakai file lokal `static/assets/musics/music.mp3`. Browser mobile tidak mengizinkan autoplay sebelum interaksi user, jadi musik mulai setelah user klik disc musik atau tombol mulai misi.

## Validation

```bash
npm run check
npm run build
```

Tidak ada backend, database, login, atau API.
