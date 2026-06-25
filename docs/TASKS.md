# TASKS — Birthday Gift Hunt

## Phase 1 — Project Setup

- [x] Setup SvelteKit, TypeScript, Tailwind, assets, dan global theme.
- [x] Terapkan layout mobile-first dan design tokens.

## Phase 2 — Data & Storage

- [x] Buat `giftSteps.ts` dengan clue, message, illustration, next step, dan `qrToken`.
- [x] Buat utility localStorage.
- [x] Normalisasi state corrupt atau parsial.
- [x] Buat guard token dan final.

State:

```ts
{
  started: boolean;
  currentStep: GiftStepId;
  foundSteps: GiftStepId[];
  lastUnlockedMessageStep: GiftStepId | null;
  finalUnlocked: boolean;
  completed: boolean;
}
```

## Phase 3 — Base Components

- [x] AppShell
- [x] Button
- [x] PaperCard
- [x] ClueCard
- [x] MessageCard
- [x] GuardNotice
- [x] UnlockCard

## Phase 4 — Main Pages

- [x] `/` opening dan resume.
- [x] `/clue` clue aktif dan CTA scanner.
- [x] `/scan` scanner kamera internal.
- [x] `/message` pesan dari scan terakhir.
- [x] `/final` final guard dan completion.
- [x] Hapus flow unlock berbasis `/gift/[step]`.

## Phase 5 — QR Print

- [x] Install `qrcode`.
- [x] Generate QR dari token internal.
- [x] Mode tempel menyembunyikan label dan token.
- [x] Print layout siap potong.

## Phase 6 — Polish & Testing

- [x] Mobile safe-area dan no horizontal overflow.
- [x] Micro animation dan reduced-motion.
- [x] Reset progress.
- [x] Guard state corrupt, duplicate, dan urutan scan.
- [ ] Test kamera dan scan fisik pada HP target.
- [ ] Test print fisik QR.

## Phase 7 — Deploy

- [ ] Deploy ke Vercel atau Netlify.
- [ ] Pastikan production menggunakan HTTPS.
- [ ] Test izin kamera pada domain production.
- [ ] Cetak QR token dan tempel ke giftbox.
- [ ] Jalankan full flow pada HP target.
