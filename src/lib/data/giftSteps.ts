export const giftStepIds = [1, 2, 3, 4, 5] as const;

export type GiftStepId = (typeof giftStepIds)[number];

export interface GiftStep {
	id: GiftStepId;
	title: string;
	clue: string;
	message: string;
	illustration: string;
	qrToken: string;
	nextStep: GiftStepId | null;
	isFinalTrigger: boolean;
}

export const giftSteps = [
	{
		id: 1,
		title: 'Pantulan Paling Jujur',
		clue: 'Melangkahlah ke sudut tempat kamu biasa berbenah — sebelum pergi ke mana-mana, atau setelah selesai mandi. Di sana ada satu tempat yang setia memantulkan wajah paling cantik yang pernah aku pandang. Coba menunduk sedikit — ada catatan kecil yang diam-diam menunggumu di kolongnya.',
		message:
			'Setiap pagi, wajahmu adalah pemandangan pertama yang membuat hariku layak dijalani. Terima kasih sudah jadi orang tercantik di rumah ini.',
		illustration: '/assets/illustrations/mirror-table.webp',
		qrToken: 'CATATAN-1',
		nextStep: 2,
		isFinalTrigger: false
	},
	{
		id: 2,
		title: 'Penjaga Setiap Langkah',
		clue: 'Di rumah kita ada satu daun pintu yang jarang sekali dibuka, nyaris terlupakan. Justru di baliknya bersembunyi para penjaga langkah — benda-benda setia yang menemani kakimu ke mana pun kamu pergi. Beranikan diri membukanya, lalu menunduklah sebentar; catatan berikutnya sudah menunggu di sana.',
		message:
			'Ke mana pun langkahmu membawamu, aku selalu ingin jadi yang berjalan di sampingmu. Terima kasih sudah menemaniku sejauh ini.',
		illustration: '/assets/illustrations/rak-sepatu.png',
		qrToken: 'CATATAN-2',
		nextStep: 3,
		isFinalTrigger: false
	},
	{
		id: 3,
		title: 'Tempat Berbaring yang Berpindah',
		clue: 'Menujulah ke ruang paling belakang di rumah kita. Di sana ada tempat peristirahatan yang dulu jadi sandaran lelah kita, namun kita relakan turun demi si kecil yang kedua. Di dalam perutnya, tersimpan diam-diam catatan berikutnya. Bukalah perlahan.',
		message:
			'Banyak hal kecil kita relakan demi anak-anak kita, tanpa pernah kamu keluhkan. Terima kasih sudah jadi ibu yang begitu tulus dan penuh cinta.',
		illustration: '/assets/illustrations/tempat-tidur.png',
		qrToken: 'CATATAN-3',
		nextStep: 4,
		isFinalTrigger: false
	},
	{
		id: 4,
		title: 'Rumah Seribu Cerita',
		clue: 'Menepilah ke tempat berkumpulnya seribu cerita dan pengetahuan. Deretan punggung yang berdiri rapi itu menyimpan satu catatan lagi dariku. Ambil pelan-pelan, lalu lanjutkan langkahmu.',
		message:
			'Di antara semua cerita yang kita tulis bersama, kamu selalu jadi bab favoritku. Masih ada satu tempat lagi yang ingin aku tunjukkan — ikuti terus, ya.',
		illustration: '/assets/illustrations/rak-buku.png',
		qrToken: 'CATATAN-4',
		nextStep: 5,
		isFinalTrigger: false
	},
	{
		id: 5,
		title: 'Sudut yang Sering Merebut Waktuku',
		clue: 'Ada satu sudut di rumah ini tempat aku sering tenggelam dalam pekerjaan — mungkin terlalu sering. Menujulah ke meja tempat aku biasa bekerja, lalu menunduklah dan raih pelan-pelan ke kolongnya. Ada sesuatu yang diam-diam aku titipkan di sana untukmu.',
		message:
			'Maafkan aku, cintaku. Terlalu sering waktuku habis di meja kerja ini, sampai kadang aku lupa bahwa waktu paling berharga adalah yang aku habiskan bersamamu dan anak-anak. Maaf juga bila ada hari-hari aku kurang sempat membantumu menjaga rumah kecil kita. Terima kasih untuk kesabaran dan cinta yang tak pernah kamu kurangi, ya, sayang.',
		illustration: '/assets/illustrations/meja-kerja.png',
		qrToken: 'CATATAN-5',
		nextStep: null,
		isFinalTrigger: true
	}
] as const satisfies readonly GiftStep[];

export function isGiftStepId(value: unknown): value is GiftStepId {
	return giftStepIds.some((stepId) => stepId === value);
}

export function getGiftStep(stepId: GiftStepId): GiftStep {
	return giftSteps.find((step) => step.id === stepId) as GiftStep;
}

export function normalizeQrToken(value: string): string {
	return value.trim().toUpperCase();
}

export function getGiftStepByQrToken(qrToken: string): GiftStep | null {
	const normalizedToken = normalizeQrToken(qrToken);
	return giftSteps.find((step) => step.qrToken === normalizedToken) ?? null;
}
