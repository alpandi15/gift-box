# PRD — Birthday Gift Hunt Web Game

## 1. Overview

Birthday Gift Hunt adalah mini web game romantis berbasis SvelteKit untuk ulang tahun istri. Game ini berbentuk treasure hunt di rumah, di mana pemain mengikuti petunjuk satu per satu, mencari giftbox fisik, scan QR code, membaca pesan, lalu membuka petunjuk berikutnya sampai mencapai hadiah utama.

Project ini tidak menggunakan backend, database, login, atau API. Semua progress disimpan di browser menggunakan localStorage.

## 2. Goal

Membuat pengalaman ulang tahun yang personal, romantis, ringan, dan mudah dimainkan dari HP.

Tujuan utama:

* Pemain membuka web dari HP.
* Pemain membaca opening message.
* Pemain mendapat clue pertama.
* Pemain mencari giftbox fisik.
* Pemain scan QR pada giftbox.
* Web menampilkan pesan romantis.
* Web membuka clue berikutnya.
* Game selesai saat pemain menemukan hadiah utama.

## 3. Important Design Rule

Jumlah giftbox tidak boleh ditampilkan di awal.

UI tidak boleh menampilkan:

* Total giftbox.
* Progress angka seperti 1/3 atau 2/3.
* Map lengkap dari awal.
* Semua step sekaligus.

Game harus terasa seperti misi rahasia yang terbuka perlahan.

## 4. Core Experience

Alur pengalaman pemain:

1. Opening screen.
2. Klik Mulai Misi.
3. Tampil clue pertama.
4. Pemain mencari giftbox.
5. Pemain scan QR.
6. Tampil pesan romantis.
7. Pemain klik buka petunjuk berikutnya.
8. Proses berulang sampai final.
9. Pemain menemukan big gift.
10. Tampil final birthday message.

## 5. Pages

### `/`

Opening page.

Konten:

* Sapaan ulang tahun.
* Pesan singkat bahwa ada misi kecil.
* Tidak menyebut jumlah hadiah.
* Button Mulai Misi.

Action:

* Set `started = true` di localStorage.
* Redirect ke `/clue`.

### `/clue`

Current clue page.

Konten:

* Clue aktif berdasarkan `currentStep`.
* Ilustrasi sesuai clue.
* Button “Aku Siap Mencari”.

Tidak boleh menampilkan jumlah step.

### `/gift/[step]`

Halaman yang dibuka dari QR giftbox.

Fungsi:

* Validasi apakah step boleh dibuka.
* Jika step valid, tandai gift sebagai ditemukan.
* Tampilkan pesan romantis untuk step tersebut.
* Tampilkan button untuk membuka petunjuk berikutnya.

Jika step belum waktunya, tampilkan guard notice:

“Eits, belum waktunya membuka bagian ini 😄 Balik dulu ke petunjuk sebelumnya ya.”

### `/final`

Halaman final gift.

Fungsi:

* Hanya bisa dibuka setelah semua step gift selesai.
* Jika belum valid, tampilkan guard notice.
* Jika valid, tampilkan final message ulang tahun.

### `/qr-print`

Halaman khusus untuk generate/preview daftar QR yang akan dicetak.

Halaman ini hanya untuk owner/developer, bukan bagian dari gameplay utama.

## 6. LocalStorage State

Key localStorage:

`birthdayGiftHunt`

Format:

```json
{
  "started": false,
  "currentStep": 1,
  "foundSteps": [],
  "finalUnlocked": false,
  "completed": false
}
```

## 7. Step Rules

* Step pertama terbuka setelah pemain klik Mulai Misi.
* `/gift/1` hanya valid jika game sudah started dan currentStep adalah 1.
* `/gift/2` hanya valid jika step 1 sudah ditemukan.
* `/gift/3` hanya valid jika step 2 sudah ditemukan.
* `/final` hanya valid jika semua gift step sudah ditemukan.
* Jika user scan QR terlalu cepat, jangan unlock step tersebut.
* Jika user refresh, progress tetap lanjut dari localStorage.
* Harus ada tombol reset progress untuk developer/testing, tapi jangan terlalu mencolok di UI utama.

## 8. Visual Direction

Style:

* Romantic
* Warm
* Cute
* Soft pastel
* Paper note style
* Rounded card
* Hand-drawn illustration
* Cozy home feeling

Color direction:

* Cream
* Peach
* Soft pink
* Warm brown
* Muted purple for secret/final clue

## 9. Assets

Assets berada di folder:

```txt
static/assets/
├── icons/
├── illustrations/
├── backgrounds/
├── prints/
└── design-tokens.css
```

Gunakan SVG untuk icon dan WebP/PNG untuk ilustrasi/background.

## 10. Technical Stack

* SvelteKit
* TypeScript
* Tailwind CSS
* localStorage
* qrcode package untuk halaman QR print
* Deploy ke Vercel atau Netlify

## 11. Non Goals

Project ini tidak membutuhkan:

* Backend
* Database
* Login
* Admin panel
* API
* Payment
* Analytics
* Multi user

## 12. Acceptance Criteria

Game dianggap selesai jika:

* Opening bisa dimulai.
* Clue pertama muncul.
* QR giftbox membuka halaman pesan sesuai step.
* Step tidak bisa dilompati.
* Progress tetap aman saat refresh.
* Final page hanya bisa dibuka setelah step sebelumnya selesai.
* Tampilan mobile nyaman.
* Semua asset tampil dengan benar.
* QR print page bisa menampilkan QR untuk setiap step.
* Project bisa dideploy dan dimainkan dari HP.
