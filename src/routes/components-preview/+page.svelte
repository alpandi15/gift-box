<script lang="ts">
	import {
		AppShell,
		Button,
		ClueCard,
		GuardNotice,
		HeartsScatter,
		LetterCard,
		MessageCard,
		PaperCard,
		Polaroid,
		Tape,
		TapeLabel,
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

		<section class="space-y-3">
			<h2 class="text-lg font-extrabold text-brown">Scrapbook primitives</h2>

			<div class="flex flex-wrap items-start gap-4">
				<Polaroid
					src="/assets/illustrations/couple-polaroid-placeholder.webp"
					caption="kita ❤️"
				/>
				<div class="space-y-2">
					<TapeLabel text="Petunjuk Pertama" color="purple" icon="/assets/icons/sparkle.svg" />
					<TapeLabel text="Pesan Untukmu" color="peach" icon="/assets/icons/heart.svg" />
					<TapeLabel text="Catatan Kecil" color="neutral" />
				</div>
			</div>

			<PaperCard torn tilt={-1} class="relative">
				<span class="relative"><Tape color="neutral" position="top-right" /></span>
				<p class="font-script text-2xl text-center text-brown">Kartu kertas robek + selotip</p>
			</PaperCard>

			<LetterCard
				title="Untukmu, Sayang ❤️"
				message="Selamat ulang tahun, cintaku. Terima kasih sudah jadi rumah paling nyaman untuk aku pulang."
				signature="Aku selalu memilihmu."
			/>

			<div class="relative min-h-40 rounded-xl border border-tan/50 bg-cream-soft/60">
				<HeartsScatter />
				<p class="relative py-16 text-center text-sm text-muted">Hati bertebaran (dekoratif)</p>
			</div>
		</section>
	</div>
</AppShell>
