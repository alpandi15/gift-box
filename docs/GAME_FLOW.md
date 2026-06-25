# Game Flow — Birthday Gift Hunt

```text
/
└─ Mulai / Lanjutkan Misi
   ↓
/clue
└─ Tampilkan clue aktif
   └─ Scan QR yang Kamu Temukan
      ↓
   /scan
   ├─ Token tidak dikenal → pesan ramah, scanner tetap aktif
   ├─ Token lama → pesan ramah, progress tidak berubah
   ├─ Token terlalu cepat → pesan ramah, progress tidak berubah
   └─ Token sesuai currentStep
      ├─ Tambahkan step ke foundSteps
      ├─ Simpan lastUnlockedMessageStep
      ├─ Update currentStep atau finalUnlocked
      └─ Redirect ke /message
         ↓
      /message
      ├─ Masih ada clue → /clue
      └─ Gift terakhir → /final
```

## Token Mapping

| Gift Internal | Token |
| --- | --- |
| Giftbox A | `BDAY-GIFT-A` |
| Giftbox B | `BDAY-GIFT-B` |
| Giftbox C | `BDAY-GIFT-C` |

## Guard Rules

* `/clue`, `/scan`, dan `/message` membutuhkan misi yang sudah dimulai.
* `/message` membutuhkan `lastUnlockedMessageStep` yang sudah ditemukan.
* `/final` membutuhkan semua gift ditemukan dan `finalUnlocked`.
* Route QR lama `/gift/[step]` tidak digunakan.

## Camera Notes

* Production wajib menggunakan HTTPS agar browser mengizinkan kamera.
* Development dapat menggunakan `localhost`.
* Kamera dihentikan saat scan berhasil atau user meninggalkan `/scan`.
