<script lang="ts">
	import {
		AppShell,
		Button,
		ClueCard,
		GuardNotice,
		MessageCard,
		PaperCard,
		UnlockCard
	} from '$lib';
</script>

<AppShell title="Component Preview — Birthday Gift Hunt" background="warm">
	<div class="space-y-8 py-4">
		<header class="text-center">
			<p class="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-dark">
				Development preview
			</p>
			<h1 class="mt-2 text-3xl font-extrabold text-brown">Birthday Gift Hunt</h1>
			<p class="mt-2 text-sm leading-6 text-muted">Kumpulan komponen dasar untuk tampilan mobile.</p>
		</header>

		<section class="space-y-3">
			<h2 class="text-lg font-extrabold text-brown">Buttons</h2>
			<Button fullWidth>Mulai Misi</Button>
			<Button variant="secondary" fullWidth>Aku Siap Mencari</Button>
			<Button variant="ghost" fullWidth>Lewati untuk Sekarang</Button>
			<Button variant="danger" fullWidth>Reset Progress</Button>
			<Button disabled fullWidth>Tombol Tidak Aktif</Button>
		</section>

		<PaperCard
			title="Catatan Kecil"
			subtitle="Sebuah ruang hangat untuk pesan pembuka."
			icon="/assets/icons/flower.svg"
		>
			<p class="text-center leading-7 text-ink">
				Hari ini ada misi kecil yang dibuat khusus untukmu. Ikuti setiap petunjuk dengan santai.
			</p>
		</PaperCard>

		<ClueCard
			title="Cari Sudut yang Hangat"
			clue="Cari tempat kita biasa duduk santai dan berbagi cerita."
			illustration="/assets/illustrations/sofa-corner.webp"
		/>

		<MessageCard
			title="Satu Pesan Kecil Untukmu"
			message="Terima kasih sudah membuat setiap waktu sederhana terasa hangat dan istimewa."
			illustration="/assets/illustrations/envelope-heart.webp"
			note="Simpan senyum itu, petualangannya belum selesai."
		/>

		<GuardNotice />

		<UnlockCard />
	</div>
</AppShell>
