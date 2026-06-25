# TASKS — Birthday Gift Hunt

## Phase 1 — Project Setup

### Task 1 — Setup Tailwind Theme

* Install dan setup Tailwind CSS.
* Import `design-tokens.css`.
* Buat global style untuk body, font, background, dan mobile layout.

Acceptance Criteria:

* Background warm cream tampil.
* Font dan warna mengikuti design tokens.
* Layout nyaman di mobile.

## Phase 2 — Data & Storage

### Task 2.1 — Create Gift Step Data

Buat file:

`src/lib/data/giftSteps.ts`

Isi data:

* id
* title
* clue
* message
* illustration
* nextStep
* isFinalTrigger

Acceptance Criteria:

* Data step bisa diimport dari page/component.
* UI tidak hardcode semua text di page.

### Task 2.2 — Create LocalStorage Utility

Buat file:

`src/lib/utils/storage.ts`

Fungsi:

* getHuntState()
* setHuntState()
* resetHuntState()
* updateHuntState()

Acceptance Criteria:

* State bisa disimpan.
* State tetap ada setelah refresh.
* Reset state berfungsi.

### Task 2.3 — Create Step Guard

Buat file:

`src/lib/utils/stepGuard.ts`

Fungsi:

* canOpenGiftStep(step)
* canOpenFinal()
* getCurrentClueStep()

Acceptance Criteria:

* User tidak bisa lompat step.
* Scan QR terlalu cepat menampilkan guard notice.

## Phase 3 — Base Components

### Task 3.1 — Create UI Components

Buat components:

* AppShell.svelte
* Button.svelte
* PaperCard.svelte
* ClueCard.svelte
* MessageCard.svelte
* GuardNotice.svelte
* UnlockCard.svelte

Acceptance Criteria:

* Component reusable.
* Style konsisten.
* Tidak ada logic besar di component UI kecil.

## Phase 4 — Main Pages

### Task 4.1 — Opening Page `/`

Fitur:

* Tampilkan opening message.
* Button Mulai Misi.
* Klik button menyimpan started true.
* Redirect ke `/clue`.

Acceptance Criteria:

* Tidak menampilkan jumlah gift.
* Opening terasa romantis dan simple.

### Task 4.2 — Clue Page `/clue`

Fitur:

* Ambil current step dari localStorage.
* Tampilkan clue aktif.
* Tampilkan ilustrasi sesuai step.
* Button “Aku Siap Mencari”.

Acceptance Criteria:

* Clue berubah sesuai currentStep.
* Tidak ada progress angka.
* Tidak ada spoiler jumlah gift.

### Task 4.3 — Gift Page `/gift/[step]`

Fitur:

* Ambil step dari URL.
* Validasi step.
* Jika valid, mark step sebagai found.
* Tampilkan pesan romantis.
* Button lanjut ke clue berikutnya atau final clue.

Acceptance Criteria:

* QR step valid membuka pesan.
* QR step terlalu cepat ditolak.
* Setelah pesan, step berikutnya terbuka.

### Task 4.4 — Final Page `/final`

Fitur:

* Validasi finalUnlocked.
* Tampilkan final birthday message.
* Tampilkan button Simpan Momen Ini / Selesai.

Acceptance Criteria:

* Final tidak bisa dibuka sebelum waktunya.
* Final hanya tampil setelah semua step selesai.

## Phase 5 — QR Print Page

### Task 5.1 — Install QR Library

Install:

```bash
npm install qrcode
```

### Task 5.2 — Create `/qr-print`

Fitur:

* Generate QR untuk `/gift/1`, `/gift/2`, `/gift/3`, dan `/final`.
* Tampilkan card QR siap screenshot/print.
* Sertakan label internal kecil, bukan untuk spoiler pemain.

Acceptance Criteria:

* QR bisa discan dari HP.
* QR mengarah ke URL yang benar.
* Bisa diprint.

## Phase 6 — Polish & Testing

### Task 6.1 — Mobile Polish

* Optimasi layout 360px sampai 430px width.
* Pastikan button tidak tertutup.
* Pastikan card tidak overflow.
* Tambahkan transisi ringan.

### Task 6.2 — Full Flow Test

Test:

* Fresh open.
* Start mission.
* Open clue.
* Scan gift 1.
* Try scan gift 3 too early.
* Continue gift 2.
* Continue gift 3.
* Open final.
* Refresh di tiap step.
* Reset progress.

Acceptance Criteria:

* Semua flow berjalan.
* Tidak ada step bocor.
* Tidak ada broken route.
* Tidak ada error console penting.

## Phase 7 — Deploy

* Deploy ke Vercel/Netlify.
* Set domain final.
* Generate QR menggunakan domain final.
* Print QR.
* Tempel QR ke giftbox.

Acceptance Criteria:

* Web bisa dibuka dari HP.
* QR printed membuka URL production.
* Game siap dimainkan.
