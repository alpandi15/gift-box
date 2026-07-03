export const giftStepIds = [1, 2, 3, 4] as const;

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
		clue: 'Melangkahlah ke ruang tempat kita menyimpan mimpi kedua. Di sana ada benda yang setiap pagi selalu jujur memperlihatkan wajah tercantik yang aku kenal. Hari ini ia menyimpan rahasia — coba tengok apa yang diam-diam bersembunyi di kolongnya.',
		message:
			'Setiap pagi, wajahmu adalah pemandangan pertama yang membuat hariku layak dijalani. Terima kasih sudah jadi orang tercantik di rumah ini.',
		illustration: '/assets/illustrations/mirror-table.webp',
		qrToken: 'BDAY-GIFT-A',
		nextStep: 2,
		isFinalTrigger: false
	},
	{
		id: 2,
		title: 'Penjaga Setiap Langkah',
		clue: 'Sebelum menyapa dunia di luar sana, kita selalu singgah sejenak di dekat gerbang rumah. Ada penjaga setia yang menyimpan hal-hal yang menemani kaki kita berjalan ke mana pun. Di dekatnya, petunjuk berikutnya sedang menunggu.',
		message:
			'Ke mana pun langkahmu membawamu, aku selalu ingin jadi yang berjalan di sampingmu. Terima kasih sudah menemaniku sejauh ini.',
		illustration: '/assets/illustrations/bag-and-cup.webp',
		qrToken: 'BDAY-GIFT-B',
		nextStep: 3,
		isFinalTrigger: false
	},
	{
		id: 3,
		title: 'Tempat Berbaring yang Berpindah',
		clue: 'Menujulah ke ruang paling belakang di rumah kita. Di sana ada tempat peristirahatan yang dulu jadi sandaran lelah kita, namun kita relakan turun demi si kecil yang kedua. Yang dulu tempat berbaring, kini menyimpan rahasia di dalam perutnya. Bukalah perlahan.',
		message:
			'Banyak hal kecil kita relakan demi anak-anak kita, tanpa pernah kamu keluhkan. Terima kasih sudah jadi ibu yang begitu tulus dan penuh cinta.',
		illustration: '/assets/illustrations/opening-room.webp',
		qrToken: 'BDAY-GIFT-C',
		nextStep: 4,
		isFinalTrigger: false
	},
	{
		id: 4,
		title: 'Rumah Seribu Cerita',
		clue: 'Kejutan terakhir bersembunyi di tempat berkumpulnya seribu cerita dan pengetahuan. Deretan punggung yang berdiri rapi itu menjaganya dengan setia. Di sanalah babak akhir petualangan hari ini menantimu.',
		message:
			'Di antara semua cerita yang kita tulis bersama, kamu selalu jadi bab favoritku. Satu kejutan terakhir sudah menunggu — bukalah, ya.',
		illustration: '/assets/illustrations/final-big-gift.webp',
		qrToken: 'BDAY-GIFT-D',
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
