# PRD — Birthday Gift Hunt Web Game

## 1. Overview

Birthday Gift Hunt adalah mini web game romantis berbasis SvelteKit untuk ulang tahun istri. Pemain mengikuti petunjuk satu per satu, mencari giftbox fisik, lalu memindai QR dari kamera di dalam web untuk membuka pesan dan petunjuk berikutnya.

Project ini frontend-only. Tidak ada backend, database, login, atau API. Semua progress disimpan di browser menggunakan localStorage.

## 2. Goal

Membuat pengalaman ulang tahun yang personal, romantis, ringan, dan nyaman dimainkan dari HP.

Alur utama:

1. Pemain membuka web dan memulai misi.
2. Web menampilkan satu clue aktif.
3. Pemain mencari giftbox fisik.
4. Pemain membuka scanner dari web dan memindai QR.
5. Token QR divalidasi terhadap clue aktif.
6. Web menampilkan pesan romantis dan membuka clue berikutnya.
7. Setelah semua gift ditemukan, halaman final terbuka.

## 3. Important Design Rule

Jumlah giftbox tidak boleh ditampilkan dalam gameplay.

UI gameplay tidak boleh menampilkan:

* Total giftbox.
* Progress angka seperti 1/3 atau 2/3.
* Map lengkap.
* Semua clue sekaligus.
* Token QR.

Game harus terasa seperti misi rahasia yang terbuka perlahan.

## 4. Pages

### `/`

Opening page dengan pesan ulang tahun dan tombol mulai atau lanjutkan misi.

### `/clue`

Menampilkan clue aktif berdasarkan `currentStep`.

Action utama:

* Tombol “Scan QR yang Kamu Temukan”.
* Redirect ke `/scan`.

### `/scan`

Halaman scanner QR internal.

Fungsi:

* Membuka kamera belakang jika tersedia.
* Membaca token dari QR.
* Memvalidasi token terhadap `currentStep`.
* Menolak token tidak dikenal, token lama, dan token yang belum waktunya.
* Jika valid, update progress dan redirect ke `/message`.

Kamera harus digunakan melalui HTTPS pada production. `localhost` tetap dapat digunakan untuk development.

### `/message`

Menampilkan pesan romantis dari step yang baru berhasil dipindai.

Action:

* Buka clue berikutnya melalui `/clue`.
* Jika gift terakhir ditemukan, lanjut ke `/final`.

### `/final`

Hanya terbuka setelah seluruh gift step ditemukan dan `finalUnlocked` aktif.

### `/qr-print`

Halaman owner/developer untuk membuat dan mencetak QR token. Halaman ini bukan bagian dari navigasi gameplay.

## 5. QR Content

QR gameplay tidak berisi URL.

Token internal:

* `BDAY-GIFT-A`
* `BDAY-GIFT-B`
* `BDAY-GIFT-C`

Token disimpan di data step melalui field `qrToken`.

## 6. LocalStorage State

Key:

`birthdayGiftHunt`

Format:

```json
{
  "started": false,
  "currentStep": 1,
  "foundSteps": [],
  "lastUnlockedMessageStep": null,
  "finalUnlocked": false,
  "completed": false
}
```

## 7. Step Rules

* Step pertama terbuka setelah pemain memulai misi.
* Token valid hanya jika sesuai dengan `currentStep`.
* Token step berikutnya tidak boleh membuka progress lebih awal.
* Token yang sudah ditemukan tidak boleh mengubah progress atau memundurkan `currentStep`.
* Setelah scan valid, step ditambahkan ke `foundSteps` tanpa duplikasi.
* `lastUnlockedMessageStep` menunjuk pesan terakhir yang berhasil dibuka.
* Gift terakhir mengaktifkan `finalUnlocked`.
* Refresh tidak boleh merusak progress.
* State parsial atau corrupt harus kembali ke kondisi aman.

## 8. Visual Direction

* Romantic
* Warm
* Cute
* Soft pastel
* Paper note style
* Rounded card
* Hand-drawn illustration
* Cozy home feeling

Warna utama:

* Cream
* Peach
* Soft pink
* Warm brown
* Muted purple

## 9. Technical Stack

* SvelteKit
* TypeScript
* Tailwind CSS
* localStorage
* `@zxing/browser` untuk scanner kamera
* `qrcode` untuk QR print

## 10. Non Goals

* Backend
* Database
* Login
* Admin panel
* API
* Payment
* Analytics
* Multi-user

## 11. Acceptance Criteria

* Opening dan clue berjalan dari HP.
* Scanner membuka kamera dari dalam web.
* Token yang benar membuka pesan sesuai step.
* Token salah atau terlalu cepat ditolak dengan pesan ramah.
* Progress tidak dapat dilompati.
* Refresh aman pada clue, scan, message, dan final.
* Final hanya terbuka setelah seluruh gift ditemukan.
* QR print menghasilkan QR token yang dapat dipindai.
* Gameplay tidak menampilkan jumlah gift atau token.
